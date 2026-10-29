# Certificate library

The public certificate gallery is available at `/certificates.html`. It is data-driven and is designed for 50-100+ entries without needing to hand-code each card.

## Add a certificate

1. Copy your original certificate into `assets/certificates/`. Keep the original PDF or image unchanged.
2. For PDF files, create a first-page thumbnail and save it in `assets/certificates/previews/`. The preview is only for the gallery card; the viewer opens the original PDF.
3. Add an object to `assets/js/certificates-data.js` in `window.PORTFOLIO_CERTIFICATES`.
4. Add its category ID and label. The filter buttons are generated from the categories present in the data.

### PDF preview command (Linux / WSL)

```bash
pdftoppm -f 1 -singlefile -png -r 110 \
  assets/certificates/my-certificate.pdf \
  assets/certificates/previews/my-certificate
```

This creates `my-certificate.png`. Set `preview` to that file. The viewer still opens the original PDF, preserving its native page dimensions and orientation.

### Image certificate

For a JPG, PNG or WebP certificate, set `fileType: "image"`, set `file` to the original image and set `preview` to a suitably sized image preview (or the same file for smaller files). The viewer displays it with `object-fit: contain`, so the whole page remains visible without cropping.

### Data entry template

```js
{
  id: "provider-course-name-2026",
  title: "Exact certificate title",
  issuer: "Issuing organisation",
  category: "cloud-computing",
  categoryLabel: "Cloud & Computing",
  date: "2026-06-15", // ISO date, used for newest-first sorting
  dateLabel: "June 2026",
  description: "One or two sentences describing what the certificate recognises.",
  tags: ["AWS", "Cloud", "Foundational"],
  file: "/assets/certificates/provider-course-name-2026.pdf",
  fileType: "pdf", // or "image"
  preview: "/assets/certificates/previews/provider-course-name-2026.png",
}
```

Use a unique `id` and filename. Dates can be left blank only when they are genuinely unknown. Before publishing, inspect each original for student IDs, signatures, private credential tokens or other personal data. Publish identifiers only when you intend them to be public, and do not upload certificates you do not have permission to share.

## Existing entry

`edunet-foundation-internship.pdf` is the original one-page A4 portrait certificate already included in this site. Its preview is in `previews/edunet-foundation-internship.webp`.


## Privacy note for the currently included file

The Edunet Foundation PDF contains a student identifier in its printed content. Review it before deployment. If you do not want that identifier public, create a properly redacted public certificate copy and update the catalogue to point to that copy; keep the original private.
