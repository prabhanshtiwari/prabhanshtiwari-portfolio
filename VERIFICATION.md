# Portfolio v4 — implementation and verification report

**Audit date:** 29 October 2026  
**Source:** `prabhansh-portfolio-production-v3.zip` supplied in this conversation  
**Output:** `prabhansh-portfolio-production-v4.zip`

## Changes implemented

### Site structure and navigation
- Preserved all existing project case studies, project archive, certificate library, project galleries, video configuration, education and experience detail pages, theme switch, animations, metadata and responsive layouts.
- Expanded the homepage structure into clear sections: hero, engineering philosophy, technical skills, selected projects, GitHub, learning, AI/engineering principles, education and experience, certificates, writing, background and contact.
- Kept project case studies individually crawlable and consistently linked to their live/demo page and source repository.
- Added an architecture overview to the README.

### Technical skills and evidence
- Added four evidence-led skill groups: frontend, backend/API, databases, and tools/collaboration, plus current cloud/infrastructure learning.
- Avoided unsupported skill percentage ratings. Each group links to relevant project or learning evidence.
- Confirmed each of the five case studies retains its demo and source-code links. The external repository URLs for P.N. Central Academy, Bootle Village Stores, Dynamic Weather Dashboard and Quiz Game were confirmed to exist on GitHub during this review.
- Project images already in the package are explicitly labelled as illustrative where they are not actual product screenshots. No fake user outcomes, testimonials, usage statistics or production screenshots were added.

### GitHub activity and pinned projects
- Added four featured repositories matching the public GitHub profile's pinned repositories on 29 October 2026: `chai-aur-react`, `chai-aur-javascript`, `Portfolio`, and `jobPortal`.
- Added live public repository metadata, language, star count, profile public repository count, follower count and recent public events using GitHub's unauthenticated REST API.
- Added 30-minute browser-side caching, timeout handling and graceful fallback. Static repository links remain available when GitHub is rate-limited or unavailable. No token is embedded.

### Résumé visibility
- Added a persistent résumé action to the site header on all indexable pages. At mobile widths it becomes a compact `CV` button. It remains visible down to 320px in the responsive test.
- Retained the supplied Google Drive résumé URL; replace it with a website-hosted PDF URL when available.

### Contact system
- Added an accessible contact form with name, email, enquiry topic and message fields, plus a hidden honeypot.
- Implemented `contact.php` for PHP 8.1+ hosting: POST-only, strict field validation, allowed-host/origin checks, content-length limit, basic per-IP rate limiting and plain-text email delivery using PHP `mail()`.
- Added client-side asynchronous submission, success/error messaging and a direct email fallback.
- No visitor messages are stored in a database. No third-party service or API key is required.

### SEO and crawlability
- Standardised page titles, descriptions, canonical URLs, Open Graph/Twitter metadata and JSON-LD where appropriate.
- Kept one canonical host (`https://prabhanshtiwari.com/`) in canonical tags and sitemap; provided HTTPS and `www` to apex redirects in the Apache/LiteSpeed `.htaccess`.
- Confirmed `robots.txt` references the sitemap, the sitemap lists all indexable content pages and the 404 page is `noindex`.
- SEO implementation improves technical eligibility and brand clarity but cannot guarantee indexing or first place for a query. Search Console/Bing Webmaster Tools, external references, relevant content and time after deployment remain necessary.

## Verification results

| Check | Result |
|---|---|
| HTML pages parsed | 12 passed |
| Unique canonical URLs | 11 / 11 |
| JavaScript syntax | 9 files passed |
| CSS parsing | 0 parser errors |
| JSON-LD, sitemap and manifests | Passed |
| Local references and fragments | Passed |
| Same-origin HTTP paths | 42 / 42 successful (contact GET intentionally returns 405) |
| Résumé visibility | Visible at 1440, 1024, 768, 390, 360 and 320px |
| Horizontal overflow | None at tested widths |
| Browser console/page errors | 0 |
| Skills / GitHub cards | 4 / 4, all reveal correctly |
| Browser contact form success flow | Passed with mocked mail response |
| GitHub UI integration | Passed with mocked API responses |
| PHP syntax | Passed |
| ZIP integrity | Passed |

### Contact endpoint test detail
- `GET /contact.php` → `405 Method Not Allowed` (expected).
- Invalid email → `422 Unprocessable Content` (expected).
- Foreign Origin → `403 Forbidden` (expected).
- Honeypot filled → `200` generic acknowledgement without mail delivery (expected spam suppression).
- Valid submission → `503` in this environment because PHP `mail()` cannot hand off to a configured mail transport. The website's frontend success state was verified with a mocked success response. **Actual email delivery is not yet certified.**

### Browser validation limitation
Chromium loaded the homepage and assets in an in-memory test page. The full-page desktop and mobile layouts were inspected; browser tests covered the sticky résumé CTA, mobile menu, section reveals, GitHub cards/data rendering, no-overflow widths, and contact submission UI. The local HTTP server was tested separately because browser navigation to its loopback address is blocked by the environment. This does not certify every browser, the deployed host, or external API availability.

## Required deployment actions

1. Deploy on PHP 8.1+ hosting if you want to use `contact.php` as included. Static-only Vercel/Netlify/GitHub Pages hosting will not execute PHP; use a serverless function or form provider there.
2. On the PHP host, configure `mail()` or the host's recommended SMTP transport. Set a verified domain sender (`PORTFOLIO_CONTACT_FROM` if environment variables are supported), configure SPF/DKIM, then submit a real form and verify Inbox/Spam.
3. Replace the Google Drive résumé URL with a public, current PDF on your domain if desired.
4. Replace illustrative project preview assets with actual screenshots or screen recordings you are authorised to publish. No new real screenshots, verified metrics or testimonials were fabricated.
5. Check the included Edunet certificate for personal identifiers before publishing.
6. Open all external project demos and test real application workflows/APIs on the deployed endpoints. The portfolio's local checks do not verify those services.
7. After DNS/hosting is stable, create/verify the domain in Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`, inspect canonical/index coverage and review Lighthouse/Core Web Vitals.

**Result:** Static validation, local HTTP checks, Chromium UI tests and packaging checks passed. Contact email delivery and production deployment checks remain pending host configuration. No #1 search ranking guarantee is possible.
