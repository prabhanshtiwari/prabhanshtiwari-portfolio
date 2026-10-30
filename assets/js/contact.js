(() => {
  "use strict";

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-contact-status]");
  const submit = form.querySelector("[data-contact-submit]");
  const submitLabel = form.querySelector("[data-contact-submit-label]");
  const messageField = form.querySelector('textarea[name="message"]');
  const messageCount = form.querySelector("[data-message-count]");
  const originalLabel = submitLabel?.textContent?.trim() || "Send message";
  let isSubmitting = false;

  function showStatus(message, state = "info") {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  }

  function updateMessageCount() {
    if (messageCount && messageField) {
      messageCount.textContent = String([...messageField.value].length);
    }
  }

  messageField?.addEventListener("input", updateMessageCount);
  updateMessageCount();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting || !form.reportValidity()) return;

    const endpoint = form.getAttribute("action") || "/api/contact";
    const formData = new FormData(form);
    const encodedBody = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      encodedBody.append(key, String(value));
    }

    isSubmitting = true;
    if (submit) submit.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    showStatus("Sending your message securely…");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: encodedBody.toString(),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
      });

      const responseText = await response.text();
      let payload;
      try {
        payload = responseText ? JSON.parse(responseText) : {};
      } catch {
        payload = {};
      }

      if (!response.ok || payload.ok !== true) {
        const fallback = response.status === 404
          ? "The contact endpoint could not be found. Please email me directly."
          : "Your message could not be sent right now. Please email me directly.";
        throw new Error(typeof payload.message === "string" && payload.message.trim()
          ? payload.message
          : fallback);
      }

      form.reset();
      updateMessageCount();
      showStatus(payload.message || "Your message has been sent. Thank you for reaching out.", "success");
    } catch (error) {
      const message = error?.name === "AbortError"
        ? "The request timed out. Please try again or email me directly."
        : error?.message || "A network error occurred. Please try again or email me directly.";
      showStatus(`${message} Email: prabhansh.dev@gmail.com`, "error");
    } finally {
      window.clearTimeout(timeoutId);
      isSubmitting = false;
      form.removeAttribute("aria-busy");
      if (submit) submit.disabled = false;
      if (submitLabel) submitLabel.textContent = originalLabel;
    }
  });
})();
