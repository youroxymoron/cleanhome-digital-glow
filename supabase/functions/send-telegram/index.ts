import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_CHAT_ID = "-2001547391";

serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Универсальный парсер body (Supabase invoke / fetch)
    const rawBody = await req.json();
    console.log("RAW BODY:", rawBody);

    const data = rawBody?.body ?? rawBody;

    const name = data?.name?.trim();
    const phone = data?.phone?.trim();
    const message = data?.message?.trim();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: "Имя и телефон обязательны" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN не задан");
    }

    const text = `🧹 *Новая заявка с сайта Clean House*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
${message ? `💬 *Сообщение:* ${message}` : ""}

📅 *Дата:* ${new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
    })}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramResult = await telegramResponse.json();
    console.log("Telegram result:", telegramResult);

    if (!telegramResult.ok) {
      throw new Error(
        telegramResult.description || "Ошибка при отправке в Telegram"
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("send-telegram error:", error);

    return new Response(
      JSON.stringify({ error: "Внутренняя ошибка сервера" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
