import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  phone: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, message }: ContactRequest = await req.json();
    
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN not configured");
    }

    // Extract chat_id from bot token format or use a default
    // The token format is typically: BOT_TOKEN:CHAT_ID or just BOT_TOKEN
    const [token, chatId] = botToken.includes(":") 
      ? [botToken.split(":").slice(0, 2).join(":"), botToken.split(":")[2] || ""]
      : [botToken, ""];

    const text = `🧹 *Новая заявка с сайта Clean House*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
${message ? `💬 *Сообщение:* ${message}` : ""}

📅 *Дата:* ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`;

    // First get updates to find chat_id if not provided
    let finalChatId = chatId;
    
    if (!finalChatId) {
      const updatesResponse = await fetch(
        `https://api.telegram.org/bot${token}/getUpdates`
      );
      const updatesData = await updatesResponse.json();
      
      if (updatesData.result && updatesData.result.length > 0) {
        finalChatId = updatesData.result[0].message?.chat?.id?.toString() || "";
      }
    }

    if (!finalChatId) {
      console.log("No chat_id found. User needs to message the bot first.");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Пожалуйста, сначала отправьте сообщение боту в Telegram" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: finalChatId,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramResult = await telegramResponse.json();
    console.log("Telegram response:", telegramResult);

    if (!telegramResult.ok) {
      throw new Error(telegramResult.description || "Failed to send message");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-telegram:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
