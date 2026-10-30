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

test("supporting pages use the shortened homepage navigation", () => {
  const pages = [
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
    const nav = page.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)?.[0] || "";
    assert.equal(countMatches(nav, /<a\b/g), 4, `${pagePath} should have four primary links`);
    assert.doesNotMatch(page, /href="\/#(?:github|journey|learning|certificates|ai-and-engineering)"/);
  }
});
