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

## Navigation consistency correction (30 October 2026)

A follow-up audit found malformed header markup on the secondary routes: duplicate section links and archive links had been placed inside the header action container, and the container ended with an invalid `</nav>` closing tag. This caused the header to render differently from the homepage.

- Replaced the header on all 12 HTML routes with one identical semantic structure.
- Desktop navigation is consistently limited to Work, About, Writing and Contact.
- Mobile navigation contains the same four destinations plus Résumé, and the mobile menu toggle is present on every route.
- Header actions are consistently limited to Résumé, theme toggle and mobile-menu toggle.
- Applied shared header container widths and narrow-screen spacing across all routes.
- Expanded the navigation regression test to check all 12 routes, including 404, project detail, education and experience pages.
- Re-ran the complete test suite: 13 tests passed. JavaScript syntax checks passed. Structural checks found one header per page, four desktop links, five mobile links and no duplicate HTML IDs across all 12 pages.

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

## Footer consistency correction (30 October 2026)

- Replaced the homepage-specific footer and all secondary-page footers with one identical shared footer structure across all 12 HTML routes.
- Standardized the footer's brand description, Explore links, social/contact destinations, copyright line and back-to-top link.
- Removed stale footer links to deleted homepage sections and consolidated redundant footer content.
- Adjusted shared footer grid sizing for desktop, tablet and mobile layouts.
- Added regression tests that compare the complete footer markup across every route and assert identical primary navigation destinations.
- Added restrained inline SVG icons for email, GitHub and LinkedIn plus a compact DEV mark in the shared footer; all icons are decorative to assistive technology while link text remains accessible.
- Final follow-up verification: 15 automated tests passed; all 12 HTML routes passed local-link, fragment-target, unique-ID, single shared-header/footer and image-alt checks; stylesheet parsed with zero CSS errors; all JavaScript syntax checks passed.
