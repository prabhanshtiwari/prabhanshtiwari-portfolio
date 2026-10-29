const ALLOWED_TOPICS = new Set([
  "Developer opportunity",
  "Freelance project",
  "Website or application enquiry",
  "Collaboration",
  "Technical question",
  "Other",
]);

const MAX_BODY_BYTES = 12 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 3;
const attempts =
  globalThis.__portfolioContactAttempts ||
  (globalThis.__portfolioContactAttempts = new Map());

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      ...extraHeaders,
    },
  });
}

function cleanText(value, singleLine = false) {
  let text = String(value ?? "").replace(/<[^>]*>/g, " ");
  text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  if (singleLine) text = text.replace(/[\r\n]+/g, " ");
  return text.trim();
}

function hostFromHeader(value) {
  return String(value || "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function parseBody(text, contentType) {
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(text));
  }
  if (contentType.includes("application/json")) {
    return JSON.parse(text || "{}");
  }
  return null;
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return jsonResponse(
        { ok: false, message: "This endpoint accepts POST requests only." },
        405,
        { Allow: "POST" },
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return jsonResponse(
        {
          ok: false,
          message:
            "Your message is too large. Please shorten it and try again.",
        },
        413,
      );
    }

    const url = new URL(request.url);
    const requestHost = hostFromHeader(
      request.headers.get("x-forwarded-host") ||
        request.headers.get("host") ||
        url.host,
    );
    const allowedHosts = new Set([
      "www.prabhanshtiwari.com",
      "prabhanshtiwari.com",
      "prabhanshtiwari-portfolio.vercel.app",
    ]);
    if (process.env.VERCEL_URL)
      allowedHosts.add(hostFromHeader(process.env.VERCEL_URL));
    if (
      requestHost &&
      !allowedHosts.has(requestHost) &&
      !requestHost.endsWith(".vercel.app")
    ) {
      return jsonResponse(
        { ok: false, message: "This request is not allowed." },
        403,
      );
    }

    const originHeader = request.headers.get("origin");
    if (originHeader) {
      let originHost = "";
      try {
        originHost = hostFromHeader(new URL(originHeader).host);
      } catch (_) {
        return jsonResponse(
          { ok: false, message: "The request origin could not be verified." },
          403,
        );
      }
      if (originHost !== requestHost) {
        return jsonResponse(
          { ok: false, message: "The request origin could not be verified." },
          403,
        );
      }
    }

    let bodyText;
    try {
      bodyText = await request.text();
    } catch (_) {
      return jsonResponse(
        { ok: false, message: "The request body could not be read." },
        400,
      );
    }
    if (new TextEncoder().encode(bodyText).byteLength > MAX_BODY_BYTES) {
      return jsonResponse(
        {
          ok: false,
          message:
            "Your message is too large. Please shorten it and try again.",
        },
        413,
      );
    }

    let body;
    try {
      body = parseBody(bodyText, request.headers.get("content-type") || "");
    } catch (_) {
      return jsonResponse(
        { ok: false, message: "The submitted form data is invalid." },
        400,
      );
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse(
        {
          ok: false,
          message: "Please submit the contact form using the website.",
        },
        415,
      );
    }

    const honeypot = cleanText(body.website, true);
    if (honeypot) {
      return jsonResponse({
        ok: true,
        message: "Thank you. Your message has been received.",
      });
    }

    const name = cleanText(body.name, true);
    const email = cleanText(body.email, true).toLowerCase();
    const topic = cleanText(body.topic, true);
    const message = cleanText(body.message, false).replace(/\r\n?/g, "\n");
    const nameLength = [...name].length;
    const messageLength = [...message].length;

    if (nameLength < 1 || nameLength > 100) {
      return jsonResponse(
        { ok: false, message: "Please enter a name of 1–100 characters." },
        422,
      );
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(
        { ok: false, message: "Please enter a valid email address." },
        422,
      );
    }
    if (!ALLOWED_TOPICS.has(topic)) {
      return jsonResponse(
        { ok: false, message: "Please select a valid enquiry topic." },
        422,
      );
    }
    if (messageLength < 20 || messageLength > 5000) {
      return jsonResponse(
        {
          ok: false,
          message: "Please write a message between 20 and 5,000 characters.",
        },
        422,
      );
    }

    const now = Date.now();
    const ip =
      hostFromHeader(request.headers.get("x-forwarded-for")) || "unknown";
    const recent = (attempts.get(ip) || []).filter(
      (timestamp) => timestamp > now - RATE_WINDOW_MS,
    );
    if (recent.length >= RATE_LIMIT) {
      attempts.set(ip, recent);
      return jsonResponse(
        {
          ok: false,
          message:
            "Too many messages were sent from this network. Please try again in a few minutes or email me directly.",
        },
        429,
      );
    }
    recent.push(now);
    attempts.set(ip, recent);
    // Best-effort only: warm serverless instances may be reused, but cold starts reset this map.
    if (attempts.size > 500) {
      for (const [key, timestamps] of attempts) {
        if (!timestamps.some((timestamp) => timestamp > now - RATE_WINDOW_MS))
          attempts.delete(key);
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = cleanText(process.env.CONTACT_FROM_EMAIL, true);
    const to = cleanText(
      process.env.CONTACT_TO_EMAIL || "prabhansh.dev@gmail.com",
      true,
    );
    if (!apiKey || !from || !to) {
      return jsonResponse(
        {
          ok: false,
          message:
            "The contact service is not configured yet. Please email prabhansh.dev@gmail.com directly.",
        },
        503,
      );
    }

    const subject = `Portfolio enquiry: ${topic}`;
    const text = [
      "A new message was sent through www.prabhanshtiwari.com.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${topic}`,
      "",
      "Message:",
      message,
    ].join("\n");

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject,
          text,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        return jsonResponse(
          {
            ok: false,
            message:
              "Your message could not be delivered right now. Please email me directly.",
          },
          502,
        );
      }
      return jsonResponse({
        ok: true,
        message: "Your message has been sent. Thank you for reaching out.",
      });
    } catch (_) {
      return jsonResponse(
        {
          ok: false,
          message:
            "Your message could not be delivered right now. Please email me directly.",
        },
        502,
      );
    }
  },
};
