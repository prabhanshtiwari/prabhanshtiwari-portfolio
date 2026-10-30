# Portfolio refresh — verification record

**Source:** User-uploaded `prabhansh-portfolio.zip`
**Scope:** Homepage information architecture and design, consistent navigation across supporting pages, and Vercel/Resend contact-form hardening.

## Changes made

- Reduced the homepage from the previous long multi-topic layout to six focused sections: Hero, Selected Work, Skills, About, Writing & Teaching, and Contact.
- Reduced primary navigation to four destinations: Work, About, Writing and Contact. Kept the résumé and theme controls separate.
- Removed the homepage GitHub activity/dashboard, learning log, AI-philosophy block and certificate spotlight. Preserved the underlying project, education, experience and certificate detail pages.
- Consolidated education and internship highlights into a compact timeline in About.
- Simplified the skills area into three technology groups rather than large explanatory cards.
- Added restrained, labelled GitHub, LinkedIn, DEV Community and email icons in the hero. Retained text links in the footer for clarity.
- Added homepage-only styling scoped under `.home-page`; the case-study, project archive, certificate and education page layouts retain their existing component styles.
- Updated desktop and mobile navigation and replaced references to removed homepage anchors across supporting pages.
- Reworked the contact form's client behavior: duplicate-submit prevention, a request timeout, robust non-JSON error handling, preserved form values on failure, live message character count and accessible status messages.
- Hardened `/api/contact`: server-side sender/recipient validation, strict allowed-host checks, bounded request size, same-host Origin validation, input validation, honeypot handling, best-effort rate limiting, Resend failure logging without logging visitor message content, and generic visitor-facing errors.
- Added a no-dependency Node test suite and npm scripts.
- Updated README deployment and Resend instructions.

## Automated checks performed

| Check | Result |
|---|---:|
| Contact endpoint unit tests | 8 passed |
| Homepage structure, assets and supporting-page navigation tests | 5 passed |
| Total automated tests | 13 passed |
| JavaScript syntax checks | Passed for all site scripts and the API function |
| Stylesheet parser | No CSS parse errors |
| HTML parse / duplicate IDs / missing image alt / local files | Checked across all HTML pages |
| Local homepage assets | All referenced local assets present |
| Navigation destinations | Updated on supporting pages; no links remain to the removed GitHub/Learning/Journey homepage sections |
| API success/failure behavior | Tested with mocked Resend responses; no real email sent |

## What is not verified here

- The browser automation environment blocked navigation to the local preview with `ERR_BLOCKED_BY_ADMINISTRATOR`, so I could not honestly certify a visual browser screenshot or run a real viewport interaction test here.
- I do not have access to your Vercel deployment, production Function logs, Resend account or actual environment-variable values. Real inbox delivery therefore remains a deployment-side test.
- The API rate limiter uses warm-instance memory and is best-effort; it is not a distributed rate limiter.

## Production release checklist

1. Confirm `CONTACT_FROM_EMAIL` is a valid Resend sender identity on a domain verified in Resend, for example `Prabhansh Tiwari <website@your-verified-domain.com>`.
2. Confirm `CONTACT_TO_EMAIL` is one valid destination inbox and `RESEND_API_KEY` is the private Resend API key.
3. Confirm all three variables are enabled for Production in Vercel, then deploy the updated `main` branch. Environment-variable changes only apply to new deployments.
4. Test the live contact form and verify the message reaches the destination inbox. If it fails, inspect Vercel → Project → Logs → Functions and filter for `/api/contact`.
5. Run a desktop and mobile browser check and Lighthouse against the deployed site before treating the release as fully signed off.
