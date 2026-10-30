# Prabhansh Tiwari — Portfolio

A responsive, multi-page portfolio built with semantic HTML, CSS and vanilla JavaScript. It deploys as a static site on Vercel and uses one Vercel Node.js Function (`/api/contact`) to deliver contact-form messages through Resend. No frontend framework or build step is required.

## Homepage structure

The homepage is intentionally focused on six sections:

1. **Hero** — role, short introduction, portrait and social profiles.
2. **Selected work** — three featured projects with case-study and live/source links.
3. **Skills** — compact technology groups, without proficiency percentages.
4. **About** — short biography and a compact education/experience timeline.
5. **Writing & teaching** — two technical articles and a concise teaching note.
6. **Contact** — direct email and a functional contact form.

The primary navigation has four destinations: Work, About, Writing and Contact. The résumé and theme controls remain separate utilities. GitHub repository metrics, the learning log, the AI-philosophy block and the certificate spotlight were removed from the homepage to reduce repetition. Detailed pages remain available below.

## Pages

- `index.html` — concise portfolio homepage.
- `projects.html` — searchable project archive.
- `projects/*.html` — detailed project case studies.
- `certificates.html` — searchable certificate library.
- `education/*.html` — BCA and online MCA details.
- `experience/edunet-foundation.html` — internship details.
- `404.html` — custom not-found page.

## Run locally

From the project root:

```bash
python -m http.server 5500
```

Open `http://localhost:5500`. Do not open the HTML files directly with `file://`; root-relative asset paths are intended for a web server and a domain-root deployment.

Run the automated checks with Node.js 20 or later:

```bash
npm run check
npm test
```

The project has no runtime npm dependencies. The tests mock the Resend API; they do not deliver real email.

## Contact form — Vercel + Resend

The homepage posts URL-encoded form data to `/api/contact`. The Vercel Node.js Function validates the request, applies a honeypot and a best-effort in-memory rate limit, then sends a plain-text email using the Resend HTTP API. Visitor messages are not stored in a database.

Configure these exact variable names in **Vercel → Project → Settings → Environment Variables**, with the `Production` environment selected:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | A private API key created in Resend. Never expose it in frontend code or commit it to Git. |
| `CONTACT_FROM_EMAIL` | A Resend-verified sender, e.g. `Prabhansh Tiwari <website@your-verified-domain.com>`. The domain must be verified in Resend. |
| `CONTACT_TO_EMAIL` | The inbox that should receive enquiries, e.g. `prabhansh.dev@gmail.com`. |

Before using the form in production:

1. Verify your sending domain in Resend and publish the SPF/DKIM DNS records Resend provides.
2. Set `CONTACT_FROM_EMAIL` to an address on that verified domain. Do not use a visitor's email address as the sender; the visitor address is set as `reply_to` so you can reply directly.
3. Set `CONTACT_TO_EMAIL` to the inbox where you want to receive messages.
4. Save the variables and redeploy Production. Vercel applies environment-variable changes to new deployments, not deployments that already exist.
5. Submit a real test from `https://www.prabhanshtiwari.com/` and verify receipt in the target inbox, including Spam/Promotions.

The browser form reports success only when the function receives a successful response from Resend. A successful API response means Resend accepted the message for sending; it is not a guarantee that the recipient's provider placed it in the inbox.

### Contact endpoint behavior

- `POST` only; other methods receive `405`.
- Same-host Origin validation when the browser sends an Origin header.
- 24 KB request-body cap.
- Name, email, topic and message validation on the server.
- Hidden honeypot field; spam submissions are acknowledged but not forwarded.
- Best-effort limit of three real submissions per IP in ten minutes per warm function instance. This is not a distributed rate limiter; for high-volume abuse, add Vercel Firewall rate limiting or a durable rate-limit store.
- Generic delivery errors are returned to visitors. Provider status details are written to Vercel Function logs without logging message content or API credentials.

The PHP file `contact.php` is retained only as a fallback for PHP-capable hosting. Vercel uses `api/contact.mjs`; it does not execute PHP.

## Project configuration and assets

- `assets/js/site-config.js` contains public profile links, email, résumé URL and the contact endpoint. Never put secrets there.
- `assets/js/projects.js` is the canonical project-card dataset for the project archive.
- `project-manifest.json` mirrors project slugs, case-study pages and media paths.
- `assets/images/profile/` contains the supplied profile photo.
- `assets/images/projects/` contains current project previews. Some are illustrative concepts, not production screenshots; their labels and alt text make this distinction clear. Replace them with genuine screenshots you own or have permission to publish.
- `assets/certificates/` contains the certificate library files. Review the Edunet PDF before publishing it because the source document may contain a student identifier.

## Deployment notes

1. Deploy the contents of this folder as the Vercel project root. `index.html` must be at the root and `api/contact.mjs` must remain inside `/api`.
2. Do not upload `.env` files, API keys, or the local `node_modules` directory.
3. Vercel ignores `.htaccess`; configure canonical-domain redirects and security headers in Vercel project/domain settings if needed. The `.htaccess` file is retained for Apache/LiteSpeed hosting only.
4. Confirm the public résumé URL, social URLs and project demo URLs still work.
5. Verify the contact form using a real Production deployment and inspect Vercel Function logs if delivery fails.
6. Run a browser smoke test and Lighthouse on the deployed domain. Automated local tests do not replace a production-host test.

## Accessibility and UI behavior

The site uses semantic landmarks, keyboard-visible focus states, a skip link, responsive navigation, accessible form status announcements, descriptive image alternatives and reduced-motion support. The theme preference is stored locally when browser storage is available. The homepage has no dependency on the GitHub API or a third-party widget to render its main content.
