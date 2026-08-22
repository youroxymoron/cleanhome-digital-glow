import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://cleanhousednr.ru",
  "https://www.cleanhousednr.ru",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
];

const allowedOrigins = new Set(
  (Deno.env.get("CONTACT_ALLOWED_ORIGINS") || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const MAX_BODY_BYTES = 8_192;
const MIN_FILL_TIME_MS = 3_000;
const MAX_FILL_TIME_MS = 2 * 60 * 60 * 1_000;
const RATE_WINDOW_MS = 10 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 2;
const DUPLICATE_WINDOW_MS = 30 * 60 * 1_000;
const MAX_CACHE_ENTRIES = 10_000;

type RateRecord = { count: number; resetAt: number };

const ipRateLimit = new Map<string, RateRecord>();
const recentSubmissions = new Map<string, number>();

function corsHeaders(origin: string | null) {
  return {
    ...(origin && allowedOrigins.has(origin)
      ? { "Access-Control-Allow-Origin": origin }
      : {}),
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
    },
  });
}

function getClientIp(req: Request) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function cleanupCaches(now: number) {
  if (ipRateLimit.size > MAX_CACHE_ENTRIES) {
    for (const [key, record] of ipRateLimit) {
      if (record.resetAt <= now) ipRateLimit.delete(key);
    }
  }

  if (recentSubmissions.size > MAX_CACHE_ENTRIES) {
    for (const [key, expiresAt] of recentSubmissions) {
      if (expiresAt <= now) recentSubmissions.delete(key);
    }
  }
}

function isRateLimited(ip: string, now: number) {
  const record = ipRateLimit.get(ip);
  if (!record || record.resetAt <= now) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) return true;
  record.count += 1;
  return false;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return true;
  if (!token || token.length > 2_048) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
        signal: controller.signal,
      },
    );
    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
    };
    return Boolean(
      response.ok &&
        result.success &&
        (!result.hostname ||
          result.hostname === "cleanhousednr.ru" ||
          result.hostname === "www.cleanhousednr.ru" ||
          result.hostname === "localhost"),
    );
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

type PersistentRateResult = {
  allowed?: boolean;
  duplicate?: boolean;
  retry_after?: number;
};

async function callSupabaseRpc<T>(functionName: string, body: unknown) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return null;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/${functionName}`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      console.error(`Rate-limit RPC ${functionName} failed: ${response.status}`);
      return null;
    }

    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  } catch (error) {
    console.error(`Rate-limit RPC ${functionName} failed`, error);
    return null;
  }
}

function escapeMarkdown(text: string) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

async function sendTelegram(name: string, phone: string, message: string) {
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!botToken || !chatId) throw new Error("Telegram configuration missing");

  const text = `🧹 *Новая заявка с сайта Clean House*

👤 *Имя:* ${escapeMarkdown(name)}
📞 *Телефон:* ${escapeMarkdown(phone)}
${message ? `💬 *Сообщение:* ${escapeMarkdown(message)}` : ""}

