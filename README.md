# Prabhansh Tiwari — Portfolio

A responsive, multi-page portfolio built with semantic HTML, CSS and vanilla JavaScript, plus a small PHP contact endpoint for PHP-capable hosting. There is no frontend framework, package manager or build step. The ZIP is structured so that `index.html` sits at the deployment root.

## Run locally

From the folder containing `index.html`, run:

```bash
python -m http.server 5500
```

Open `http://localhost:5500`. Do not open the HTML files directly with `file://`; root-relative asset paths are intended for a web server and a domain-root deployment.

## Pages

- `index.html` — homepage with hero, engineering philosophy, technical skills, featured projects, GitHub activity, learning, education/experience highlights, certificates, writing, background and contact.
- `projects.html` — searchable and filterable project archive, with a complete static fallback if JavaScript is disabled.
- `certificates.html` — searchable, category-filtered certificate library with an original-size viewer for PDF and image certificates.
- `index.html#skills` — dedicated technical skills grouped by frontend, backend, databases, tools and current learning.
- `index.html#github` — curated repository highlights and recent public activity from the GitHub REST API.
- `contact.php` — same-origin contact endpoint with validation, hidden honeypot, basic rate limiting and email delivery through PHP `mail()`.
- `projects/*.html` — crawlable, consistent case studies for P.N. Central Academy, Bootle Village Stores, Dynamic Weather Dashboard, Quiz Game and Job Portal. Each includes the brief, approach, implementation, decisions, project gallery/video slot, outcome and demo/source links.
- `education/*.html` — dedicated BCA (United University) and online MCA (Chandigarh University) detail pages.
- `experience/edunet-foundation.html` — internship detail page with learning outcomes and certificate access.
- `404.html` — custom not-found page. Configure the host to serve it for missing routes if that is not automatic.

The information architecture separates the homepage overview from evidence pages: visitors can move from a skill to a relevant case study, from a project card to its full write-up, and from an education/experience card to its dedicated detail page. The résumé action is kept in the sticky header on desktop and as a compact `CV` control on smaller screens.

## Project data and assets

- `assets/js/projects.js` is the canonical project-card dataset. Keep each `slug`, case-study page and `media` filename aligned; `project-manifest.json` mirrors the dataset with explicit case-study and media paths for quick auditing.
- `sitemap.xml` includes the homepage, project archive and case studies, education/experience details, and the certificate library.
- Raster project previews are supplied in WebP for smaller downloads; unused high-resolution PNG duplicates were removed from this deployment package.
- SVGs in `assets/images/projects/` are clearly described as illustrative concepts, not product screenshots. Replace them only with images you own or have permission to publish.
- The hero portrait remains the supplied image. The layout now frames it at 4:5 using `object-fit: cover`; the file itself is not artificially retouched.

## Design and accessibility

- Warm neutral light theme and deep green-charcoal dark theme, with muted forest-green accents.
- Shared early theme bootstrap prevents a light/dark flash on pages that use the saved preference or system setting. Manual choice is stored in `localStorage` when available.
- Responsive navigation, clear focus outlines, skip link, semantic landmarks, image alternatives, reduced-motion support, and accessible project/certificate counts.
- Certificate records are data-driven, sorted newest first, and can be filtered by category or searched by title, issuer, description, tags and record ID. Gallery previews fit portrait, landscape and square documents without cropping; the viewer opens the original PDF or image.
- Project archive controls appear only after the archive script is ready; all project cards remain visible without JavaScript.
- External links opened in a new tab include `noopener noreferrer`.

## Public details

Edit `assets/js/site-config.js` to update name, email, public profiles, résumé URL, website and location. Do not place private API keys or credentials in this file.

## Before deployment

