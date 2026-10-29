# Portfolio v5 — SEO and Vercel compatibility update

**Date:** 29 October 2026  
**Source:** User-supplied `prabhansh-portfolio-production-v4(1).zip`  
**Output:** `prabhansh-portfolio-production-v5.zip`

## Preserved features

The existing homepage, projects archive, five project case studies, project galleries and video slots, technical skills, GitHub activity, résumé controls, education pages, experience page, certificate library, light/dark themes, responsive navigation, animations and accessibility features were retained.

## Changes in this update

### Indexing and SEO

- Standardised canonical URLs, Open Graph URLs, Twitter image URLs and first-party JSON-LD URLs on `https://www.prabhanshtiwari.com`.
- Rebuilt the sitemap with the XML declaration as the first bytes (UTF-8, no BOM), and retained all 11 indexable pages. The sitemap contains no 404 or API route.
- Kept `robots.txt` permissive and aligned its sitemap directive with the www host.
- Fixed the malformed Quiz Game `og:image` URL.
- Added complete Twitter/X card metadata to the BCA, MCA and Edunet experience pages; standardised social preview metadata on all 11 indexable pages, including image dimensions and alt text.
- Added author metadata and `max-image-preview:large` to indexable pages. Kept the 404 page `noindex, follow` and did not give it a canonical URL.
- Tightened unique page titles and descriptions while preserving their actual subject matter.
- Corrected the optional Apache/LiteSpeed `.htaccess` rule so it redirects non-www/HTTP requests to HTTPS www without redirecting an already-canonical www request to itself. Vercel ignores `.htaccess`.
- Corrected the Job Portal `SoftwareApplication` JSON-LD to use `sameAs` for its GitHub repository rather than the unrelated `codeRepository` property.

### Contact form compatibility for Vercel

- Added `api/contact.mjs`, a native Vercel Node.js function that validates same-origin POST requests, input lengths/topics/email, content size and a hidden honeypot. It sends messages via the Resend API when Vercel environment variables are configured.
- Changed the browser form submission to URL-encoded data, which is parsed by Vercel's function and also remains compatible with PHP `$_POST`.
- Kept `contact.php` as a fallback for PHP-capable hosting.
- Added `.gitignore` rules for secrets and local tooling.
- Documented the required Vercel variables: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and optional `CONTACT_TO_EMAIL`. Actual delivery is not active until the user configures a Resend account, verifies a sender domain, adds the variables in Vercel and tests a real inbox delivery.

## Validation results

| Check                                |                                                                              Result |
| ------------------------------------ | ----------------------------------------------------------------------------------: |
| HTML documents                       |                                                                           12 parsed |
| Unique canonical pages               |                                                                             11 / 11 |
| Titles and descriptions              |                                        Present and unique on all 11 indexable pages |
| Canonical/Open Graph URL agreement   |                                                                             11 / 11 |
| Twitter card/image metadata          |                                                                             11 / 11 |
| JSON-LD syntax                       | All blocks parse as JSON; project and education entities use appropriate properties |
| Sitemap XML                          |                                    Valid; 11 www URLs; XML declaration at byte zero |
| Sitemap URLs vs canonical pages      |                                                                         Exact match |
| Robots policy                        |                                                 Allows crawl; points to www sitemap |
| 404 handling                         |                                            `noindex, follow`; excluded from sitemap |
| Local asset/link paths and fragments |                                           470 checked; 0 missing files or fragments |
| JavaScript syntax                    |                            All site scripts and Vercel function pass `node --check` |
| Vercel contact endpoint              |    Method, origin, validation, honeypot, unconfigured and mocked-success tests pass |
| ZIP integrity                        |                                                                              Passed |

### Contact delivery limitation

The Vercel contact endpoint is implemented but cannot send email until the owner supplies valid Resend environment variables. A mocked Resend success was used for code-path testing; no real email was sent and no inbox delivery is claimed. The best-effort in-memory rate limit may reset across serverless instances; use a shared rate-limit store for stronger production abuse protection.

### Indexing limitation

This package corrects technical signals under the site's control. It cannot force Google to crawl or index a URL, clear Google's cached robots response immediately, or guarantee any search ranking. After deployment, inspect the canonical `www` URLs in Google Search Console and check the live robots fetch and Pages report.

## Deployment steps

1. Upload/commit the contents of this ZIP to the GitHub repository's `main` branch (do not upload the ZIP itself as a nested file).
2. Confirm Vercel builds the latest production commit successfully. No build command or install command is required for this static site; Vercel detects `api/contact.mjs` as a Node.js Function.
3. Configure `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in Vercel, optionally `CONTACT_TO_EMAIL`, and redeploy to enable email delivery.
4. Verify `https://www.prabhanshtiwari.com/robots.txt`, `/sitemap.xml`, the homepage and each canonical page.
5. In Search Console, retain the successful www sitemap submission, then inspect the www homepage and the other canonical URLs. Request indexing only after live tests show that Google can crawl them.
