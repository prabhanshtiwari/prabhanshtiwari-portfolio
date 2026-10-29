(() => {
  "use strict";

  const reducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Progressive scroll reveal: content remains visible if JS or IntersectionObserver is unavailable.
  const revealTargets = document.querySelectorAll(
    ".section-heading, .what-card, .work-card, .learning-feature, .learning-note, .journey-card, .ai-principles-copy, .case-section, .case-media-card, .detail-hero, .detail-section, .detail-aside-card, .certificate-spotlight, .skill-card, .skills-learning-row, .github-repo-card, .github-activity-panel, .contact-panel, .contact-form",
  );
  if (
    !reducedMotion &&
    "IntersectionObserver" in window &&
    revealTargets.length
  ) {
    document.documentElement.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    revealTargets.forEach((element, index) => {
      element.setAttribute("data-reveal", "");
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 55}ms`,
      );
      revealObserver.observe(element);
    });
  }

  // Gallery thumbnails update the larger preview while keeping the page in place.
  document.querySelectorAll("[data-project-showcase]").forEach((showcase) => {
    const slug = showcase.dataset.projectSlug || "";
    const mediaConfig = window.PORTFOLIO_MEDIA_CONFIG || {};
    const mainImage = showcase.querySelector("[data-showcase-image]");
    const player = showcase.querySelector("[data-showcase-player]");
    const playButton = showcase.querySelector("[data-video-play]");
    const stopButton = showcase.querySelector("[data-video-stop]");
    const gallery = document.querySelectorAll("[data-gallery-select]");
    const rawVideo = mediaConfig[slug] || "";

    function extractVideoId(value) {
      const input = String(value || "").trim();
      if (!input) return "";
      if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
      try {
        const url = new URL(input);
        if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be"))
          return url.pathname.split("/").filter(Boolean)[0] || "";
        if (url.searchParams.get("v")) return url.searchParams.get("v");
        const parts = url.pathname.split("/").filter(Boolean);
        const embedIndex = parts.findIndex((part) =>
          ["embed", "shorts", "live"].includes(part),
        );
        return embedIndex >= 0 ? parts[embedIndex + 1] || "" : "";
      } catch (_) {
        return "";
      }
    }
    const videoId = extractVideoId(rawVideo);
    if (videoId && playButton) playButton.hidden = false;

    const stopVideo = () => {
      if (player) {
        player.replaceChildren();
        player.hidden = true;
      }
      if (mainImage) mainImage.hidden = false;
      if (playButton) playButton.hidden = !videoId;
      if (stopButton) stopButton.hidden = true;
      showcase.classList.remove("is-playing");
    };

    gallery.forEach((button) => {
      button.addEventListener("click", () => {
        if (!mainImage) return;
        stopVideo();
        const nextSrc = button.dataset.imageSrc;
        const nextAlt = button.dataset.imageAlt;
        if (nextSrc) mainImage.src = nextSrc;
        if (nextAlt) mainImage.alt = nextAlt;
        gallery.forEach((item) => {
          const selected = item === button;
          item.setAttribute("aria-pressed", String(selected));
          item
            .closest(".case-media-card")
            ?.classList.toggle("is-selected", selected);
        });
      });
    });

    playButton?.addEventListener("click", () => {
      if (!videoId || !player) return;
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&controls=1&rel=0&playsinline=1`;
      frame.title = `${slug.replaceAll("-", " ")} project walkthrough`;
      frame.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.loading = "eager";
      player.replaceChildren(frame);
      player.hidden = false;
      if (mainImage) mainImage.hidden = true;
      playButton.hidden = true;
      if (stopButton) stopButton.hidden = false;
      showcase.classList.add("is-playing");
    });
    stopButton?.addEventListener("click", stopVideo);
  });

  // Certificate iframe/link is revealed only when the actual PDF exists.
  document.querySelectorAll("[data-certificate-panel]").forEach((panel) => {
    const path = panel.dataset.certificateUrl;
    const frame = panel.querySelector("[data-certificate-frame]");
    const open = panel.querySelector("[data-certificate-open]");
    const download = panel.querySelector("[data-certificate-download]");
    const actions = panel.querySelector("[data-certificate-actions]");
    const empty = panel.querySelector("[data-certificate-empty]");
    if (!path || !frame || !open || !download || !actions || !empty) return;
    fetch(path, { method: "HEAD", cache: "no-store" })
      .then((response) => {
        if (!response.ok) return;
        frame.src = path;
        frame.hidden = false;
        open.href = path;
        download.href = path;
        actions.hidden = false;
        empty.hidden = true;
      })
      .catch(() => {
        // Keep the honest placeholder visible when no certificate is provided.
      });
  });
})();
