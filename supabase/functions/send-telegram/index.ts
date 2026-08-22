import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Retired endpoint. Contact requests are accepted only by submit-contact,
// where origin, timing, honeypot, CAPTCHA, deduplication and rate limits are checked.
serve(() =>
  new Response(JSON.stringify({ error: "Endpoint retired" }), {
    status: 410,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
);
