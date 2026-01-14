import { serve } from "https://deno.land/std/http/server.ts";
console.log("🚀 LOVABLE DEPLOY CHECK v3 — 2026-01-14");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_CHAT_ID = "-1002001547391";

serve(async (req: Request): Promise<Response> => {
  console.log("==== send-telegram function called ====");
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  // CORS
  if (req.method === "OPTIONS") {
    console.log("OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- BODY ---
    let rawBody: any = null;
    try {
      rawBody = await req.json();
    } catch (e) {
      console.error("Failed to parse JSON body:", e);
    }

    console.log("RAW BODY:", rawBody);

    const data = rawBody?.body ?? rawBody;
    console.log("PARSED DATA:", data);

    const name = data?.name?.trim();
    const phone = data?.phone?.trim();
    const message = data?.message?.trim();

    console.log("FIELDS:", { name, phone, message });

    if (!name || !phone) {
      console.warn("Validation failed: name or phone missing");
      return new Response(
        JSON.stringify({ error: "Имя и телефон обязательны" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // --- TOKEN ---
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    console.log("BOT TOKEN EXISTS:", Boolean(botToken));

    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN is missing");
      throw new Error("TELEGRAM_BOT_TOKEN не задан");
    }

    // --- MESSAGE ---
    const text = `🧹 *Новая заявка с сайта Clean House*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
${message ? `💬 *Сообщение:* ${message}` : ""}

📅 *Дата:* ${new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
    })}`;

    console.log("MESSAGE TEXT:", text);

    // --- TELEGRAM REQUEST ---
    console.log("Sending request to Telegram...");
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log("Telegram URL:", telegramUrl.replace(botToken, "***"));

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    console.log("Telegram HTTP status:", telegramResponse.status);

    let telegramResult: any = null;
    try {
      telegramResult = await telegramResponse.json();
    } catch (e) {
      console.error("Failed to parse Telegram response JSON:", e);
    }

    console.log("Telegram response body:", telegramResult);

    if (!telegramResponse.ok || !telegramResult?.ok) {
      console.error("Telegram API error:", telegramResult);
      throw new Error(
        telegramResult?.description || "Ошибка Telegram API"
      );
    }

    console.log("Telegram message sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("UNHANDLED ERROR:", error);

    return new Response(
      JSON.stringify({
        error: "Ошибка при обработке заявки",
        details: error?.message ?? error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