1. Deploy the contents of this folder as the website root. The site uses root-relative paths such as `/assets/...`.
2. Open every external demo, repository, social and résumé link from a real browser. The Job Portal frontend endpoint returned a `Vite + React` page response during this audit, but that does not confirm that the student/recruiter workflows or backend API are healthy. Other hosted demo destinations could not be independently loaded from the audit environment.
3. Confirm you have permission to publish every school, business and project image, and remove any private or test data from screenshots. The Job Portal preview contains sample listing content and is labelled accordingly; it is not evidence of a current vacancy.
4. For Hostinger/cPanel Apache or LiteSpeed hosting, the optional `.htaccess` file enables HTTPS/canonical-host redirects, the custom 404 route, basic security headers and static-asset caching. Remove or adapt the host-specific redirect if you deploy under a different domain. Vercel and Netlify ignore `.htaccess`.
5. Review the OpenWeather API key used by the separate Dynamic Weather Dashboard project. Never copy it into this portfolio; restrict or proxy the key in the weather application itself.
6. Configure HTTPS, the preferred canonical domain and the custom 404 route with the hosting provider. Submit `sitemap.xml` in Google Search Console after deployment.
7. Run Lighthouse and a browser smoke test on the deployed domain. The local static checks do not replace a production-host test.

## Verification performed on this package

- All 12 HTML pages passed parsing, title/description/canonical checks, main-landmark checks, duplicate-ID checks, image-alt checks, local-asset checks and local-fragment checks. The 11 indexable pages have unique canonical URLs; the custom 404 page is noindex.
- All 9 JavaScript files passed `node --check`. The full stylesheet parsed with `tinycss2` without parser errors. `project-manifest.json`, `site.webmanifest`, sitemap XML and inline JSON-LD parsed successfully.
- Four technical-skill groups and four repository cards are present. Skill groups link to relevant project/learning evidence. Every case study retains its demo and source-code actions. The four repository cards match the four repositories pinned on the public GitHub profile during the 29 October 2026 review.
- The résumé CTA is visible at 1440, 1024, 768, 390, 360 and 320 CSS pixels. Chromium checks found no horizontal overflow at those widths and reported no page JavaScript errors. The 390px viewport screenshot also confirmed the compact `CV` control, logo and menu.
- Browser interaction tests exercised the GitHub public API integration with mock responses (public repo count, follower count, recent PushEvent), the contact form success state with a mock mail response, mobile-menu open/close, and reveal visibility for all four skill cards and four repository cards. Mock responses verify the frontend flow, not live third-party availability or actual email delivery.
- PHP lint passed for `contact.php`. Endpoint tests returned 405 for GET, 422 for an invalid email, 403 for a foreign Origin, and 200 for a filled honeypot. A valid message reached PHP `mail()` but returned 503 because this test environment has no configured outbound mail transport. The form's success state was verified separately with a mocked successful response.
- A local HTTP smoke test checked 42 distinct same-origin page/asset paths. All returned successful responses; `GET /contact.php` correctly returned 405 because the endpoint accepts POST only.
- ZIP integrity was checked after packaging.

## Remaining deployment checks

- Review the Edunet PDF before making it public: the original contains a student identifier. Publish it unchanged only if you are comfortable making that identifier public; otherwise prepare a redacted public copy while retaining your private original.
- Add each additional certificate file and catalogue record using `assets/certificates/README.md`. PDF entries need a first-page preview image; image entries can use a resized copy of the original as the preview.
- Add genuine project screenshots and YouTube video IDs when ready. No project video IDs were supplied in the uploaded package.
- Recheck external project demos, repositories, authentication and APIs on their actual hosted services. Local portfolio tests do not certify those systems.
- Verify root-path routing, HTTPS redirects, headers and the custom 404 page on the actual hosting provider. Run Lighthouse and a browser check on the deployed domain.

**Result:** Static validation and in-memory browser interaction checks passed. Final deployment sign-off remains dependent on the manual checks above.

## Project galleries and walkthrough videos

Each case-study page includes a large preview frame and a clickable gallery. Selecting a gallery image updates the large frame. When a YouTube ID is configured, a `Watch walkthrough` control appears over that frame; the video loads only after the visitor clicks it. The embed uses YouTube's privacy-enhanced `youtube-nocookie.com` host.

To connect a video after publishing it, edit `assets/js/project-media-config.js` and replace the empty value for the matching project with either the 11-character YouTube video ID or a YouTube URL. Example:

```js
"job-portal": "https://youtu.be/VIDEO_ID"
```

Edit only that project's empty value; keep the other project keys in the object. The embedded YouTube player may still display YouTube branding; current YouTube documentation states that the old `modestbranding` parameter is deprecated and has no effect. The portfolio does not add a separate YouTube logo, title, or outbound player link.

