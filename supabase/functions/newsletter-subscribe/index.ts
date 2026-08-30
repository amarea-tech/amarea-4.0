import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const BREVO_API_URL = "https://api.brevo.com/v3";

// Configurazione newsletter
const SENDER_NAME = "Amarea Cosmetics";
const SENDER_EMAIL = "newsletter@amareacosmetics.com";
const NOTIFY_EMAIL = "sales@amareacosmetics.com";
const LIST_ID = 2;

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

      // Con updateEnabled=true, un contatto già esistente non deve
      // impedire la prosecuzione se Brevo segnala duplicate_parameter.
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

    // 2. Email di benvenuto
    const emailRes = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL,
        },
        to: [{ email }],
        subject: "Benvenuta nel mondo Amarea 🌿",
        htmlContent: `
          <div style="font-family: Georgia, serif; max-width: 540px; margin: 0 auto; padding: 32px; color: #171717; background: #faf8f5;">
            <h1 style="font-size: 28px; margin: 0 0 16px; font-weight: 400; letter-spacing: -0.5px;">
              Grazie per esserti iscritta.
            </h1>

            <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">
              La tua iscrizione alla newsletter <strong>Amarea Cosmetics</strong> è confermata.
            </p>

            <p style="font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
              Riceverai aggiornamenti sui nostri rituali di bellezza,
              sulla ricerca biotech e sulle novità della collezione
              <em>Monti Italiani</em>.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e0d8; margin: 32px 0;" />

            <p style="font-size: 12px; color: #888; line-height: 1.6;">
              Hai ricevuto questa email perché ti sei iscritta dal sito Amarea.<br/>
              Puoi disiscriverti in qualsiasi momento dal link in fondo alle prossime email.
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();

      console.error(
        "Brevo email error",
        emailRes.status,
        errText,
      );

      // L'iscrizione al contatto rimane valida anche se
      // l'email di benvenuto non viene inviata.
    }

    // 3. Notifica interna al team
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
        replyTo: { email },
        subject: "Nuova iscrizione — Lista prioritaria Sibilla",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; font-size: 15px; color: #171717;">
            <h2 style="font-weight:400;">
              Nuova iscrizione alla lista prioritaria
            </h2>

            <p>
              <strong>Email:</strong> ${email}
            </p>

            <p>
              <strong>Data e ora (Europe/Rome):</strong> ${subscribedAt}
            </p>

            <p>
              <strong>Consenso privacy:</strong> accettato
            </p>
          </div>
        `,
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