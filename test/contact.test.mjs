import test from "node:test";
import assert from "node:assert/strict";
import contactRoute from "../api/contact.mjs";

const validBody = {
  name: "Test Visitor",
  email: "visitor@example.com",
  topic: "Developer opportunity",
  message: "I would like to discuss a possible developer opportunity with you.",
  website: "",
};

function makeRequest(body = validBody, options = {}) {
  const encoded = new URLSearchParams(body).toString();
  return new Request("https://www.prabhanshtiwari.com/api/contact", {
    method: options.method || "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: options.origin || "https://www.prabhanshtiwari.com",
      "x-forwarded-for": options.ip || `192.0.2.${Math.floor(Math.random() * 200) + 1}`,
      ...(options.headers || {}),
    },
    body: options.method === "GET" ? undefined : (options.rawBody ?? encoded),
  });
}

async function readResponse(response) {
  return { status: response.status, body: await response.json() };
}

function configureResend() {
  process.env.RESEND_API_KEY = "re_test_key_for_unit_tests";
  process.env.CONTACT_FROM_EMAIL = "Prabhansh Tiwari <hello@prabhanshtiwari.com>";
  process.env.CONTACT_TO_EMAIL = "prabhansh.dev@gmail.com";
}

test("rejects non-POST methods", async () => {
  const response = await contactRoute.fetch(makeRequest({}, { method: "GET" }));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
});

test("rejects a cross-origin request", async () => {
  const response = await contactRoute.fetch(makeRequest(validBody, { origin: "https://attacker.example" }));
  assert.equal(response.status, 403);
});

test("validates the submitted email address", async () => {
  const response = await contactRoute.fetch(makeRequest({ ...validBody, email: "not-an-email" }));
  const result = await readResponse(response);
  assert.equal(result.status, 422);
  assert.match(result.body.message, /valid email/i);
});

test("acknowledges honeypot submissions without sending mail", async () => {
  let called = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { called = true; return new Response("{}", { status: 200 }); };
  try {
    const response = await contactRoute.fetch(makeRequest({ ...validBody, website: "filled-by-bot" }));
    const result = await readResponse(response);
    assert.equal(result.status, 200);
    assert.equal(result.body.ok, true);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sends a valid enquiry through Resend", async () => {
  configureResend();
  const originalFetch = globalThis.fetch;
  let sentPayload;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.method, "POST");
    assert.match(options.headers.Authorization, /^Bearer re_test_key/);
    sentPayload = JSON.parse(options.body);
    return new Response(JSON.stringify({ id: "email_test_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  try {
    const response = await contactRoute.fetch(makeRequest(validBody, { ip: "198.51.100.41" }));
    const result = await readResponse(response);
    assert.equal(result.status, 200);
    assert.equal(result.body.ok, true);
    assert.equal(sentPayload.to[0], "prabhansh.dev@gmail.com");
    assert.equal(sentPayload.reply_to, "visitor@example.com");
    assert.match(sentPayload.text, /Test Visitor/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("returns a controlled error when Resend rejects the email", async () => {
  configureResend();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ name: "validation_error" }), {
    status: 422,
    headers: { "content-type": "application/json" },
  });
  try {
    const response = await contactRoute.fetch(makeRequest(validBody, { ip: "198.51.100.42" }));
    const result = await readResponse(response);
    assert.equal(result.status, 502);
    assert.equal(result.body.ok, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("limits repeated submissions from the same IP in a warm instance", async () => {
  configureResend();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("{}", { status: 200 });
  try {
    const ip = "198.51.100.43";
    const statuses = [];
    for (let index = 0; index < 4; index += 1) {
      const response = await contactRoute.fetch(makeRequest(validBody, { ip }));
      statuses.push(response.status);
    }
    assert.deepEqual(statuses, [200, 200, 200, 429]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects a request body that exceeds the size limit", async () => {
  const tooLarge = `name=${"x".repeat(25 * 1024)}`;
  const response = await contactRoute.fetch(makeRequest(validBody, {
    rawBody: tooLarge,
    headers: { "content-length": String(Buffer.byteLength(tooLarge)) },
  }));
  assert.equal(response.status, 413);
});