## Education and experience pages

The homepage Journey section links to detail pages for BCA (United University), online MCA (Chandigarh University) and the Edunet Foundation frontend internship. MCA is labelled in progress. The Edunet Foundation internship PDF is included in `assets/certificates/` and can be viewed both from the experience page and the certificate library.

## Replace illustrative project images

Replace the current illustrative previews with actual project screenshots only when you have permission to publish them. Keep the filenames referenced by each gallery button and update the matching `alt` text and caption in the relevant `projects/*.html` page. The Job Portal student and recruiter images are sample workflow illustrations, not actual screen captures.

## Motion and accessibility

The site uses subtle entrance reveals and hover transitions. `prefers-reduced-motion: reduce` disables those effects. The reveal logic is progressive enhancement: content remains visible if JavaScript or IntersectionObserver is unavailable.


## Certificate library

The certificate gallery is available at `/certificates.html`. Add certificate files under `assets/certificates/` and add their metadata in `assets/js/certificates-data.js`. See `assets/certificates/README.md` for the schema, thumbnail workflow, orientation handling and examples. The original certificate file is always used in the viewer; thumbnails are only for the grid.


## Contact form setup (Hostinger / PHP hosting)

The contact form posts to `/contact.php`. The endpoint validates the fields, restricts requests to the site host, ignores submissions that fill the honeypot field, applies a basic per-IP rate limit and sends a plain-text email to `prabhansh.dev@gmail.com`. It does not store visitor messages in a database.

For production delivery on Hostinger or another PHP host:

1. Upload `contact.php` to the same public root as `index.html`; do not rename it.
2. Confirm the hosting plan supports PHP 8.1+ and has PHP `mail()` enabled.
3. Configure a sender address on the domain (default: `no-reply@prabhanshtiwari.com`). If the host supports environment variables, set `PORTFOLIO_CONTACT_FROM` to the verified sender mailbox.
4. Configure the domain's SPF and DKIM records with the email provider and send a real test from the deployed website. Check Inbox and Spam.
5. If PHP mail is disabled, the form returns an error and the visible direct-email fallback remains available. Do not claim successful delivery until a real message arrives.

This endpoint is designed for PHP-capable shared hosting. Static-only hosts such as GitHub Pages, Netlify static hosting or Vercel static deployments do not execute PHP; on those hosts, connect the form to a serverless function or a form provider instead of uploading `contact.php` unchanged.

## Résumé visibility

A résumé CTA is present in the sticky header on desktop, tablet and mobile, and in the mobile menu. The URL is controlled centrally by `assets/js/site-config.js` (`resumeUrl`). The existing Google Drive URL is retained. Replace it with a public PDF URL on your domain when you have a website-hosted résumé.

## Skills and GitHub section

The skills section deliberately avoids self-assessed percentage bars. Each technology group links to relevant project evidence or the learning section. The four repository cards in `index.html` mirror the repositories visible in the GitHub profile’s pinned area at the time of the October 29, 2026 review: `chai-aur-react`, `chai-aur-javascript`, `Portfolio` and `jobPortal`. Edit their cards when you change the pinned selection on GitHub. `assets/js/github.js` reads public repository metadata, public events and profile follower count from GitHub's unauthenticated REST API. It caches successful data in the visitor's browser for 30 minutes and keeps all static repository links usable when the API is unavailable or rate-limited. It does not use a token or expose private activity. GitHub's unauthenticated API has rate limits; the live activity panel is an enhancement, not a dependency for the page.

## SEO and search visibility

The homepage has a brand-consistent Person, WebSite and ProfilePage JSON-LD graph; page-specific title/description/canonical/Open Graph tags remain in place on individual pages. `robots.txt` allows crawling and points to `sitemap.xml`; the not-found page is marked `noindex`. SEO implementation improves discoverability signals but cannot guarantee indexing, a #1 ranking, or any specific search position. After deployment, verify the canonical HTTPS URL, create Google Search Console and Bing Webmaster Tools properties, submit the sitemap, inspect indexed URLs, and request indexing for the homepage and important case studies. Continue publishing unique, useful project write-ups and earn genuine references/links.
