import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const BREVO_API_URL = "https://api.brevo.com/v3";

// Configurazione newsletter
const SENDER_NAME = "Amarea Cosmetics";
const SENDER_EMAIL = "newsletter@amareacosmetics.com";
const NOTIFY_EMAIL = "sales@amareacosmetics.com";
const LIST_ID = 2;

const WELCOME_TEMPLATE_ID = 2;
const NOTIFY_TEMPLATE_ID = 4;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY non configurata");
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const consent = Boolean(body?.consent);

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Email non valida" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (!consent) {
      return new Response(
        JSON.stringify({
          error: "Devi accettare il trattamento dei dati",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const headers = {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // 1. Crea o aggiorna il contatto Brevo
    const contactRes = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        listIds: [LIST_ID],
        updateEnabled: true,
        attributes: {
          OPT_IN: true,
          DOUBLE_OPT_IN: false,
          SOURCE: "amarea-website",
        },
      }),
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const errText = await contactRes.text();

      if (!errText.includes("duplicate_parameter")) {
        console.error(
          "Brevo contact error",
          contactRes.status,
          errText,
        );

        throw new Error(
          `Iscrizione non riuscita (${contactRes.status})`,
        );
      }
    }

    // 2. Email di benvenuto tramite template Brevo #2
    const emailRes = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL,
        },
        to: [{ email }],
        templateId: WELCOME_TEMPLATE_ID,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();

      console.error(
        "Brevo welcome email error",
        emailRes.status,
        errText,
      );

      // L'iscrizione al contatto rimane valida anche se
      // l'email di benvenuto non viene inviata.
    }

    // 3. Notifica interna tramite template Brevo #4
    const subscribedAt = new Date().toLocaleString("it-IT", {
      timeZone: "Europe/Rome",
    });

    const notifyRes = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL,
        },
        to: [{ email: NOTIFY_EMAIL }],
        templateId: NOTIFY_TEMPLATE_ID,
        params: {
          email,
          subscribedAt,
          consent: "accettato",
        },
      }),
    });

    if (!notifyRes.ok) {
      console.error(
        "Brevo notify error",
        notifyRes.status,
        await notifyRes.text(),
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Errore sconosciuto";

    console.error("newsletter-subscribe error:", message);

    const clientMessage =
      message === "Email non valida" ||
      message === "Devi accettare il trattamento dei dati"
        ? message
        : "Si è verificato un errore, riprova più tardi.";

    return new Response(
      JSON.stringify({ error: clientMessage }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});