import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

// Simple in-memory rate limiting (per instance)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 3;

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Метод не поддерживается" }, 405);
  }

  try {
    // --- RATE LIMIT ---
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const record = rateLimit.get(clientIp);
    if (record && now - record.timestamp < WINDOW_MS) {
      if (record.count >= MAX_REQUESTS) {
        return json({ error: "Слишком много запросов. Попробуйте позже." }, 429);
      }
      record.count++;
    } else {
      rateLimit.set(clientIp, { count: 1, timestamp: now });
    }

    // --- BODY ---
    let rawBody: unknown = null;
    try {
      rawBody = await req.json();
    } catch {
      return json({ error: "Некорректный запрос" }, 400);
    }

    const data = (rawBody as Record<string, unknown> | null)?.body ?? rawBody;
    const src = (data ?? {}) as Record<string, unknown>;

    const name = typeof src.name === "string" ? src.name.trim() : "";
    const phone = typeof src.phone === "string" ? src.phone.trim() : "";
    const message = typeof src.message === "string" ? src.message.trim() : "";

    // --- VALIDATION ---
    if (name.length < 2 || name.length > 100) {
      return json({ error: "Имя должно быть от 2 до 100 символов" }, 400);
    }
    if (!/^[\p{L}\s'’\-.]{2,100}$/u.test(name)) {
      return json({ error: "Имя содержит недопустимые символы" }, 400);
    }
    if (!/^[+]?[0-9\s()\-]{7,20}$/.test(phone)) {
      return json({ error: "Неверный формат телефона" }, 400);
    }
    if (message.length > 1000) {
      return json(
        { error: "Сообщение слишком длинное (макс. 1000 символов)" },
        400,
      );
    }

    // --- CONFIG ---
    const token = Deno.env.get("MAX_BOT_TOKEN");
    const chatId = Deno.env.get("MAX_CHAT_ID");
    if (!token || !chatId) {
      console.error("MAX configuration missing");
      return json({ error: "Ошибка при обработке заявки" }, 500);
    }

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

    const maxResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!maxResponse.ok) {
      const errorBody = await maxResponse.text();
      console.error(`MAX API error [${maxResponse.status}]: ${errorBody}`);
      return json({ error: "Ошибка при обработке заявки" }, 502);
    }

    return json({ success: true }, 200);
  } catch (error) {
    console.error("Unhandled error in send-max:", error);
    return json({ error: "Ошибка при обработке заявки" }, 500);
  }
});
