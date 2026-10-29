(() => {
  "use strict";
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const config = window.PORTFOLIO_CONFIG || {};
  const status = form.querySelector("[data-contact-status]");
  const submit = form.querySelector("[data-contact-submit]");
  const submitLabel = form.querySelector("[data-contact-submit-label]");
  const originalLabel = submitLabel?.textContent || "Send message";
  const showStatus = (message, kind = "info") => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = kind;
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (submit) submit.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    showStatus("Sending your message securely…");
    try {
      const formData = new FormData(form);
      const encodedBody = new URLSearchParams();
      for (const [key, value] of formData.entries())
        encodedBody.append(key, String(value));

      const response = await fetch(config.contactEndpoint || form.action, {
        method: "POST",
        body: encodedBody.toString(),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        credentials: "same-origin",
      });
      let payload = {};
      try {
        payload = await response.json();
      } catch (_) {
        /* non-JSON host response */
      }
      if (!response.ok || payload.ok !== true) {
        throw new Error(
          payload.message ||
            "The message could not be sent. Please email me directly.",
        );
      }
      form.reset();
      showStatus(
        payload.message ||
          "Your message has been sent. Thank you for reaching out.",
        "success",
      );
    } catch (error) {
      showStatus(
        `${error.message || "Something went wrong."} You can also email prabhansh.dev@gmail.com.`,
        "error",
      );
    } finally {
      form.removeAttribute("aria-busy");
      if (submit) submit.disabled = false;
      if (submitLabel) submitLabel.textContent = originalLabel;
    }
  });
})();
