import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function countMatches(source, expression) {
  return [...source.matchAll(expression)].length;
}

test("homepage has six focused top-level content sections", () => {
  assert.equal(countMatches(html, /<section\b/g), 6);
  for (const id of ["work", "skills", "about", "writing", "contact"]) {
    assert.match(html, new RegExp(`id=[\"']${id}[\"']`));
  }
});

test("primary navigation is limited to four destinations", () => {
  const nav = html.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)?.[0] || "";
  assert.equal(countMatches(nav, /<a\b/g), 4);
});

test("homepage includes working Vercel contact form markup", () => {
  assert.match(html, /action="\/api\/contact"/);
  assert.match(html, /name="name"[^>]*required/);
  assert.match(html, /name="email"[^>]*required/);
  assert.match(html, /name="topic"[^>]*required/);
  assert.match(html, /name="message"[^>]*minlength="20"[^>]*maxlength="5000"/);
  assert.match(html, /name="website"/);
  assert.match(html, /data-contact-status/);
});

test("homepage local images and stylesheet resolve in the deployment root", () => {
  const paths = [...html.matchAll(/(?:src|href)="(\/(?:assets|favicon)[^"]*)"/g)].map((match) => match[1]);
  for (const path of paths) {
    const cleanPath = path.split(/[?#]/, 1)[0];
    assert.equal(existsSync(new URL(`..${cleanPath}`, import.meta.url)), true, `Missing local asset: ${cleanPath}`);
  }
});

test("every route uses the same four-link primary navigation and action layout", () => {
  const pages = [
    "../index.html",
    "../projects.html",
    "../certificates.html",
    "../404.html",
    "../education/bca-united-university.html",
    "../education/mca-chandigarh-university.html",
    "../experience/edunet-foundation.html",
    "../projects/pn-central-academy.html",
    "../projects/bootle-village-stores.html",
    "../projects/job-portal.html",
    "../projects/dynamic-weather-dashboard.html",
    "../projects/quiz-game.html",
  ];
  for (const pagePath of pages) {
    const page = readFileSync(new URL(pagePath, import.meta.url), "utf8");
    assert.equal(countMatches(page, /<header class="site-header home-header">/g), 1, `${pagePath} should have one shared header`);
    const desktopNav = page.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)?.[0] || "";
    const mobileNav = page.match(/<nav class="mobile-nav container"[\s\S]*?<\/nav>/)?.[0] || "";
    const actions = page.match(/<div class="nav-actions">([\s\S]*?)<\/div>/)?.[1] || "";
    assert.equal(countMatches(desktopNav, /<a\b/g), 4, `${pagePath} should have four primary links`);
    assert.equal(countMatches(mobileNav, /<a\b/g), 5, `${pagePath} should have the same four links plus résumé on mobile`);
    assert.equal(countMatches(actions, /<a\b/g), 1, `${pagePath} should have only one header action link`);
    assert.equal(countMatches(actions, /<button\b/g), 2, `${pagePath} should have theme and menu buttons`);
    assert.match(page, /id="theme-toggle"/);
    assert.match(page, /id="menu-toggle"/);
    assert.match(page, /id="mobile-nav"/);
    assert.doesNotMatch(actions, /All projects|Certificates|Writing|Contact|About/);
  }
});

test("every route uses the same footer markup and links", () => {
  const pages = [
    "../index.html",
    "../projects.html",
    "../certificates.html",
    "../404.html",
    "../education/bca-united-university.html",
    "../education/mca-chandigarh-university.html",
    "../experience/edunet-foundation.html",
    "../projects/pn-central-academy.html",
    "../projects/bootle-village-stores.html",
    "../projects/job-portal.html",
    "../projects/dynamic-weather-dashboard.html",
    "../projects/quiz-game.html",
  ];
  let referenceFooter = null;
  for (const pagePath of pages) {
    const page = readFileSync(new URL(pagePath, import.meta.url), "utf8");
    const footer = page.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)?.[0] || "";
    assert.ok(footer, `${pagePath} should include the shared site footer`);
    if (referenceFooter === null) referenceFooter = footer;
    assert.equal(footer, referenceFooter, `${pagePath} footer differs from the shared footer`);
    assert.match(page, /<main id="main"/);
    assert.match(footer, /footer-social-link[\s\S]*?GitHub/);
    assert.match(footer, /footer-social-link[\s\S]*?LinkedIn/);
    assert.match(footer, /footer-dev-mark/);
    assert.doesNotMatch(footer, /href="\/#skills"|href="\/#journey"|href="\/#learning"/);
  }
});

test("every route has identical primary navigation destinations", () => {
  const pages = [
    "../index.html", "../projects.html", "../certificates.html", "../404.html",
    "../education/bca-united-university.html", "../education/mca-chandigarh-university.html",
    "../experience/edunet-foundation.html", "../projects/pn-central-academy.html",
    "../projects/bootle-village-stores.html", "../projects/job-portal.html",
    "../projects/dynamic-weather-dashboard.html", "../projects/quiz-game.html",
  ];
  let expected = null;
  for (const pagePath of pages) {
    const page = readFileSync(new URL(pagePath, import.meta.url), "utf8");
    const header = page.match(/<header class="site-header home-header">[\s\S]*?<\/header>/)?.[0] || "";
    assert.ok(header, `${pagePath} should include the shared header`);
    const nav = header.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)?.[0] || "";
    const destinations = [...nav.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(destinations, ["/#work", "/#about", "/#writing", "/#contact"]);
    if (expected === null) expected = destinations;
    assert.deepEqual(destinations, expected);
  }
});
