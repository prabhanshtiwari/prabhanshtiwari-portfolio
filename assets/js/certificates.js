(() => {
  "use strict";

  const grid = document.querySelector("[data-certificate-grid]");
  if (!grid) return;

  const records = Array.isArray(window.PORTFOLIO_CERTIFICATES)
    ? [...window.PORTFOLIO_CERTIFICATES]
    : [];
  const filters = document.querySelector("[data-certificate-filters]");
  const search = document.querySelector("[data-certificate-search]");
  const count = document.querySelector("[data-certificate-count]");
  const empty = document.querySelector("[data-certificate-empty]");
  const dialog = document.getElementById("certificate-viewer");
  const dialogTitle = dialog?.querySelector("[data-viewer-title]");
  const dialogIssuer = dialog?.querySelector("[data-viewer-issuer]");
  const dialogDescription = dialog?.querySelector("[data-viewer-description]");
  const dialogContent = dialog?.querySelector("[data-viewer-content]");
  const dialogDate = dialog?.querySelector("[data-viewer-date]");
  const dialogCategory = dialog?.querySelector("[data-viewer-category]");
  const openOriginal = dialog?.querySelector("[data-viewer-open-original]");
  const downloadOriginal = dialog?.querySelector("[data-viewer-download]");

  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  // Keep catalogue assets within the site's certificate and preview directories.
  const safeAssetPath = (value, fallback = "") => {
    const path = String(value || "").trim();
    if (
      !path.startsWith("/assets/certificates/") ||
      path.includes("..") ||
      /["'<>\\]/.test(path)
    )
      return fallback;
    return path;
  };

  const normalized = records
    .filter((item) => item && item.id && item.title && item.file)
    .map((item) => ({
      ...item,
      file: safeAssetPath(item.file),
      preview: safeAssetPath(
        item.preview,
        "/assets/images/certificate-placeholder.svg",
      ),
      category: String(item.category || "other").toLowerCase(),
      categoryLabel: String(item.categoryLabel || "Other"),
      fileType: String(
        item.fileType || (/\.pdf(?:$|[?#])/i.test(item.file) ? "pdf" : "image"),
      ).toLowerCase(),
      searchable: [
        item.id,
        item.title,
        item.issuer,
        item.description,
        item.categoryLabel,
        ...(item.tags || []),
      ]
        .join(" ")
        .toLowerCase(),
    }))
    .filter((item) => item.file);

  normalized.sort((a, b) => {
    const aDate = Date.parse(a.date || "") || 0;
    const bDate = Date.parse(b.date || "") || 0;
    return bDate - aDate || a.title.localeCompare(b.title);
  });

  const categoryMap = new Map();
  normalized.forEach((item) => {
    if (!categoryMap.has(item.category))
      categoryMap.set(item.category, item.categoryLabel);
  });

  if (filters) {
    const chips = [
      { id: "all", label: "All certificates" },
      ...[...categoryMap.entries()]
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([id, label]) => ({ id, label })),
    ];
    filters.innerHTML = chips
      .map(
        (chip, index) =>
          `<button class="filter-chip" type="button" data-certificate-filter="${escapeHTML(chip.id)}" aria-pressed="${index === 0 ? "true" : "false"}">${escapeHTML(chip.label)}</button>`,
      )
      .join("");
  }

  const cardMarkup = (item) => `
    <article class="certificate-card" data-certificate-card data-category="${escapeHTML(item.category)}" data-search="${escapeHTML(item.searchable)}">
      <button class="certificate-card-button" type="button" data-certificate-open="${escapeHTML(item.id)}" aria-label="View certificate: ${escapeHTML(item.title)}">
        <span class="certificate-card-preview">
          <img src="${escapeHTML(item.preview)}" alt="Preview of ${escapeHTML(item.title)}" loading="lazy" decoding="async">
          <span class="certificate-orientation" data-certificate-orientation>Certificate</span>
        </span>
        <span class="certificate-card-copy">
          <span class="certificate-card-meta"><span>${escapeHTML(item.categoryLabel)}</span><span>${escapeHTML(item.dateLabel || "Date not specified")}</span></span>
          <strong class="certificate-card-title">${escapeHTML(item.title)}</strong>
          <span class="certificate-card-issuer">${escapeHTML(item.issuer || "Issuer not specified")}</span>
          <span class="certificate-card-description">${escapeHTML(item.description || "")}</span>
          <span class="certificate-card-action">View certificate</span>
        </span>
      </button>
    </article>`;

  grid.innerHTML = normalized.map(cardMarkup).join("");

  // Derive the orientation label from each preview instead of forcing one aspect ratio.
  grid.querySelectorAll(".certificate-card-preview img").forEach((img) => {
    const setOrientation = () => {
      const label = img
        .closest(".certificate-card-preview")
        ?.querySelector("[data-certificate-orientation]");
      if (!label || !img.naturalWidth || !img.naturalHeight) return;
      const orientation =
        img.naturalWidth > img.naturalHeight * 1.08
          ? "Landscape"
          : img.naturalHeight > img.naturalWidth * 1.08
            ? "Portrait"
            : "Square";
      label.textContent = orientation;
      img.closest(".certificate-card-preview").dataset.orientation =
        orientation.toLowerCase();
    };
    img.addEventListener("load", setOrientation, { once: true });
    img.addEventListener(
      "error",
      () => {
        img.src = "/assets/images/certificate-placeholder.svg";
        img.alt = "Certificate preview placeholder";
      },
      { once: true },
    );
    if (img.complete && img.naturalWidth) setOrientation();
  });

  let activeCategory = "all";
  let query = "";
  const applyFilters = () => {
    let visible = 0;
    grid.querySelectorAll("[data-certificate-card]").forEach((card) => {
      const categoryMatch =
        activeCategory === "all" || card.dataset.category === activeCategory;
      const searchMatch = !query || card.dataset.search.includes(query);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count)
      count.textContent = `Showing ${visible} of ${normalized.length} ${normalized.length === 1 ? "certificate" : "certificates"}`;
    if (empty) empty.hidden = visible !== 0;
  };

  filters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-certificate-filter]");
    if (!button) return;
    activeCategory = button.dataset.certificateFilter || "all";
    filters.querySelectorAll("[data-certificate-filter]").forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip === button));
    });
    applyFilters();
  });

  search?.addEventListener("input", () => {
    query = search.value.trim().toLowerCase();
    applyFilters();
  });

  const getFileType = (item) => {
    if (item.fileType === "pdf" || /\.pdf(?:$|[?#])/i.test(item.file))
      return "pdf";
    return "image";
  };

  const openCertificate = (item) => {
    if (!item || !item.file) return;
    if (!dialog || typeof dialog.showModal !== "function") {
      window.open(item.file, "_blank", "noopener,noreferrer");
      return;
    }

    dialogTitle.textContent = item.title;
    dialogIssuer.textContent = item.issuer || "Issuer not specified";
    dialogDescription.textContent = item.description || "";
    dialogDate.textContent = item.dateLabel || "Date not specified";
    dialogCategory.textContent = item.categoryLabel || "Other";
    openOriginal.href = item.file;
    downloadOriginal.href = item.file;
    downloadOriginal.setAttribute(
      "download",
      item.file.split("/").pop() || "certificate",
    );

    dialogContent.replaceChildren();
    if (getFileType(item) === "pdf") {
      const frame = document.createElement("iframe");
      frame.className = "certificate-original-pdf";
      frame.src = `${item.file}#view=FitH&toolbar=1&navpanes=0`;
      frame.title = `${item.title} — original PDF certificate`;
      frame.loading = "eager";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      dialogContent.append(frame);
    } else {
      const image = document.createElement("img");
      image.className = "certificate-original-image";
      image.src = item.file;
      image.alt = `${item.title} — original certificate`;
      image.decoding = "async";
      image.loading = "eager";
      dialogContent.append(image);
    }
    dialog.showModal();
  };

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-certificate-open]");
    if (!button) return;
    const item = normalized.find(
      (record) => record.id === button.dataset.certificateOpen,
    );
    openCertificate(item);
  });

  dialog
    ?.querySelector("[data-viewer-close]")
    ?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Close viewer on route changes/back-forward cache and avoid a stale embedded PDF.
  dialog?.addEventListener("close", () => dialogContent?.replaceChildren());

  applyFilters();
})();