📅 *Дата:* ${escapeMarkdown(
    new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }),
  )}`;

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "MarkdownV2" }),
    },
  );
  const result = await response.json().catch(() => null) as {
    ok?: boolean;
    description?: string;
  } | null;

  if (!response.ok || !result?.ok) {
    throw new Error(`Telegram API error: ${result?.description || response.status}`);
  }
}

async function sendMax(name: string, phone: string, message: string) {
  const token = Deno.env.get("MAX_BOT_TOKEN");
  const chatId = Deno.env.get("MAX_CHAT_ID");
  if (!token || !chatId) throw new Error("MAX configuration missing");

  const text = [
    "🧹 Новая заявка с сайта Clean House",
    "",
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone}`,
    message ? `💬 Сообщение: ${message}` : null,
    "",
    `📅 Дата: ${new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
    })}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const url = `https://botapi.max.ru/messages?access_token=${encodeURIComponent(
    token,
  )}&chat_id=${encodeURIComponent(chatId)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`MAX API error: ${response.status}`);
  }
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: allowedOrigins.has(origin || "") ? 204 : 403,
      headers: corsHeaders(origin),
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Метод не поддерживается" }, 405, origin);
  }

  if (!origin || !allowedOrigins.has(origin)) {
    return json({ error: "Запрос отклонён" }, 403, origin);
  }

  const contentType = req.headers.get("content-type") || "";
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "Некорректный запрос" }, 415, origin);
  }
  if (contentLength > MAX_BODY_BYTES) {
    return json({ error: "Некорректный запрос" }, 413, origin);
  }

  const ip = getClientIp(req);
  const now = Date.now();
  cleanupCaches(now);

  if (isRateLimited(ip, now)) {
    return json(
      { error: "Слишком много заявок. Попробуйте через 10 минут." },
      429,
      origin,
    );
  }

  let rawBody: unknown;
  try {
    const rawText = await req.text();
    if (new TextEncoder().encode(rawText).byteLength > MAX_BODY_BYTES) {
      return json({ error: "Некорректный запрос" }, 413, origin);
    }
    rawBody = JSON.parse(rawText);
  } catch {
    return json({ error: "Некорректный запрос" }, 400, origin);
  }

  const data = (rawBody as Record<string, unknown> | null)?.body ?? rawBody;
  const src = (data ?? {}) as Record<string, unknown>;
  const name = typeof src.name === "string" ? src.name.trim() : "";
  const phone = typeof src.phone === "string" ? src.phone.trim() : "";
  const message = typeof src.message === "string" ? src.message.trim() : "";
  const website = typeof src.website === "string" ? src.website.trim() : "";
  const turnstileToken =
    typeof src.turnstileToken === "string" ? src.turnstileToken : "";
  const formStartedAt = Number(src.formStartedAt);

  // Honeypot and timing checks intentionally return a generic success response.
  if (
    website ||
    !Number.isFinite(formStartedAt) ||
    now - formStartedAt < MIN_FILL_TIME_MS ||
    now - formStartedAt > MAX_FILL_TIME_MS
  ) {
    return json({ success: true }, 200, origin);
  }

  if (
    name.length < 2 ||
    name.length > 100 ||
    !/^[\p{L}\s'’\-.]{2,100}$/u.test(name)
  ) {
    return json({ error: "Проверьте имя" }, 400, origin);
  }
  if (!/^[+]?[0-9\s()\-]{7,20}$/.test(phone)) {
    return json({ error: "Проверьте телефон" }, 400, origin);
  }
  if (message.length > 1_000) {
    return json({ error: "Сообщение слишком длинное" }, 400, origin);
  }
  if (/(?:https?:\/\/|www\.|t\.me\/|wa\.me\/)/i.test(`${name} ${message}`)) {
    return json({ error: "Ссылки в заявке не поддерживаются" }, 400, origin);
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return json({ error: "Не удалось подтвердить, что вы не робот" }, 403, origin);
  }

  const normalizedPhone = phone.replace(/\D/g, "");
  const fingerprint = await sha256(
    `${normalizedPhone}|${name.toLocaleLowerCase("ru-RU")}|${message.toLocaleLowerCase("ru-RU")}`,
  );
  const ipHash = await sha256(ip);
  const duplicateExpiresAt = recentSubmissions.get(fingerprint);
  if (duplicateExpiresAt && duplicateExpiresAt > now) {
    return json({ success: true }, 200, origin);
  }

  const persistentRate = await callSupabaseRpc<PersistentRateResult>(
    "check_contact_submission_rate",
    { p_ip_hash: ipHash, p_submission_hash: fingerprint },
  );
  if (persistentRate?.duplicate) {
    return json({ success: true }, 200, origin);
  }
  if (persistentRate && !persistentRate.allowed) {
    return json(
      {
        error: "Слишком много заявок. Попробуйте позже.",
        retryAfter: persistentRate.retry_after || 600,
      },
      429,
      origin,
    );
  }

  const results = await Promise.allSettled([
    sendTelegram(name, phone, message),
    sendMax(name, phone, message),
  ]);
  const delivered = results.some((result) => result.status === "fulfilled");

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Contact delivery failed", result.reason);
    }
  });

  if (!delivered) {
    return json({ error: "Не удалось отправить заявку" }, 502, origin);
  }

  recentSubmissions.set(fingerprint, now + DUPLICATE_WINDOW_MS);
  await callSupabaseRpc<void>("mark_contact_submission_delivered", {
    p_ip_hash: ipHash,
    p_submission_hash: fingerprint,
  });
  return json({ success: true }, 200, origin);
});
