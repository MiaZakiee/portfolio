# Phase 1: SEO & Discoverability - Research

**Researched:** 2026-03-27
**Domain:** Static SPA SEO — metadata, structured data, favicons, performance, static assets
**Confidence:** HIGH

---

## Summary

This is a static React 18 + Vite SPA with no SSR, deployed to GitHub Pages at https://ninocabiltes.dev. The entire SEO surface is `index.html` — there are no server-side render hooks or route-level metadata. Because the app is a single page, the complexity ceiling is low: one canonical URL, one sitemap entry, one metadata block.

The current `index.html` is essentially empty from an SEO standpoint: a generic `<title>Portfolio — Terminal</title>`, no meta description, no OG tags, no favicon beyond what the browser defaults to, and Google Fonts loaded synchronously (render-blocking). The Three.js canvas fills the viewport with no fallback semantic HTML — crawlers see an empty `<div id="root">`. Fixing this requires edits only to `index.html`, the `public/` directory, and a new `src/data/seo.json` config file.

The Vite `public/` directory is the right mechanism for `robots.txt`, `sitemap.xml`, and favicon assets — Vite copies everything in `public/` to the `dist/` root verbatim on build, which is exactly what GitHub Pages needs.

**Primary recommendation:** All 14 requirements are achievable with zero new npm dependencies. Edit `index.html`, add files to `public/`, create `src/data/seo.json`, and fix the Google Fonts load pattern to eliminate render-blocking.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-001 | `<title>` tag — "Nino Rey Cabiltes — Full Stack Developer" | Static string in `index.html` `<title>` |
| REQ-002 | `<meta name="description">` — concise portfolio summary | Static `<meta>` in `index.html` `<head>` |
| REQ-003 | `<link rel="canonical">` → https://ninocabiltes.dev | Static `<link>` in `index.html` `<head>` |
| REQ-004 | Open Graph tags (og:title, og:description, og:image, og:url, og:type) | Static `<meta property="og:*">` in `index.html` |
| REQ-005 | Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image) | Static `<meta name="twitter:*">` in `index.html` |
| REQ-006 | Favicon set (ico, 16, 32, 180 apple-touch-icon) | Files in `public/`, link tags in `index.html` |
| REQ-007 | JSON-LD Person schema | `<script type="application/ld+json">` in `index.html` |
| REQ-008 | Semantic HTML (h1, main, nav, section, article) | Audit and update JSX components in `src/components/` |
| REQ-009 | All images have descriptive alt text | Canvas has no `<img>` tags — use `aria-label` on `<canvas>` |
| REQ-010 | robots.txt at root | File in `public/robots.txt` |
| REQ-011 | sitemap.xml at root | File in `public/sitemap.xml` |
| REQ-012 | Images optimized — compressed, lazy-loaded | `ascii-art.png` in `public/` is only image; no `<img>` tags in app |
| REQ-013 | Core Web Vitals — no render-blocking resources | Fix Google Fonts `<link>` in `index.html` to async preload pattern |
| REQ-014 | SEO config centralized in `src/data/seo.json` | Create `src/data/seo.json`; values referenced when writing `index.html` by hand |
</phase_requirements>

---

## Standard Stack

### Core

No new npm packages required. All changes are to static files.

| Asset | Purpose | Mechanism |
|-------|---------|-----------|
| `index.html` | All meta tags, canonical, OG, Twitter, JSON-LD, font fix | Direct HTML edit |
| `public/robots.txt` | Crawl policy | Vite copies to `dist/` root |
| `public/sitemap.xml` | URL index for search engines | Vite copies to `dist/` root |
| `public/favicon.ico` | Legacy browser favicon | Vite copies to `dist/` root |
| `public/favicon-16x16.png` | Standard small favicon | Vite copies to `dist/` root |
| `public/favicon-32x32.png` | Standard retina favicon | Vite copies to `dist/` root |
| `public/apple-touch-icon.png` | iOS home screen icon (180x180) | Vite copies to `dist/` root |
| `src/data/seo.json` | Centralized SEO config (REQ-014) | Humans read it when updating `index.html` |

### Key Fact: Vite `public/` Directory Behavior

Files placed in `public/` are served at `/` during `pnpm dev` and copied verbatim to the `dist/` root by `pnpm build`. This is the correct mechanism for `robots.txt`, `sitemap.xml`, and favicons.

The project already uses `public/` (it contains `ascii-art.png` and `CNAME`), so the pattern is established.

### Why No Plugin Is Needed

`vite-plugin-sitemap` and similar tools add build-time complexity. For a single-URL SPA, the sitemap is a trivial static file. Write it by hand in `public/sitemap.xml` — it needs one `<url>` entry and never changes unless the domain does.

---

## Architecture Patterns

### Where SEO Lives in This Project

```
index.html                  # All <head> metadata — the ONLY SEO surface
public/
├── robots.txt              # NEW: Crawl rules
├── sitemap.xml             # NEW: Single-URL sitemap
├── favicon.ico             # NEW: 32x32 ICO for legacy browsers
├── favicon-16x16.png       # NEW: 16x16 PNG
├── favicon-32x32.png       # NEW: 32x32 PNG
└── apple-touch-icon.png    # NEW: 180x180 PNG for iOS
src/data/
└── seo.json                # NEW: Centralized SEO values (REQ-014)
src/components/
├── Navbar.jsx              # EDIT: Add semantic nav/h1
└── (others)                # AUDIT: Ensure main, section, article used
```

### Pattern 1: Complete `index.html` `<head>` Structure

The target state for `index.html` after this phase:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- REQ-001: Title -->
    <title>Nino Rey Cabiltes — Full Stack Developer</title>

    <!-- REQ-002: Meta description -->
    <meta name="description" content="Portfolio of Nino Rey Cabiltes, Full Stack Developer based in Cebu City, Philippines. Building web applications with React, Node.js, and modern tooling." />

    <!-- REQ-003: Canonical -->
    <link rel="canonical" href="https://ninocabiltes.dev" />

    <!-- REQ-004: Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://ninocabiltes.dev" />
    <meta property="og:title" content="Nino Rey Cabiltes — Full Stack Developer" />
    <meta property="og:description" content="Portfolio of Nino Rey Cabiltes, Full Stack Developer based in Cebu City, Philippines." />
    <meta property="og:image" content="https://ninocabiltes.dev/og-image.png" />

    <!-- REQ-005: Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Nino Rey Cabiltes — Full Stack Developer" />
    <meta name="twitter:description" content="Portfolio of Nino Rey Cabiltes, Full Stack Developer based in Cebu City, Philippines." />
    <meta name="twitter:image" content="https://ninocabiltes.dev/og-image.png" />

    <!-- REQ-006: Favicons -->
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- REQ-007: JSON-LD Person schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Nino Rey Cabiltes",
      "jobTitle": "Full Stack Developer",
      "url": "https://ninocabiltes.dev",
      "email": "ninocabiltes@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cebu City",
        "addressCountry": "PH"
      },
      "sameAs": [
        "https://github.com/MiaZakiee",
        "https://www.linkedin.com/in/ninocabiltes/"
      ]
    }
    </script>

    <!-- REQ-013: Google Fonts async (non-render-blocking) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" />
    </noscript>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Pattern 2: robots.txt (REQ-010)

Simple allow-all with sitemap reference:

```
User-agent: *
Allow: /
Sitemap: https://ninocabiltes.dev/sitemap.xml
```

### Pattern 3: sitemap.xml (REQ-011)

Single-URL sitemap per sitemaps.org protocol:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ninocabiltes.dev/</loc>
    <lastmod>2026-03-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Pattern 4: seo.json (REQ-014)

Centralized source of truth for SEO values:

```json
{
  "title": "Nino Rey Cabiltes — Full Stack Developer",
  "description": "Portfolio of Nino Rey Cabiltes, Full Stack Developer based in Cebu City, Philippines. Building web applications with React, Node.js, and modern tooling.",
  "url": "https://ninocabiltes.dev",
  "ogImage": "https://ninocabiltes.dev/og-image.png",
  "twitterHandle": "@ninocabiltes",
  "locale": "en_US",
  "author": "Nino Rey Cabiltes"
}
```

Note: `index.html` is static — `seo.json` is NOT read at build time by any plugin. It serves as a human-editable single source of truth so values stay in sync when updating `index.html` manually. The planner should document this contract clearly.

### Pattern 5: Favicon Generation

Use https://favicon.io or https://realfavicongenerator.net to generate the full favicon set from a single source image. The `ascii-art.png` already in `public/` could serve as source art if appropriate.

**Minimal modern favicon set (per Evil Martians / 2025 best practice):**

```
public/
├── favicon.ico           # 32x32, ICO format — legacy browsers
├── favicon-16x16.png     # Standard browser tab
├── favicon-32x32.png     # Retina browser tab
└── apple-touch-icon.png  # 180x180 — iOS home screen
```

HTML link tags (to go in `index.html`):
```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

### Pattern 6: JSON-LD Person Schema

Google recommends placing JSON-LD in `<head>`. For a portfolio, the `Person` type is correct. Required properties: `@context`, `@type`, `name`. Useful properties: `jobTitle`, `url`, `email`, `address`, `sameAs` (for social profiles).

Source data from `src/data/personalDetails.json` and `src/data/contacts.json` should be reflected verbatim in the schema.

### Anti-Patterns to Avoid

- **Render-blocking Google Fonts:** The current `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` is synchronously render-blocking. Switching to the `rel="preload"` + `onload` pattern eliminates this. The `<noscript>` fallback is required for users without JS.
- **`og:image` pointing to a non-existent file:** OG image must be an absolute URL to a real file. Need to either create an `og-image.png` static asset in `public/` or skip the image tag entirely (social shares will render text-only cards without it, which is acceptable).
- **Skipping `<noscript>` for fonts:** Without the noscript fallback, users who have JS disabled will get no fonts loaded at all.
- **Using relative URLs in sitemap/canonical/OG:** These must always be absolute URLs with protocol and domain.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Favicon variants | Manual image resize scripts | https://favicon.io or https://realfavicongenerator.net |
| OG image | Complex canvas/screenshot automation | Static 1200x630 PNG placed in `public/og-image.png` |
| Sitemap generation | Build plugin | Static `public/sitemap.xml` (single URL, never needs automation) |

**Key insight:** For a single-URL static SPA, automated sitemap/favicon generation is over-engineering. Static files in `public/` are simpler, more reliable, and require no added dependencies.

---

## REQ-008 Special Case: Semantic HTML in a Three.js Canvas App

This is the most nuanced requirement. The entire visual UI is a WebGL `<canvas>` rendered by `@react-three/fiber`. Crawlers see `<div id="root"></div>` and whatever React renders into it.

**What crawlers actually see:** The `<div id="root">` contains the output of React's render. The `BeachScene` component renders an R3F `<Canvas>`, which outputs a `<canvas>` element. The `Navbar` and `PostIt` components render real DOM nodes above the canvas.

**Semantic HTML strategy:**

1. **`Navbar.jsx`** — already renders real DOM. Wrap its links in a `<nav>` element. Add an `<h1>` here or in the non-canvas portion of `App.jsx` (visually hidden is fine for SEO).
2. **`App.jsx`** — wrap the non-canvas overlay content in a `<main>` element.
3. **The `<canvas>` element** — add `aria-label="Interactive 3D beach scene portfolio"` and `role="img"` so screen readers understand it. The canvas itself cannot carry semantic content.
4. **No traditional `<img>` tags** — the Three.js scene has no `<img>` elements to add `alt` to. The `ascii-art.png` in `public/` is not rendered as an `<img>` in the app (it's referenced in `personalDetails.json` ascii art as text lines). REQ-009 is satisfied by the canvas `aria-label`.

**The h1 decision:** For SEO, a page needs exactly one `<h1>`. The most practical placement is in `Navbar.jsx` as a visually-styled element, or as a screen-reader-only `<h1>` in `App.jsx`. The content should be "Nino Rey Cabiltes — Full Stack Developer" to match the title tag.

---

## Common Pitfalls

### Pitfall 1: og:image with a missing or non-absolute URL
**What goes wrong:** Social platforms show a broken image or fall back to text-only cards. Tools like the OG debugger report errors.
**Why it happens:** `og:image` must point to a publicly accessible absolute URL. A relative path or a URL for a file that doesn't exist will fail silently.
**How to avoid:** Create a static `og-image.png` (1200x630px) in `public/` before adding the `og:image` meta tag. Use `https://ninocabiltes.dev/og-image.png` as the value.
**Warning signs:** Facebook Debugger or Twitter Card Validator shows image fetch error.

### Pitfall 2: Google Fonts render-blocking regression
**What goes wrong:** Restoring the old `<link rel="stylesheet" href="...fonts.googleapis.com">` pattern after editing eliminates the async improvement.
**Why it happens:** It's easy to accidentally revert to the simpler/more familiar `rel="stylesheet"` form.
**How to avoid:** The correct pattern is `rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'"` plus a `<noscript>` fallback. Document this pattern in the codebase.

### Pitfall 3: SPA redirect eating robots.txt / sitemap.xml
**What goes wrong:** GitHub Pages serves `index.html` for all 404s, which can cause `/robots.txt` to return HTML instead of the text file. This is rare for GitHub Pages with a `public/` setup because Vite copies files to `dist/` root directly, and GitHub Pages serves those files before triggering the SPA redirect.
**Why it happens:** SPA redirect rules on some hosts intercept all requests. GitHub Pages only triggers the 404 fallback if a file doesn't exist at the path.
**How to avoid:** Since the files are in `public/`, Vite copies them to `dist/` root. They exist as real files at the URLs and GitHub Pages will serve them directly. No special configuration needed.

### Pitfall 4: JSON-LD with incorrect `@context` URL
**What goes wrong:** Structured data validators reject the schema.
**Why it happens:** Using `http://schema.org` (HTTP) instead of `https://schema.org` (HTTPS). Both work technically, but HTTPS is the current recommended form.
**How to avoid:** Always use `"@context": "https://schema.org"`.

### Pitfall 5: seo.json values diverging from index.html
**What goes wrong:** The canonical "source of truth" JSON becomes stale — `index.html` gets edited directly without updating `seo.json`.
**Why it happens:** There's no build-time enforcement (no plugin reads `seo.json` at build time — it's a human-readable reference).
**How to avoid:** The planner should note in task descriptions that any edit to SEO values must update both `index.html` and `src/data/seo.json` together. This is a convention, not enforced by code.

---

## Code Examples

### Google Fonts Async Pattern (replaces current render-blocking link)

```html
<!-- Source: https://pagespeedchecklist.com/asynchronous-google-fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" />
</noscript>
```

### JSON-LD Person Schema for This Portfolio

```html
<!-- Source: https://schema.org/Person + https://jsonld.com/person/ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Nino Rey Cabiltes",
  "jobTitle": "Full Stack Developer",
  "url": "https://ninocabiltes.dev",
  "email": "ninocabiltes@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cebu City",
    "addressCountry": "PH"
  },
  "sameAs": [
    "https://github.com/MiaZakiee",
    "https://www.linkedin.com/in/ninocabiltes/"
  ]
}
</script>
```

### Canvas ARIA for WebGL Scene (REQ-009)

```jsx
// Source: https://github.com/pmndrs/react-three-a11y (pattern, not library)
// In App.jsx or BeachScene.jsx — the R3F Canvas component
<Canvas
  aria-label="Interactive 3D beach scene portfolio for Nino Rey Cabiltes"
  role="img"
>
  {/* ...children */}
</Canvas>
```

### Visually Hidden h1 Pattern

```jsx
// In App.jsx or Navbar.jsx — SEO h1 visible to crawlers, hidden from visual UI
<h1 style={{
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  borderWidth: 0
}}>
  Nino Rey Cabiltes — Full Stack Developer
</h1>
```

Or add the CSS class `.sr-only` to `global.css` and use `<h1 className="sr-only">`.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| `rel="stylesheet"` Google Fonts | `rel="preload" + onload` async | Eliminates render-blocking; improves LCP |
| Many favicon sizes (20+ files) | 3-4 canonical sizes: ico, 16, 32, 180 | Simpler; covers all real use cases |
| `twitter:` prefix meta tags | Still `twitter:` prefix (X hasn't changed this) | No change needed; `twitter:` still works on X/Twitter |
| Microdata / RDFa for structured data | JSON-LD in `<script>` | Google recommends JSON-LD; decoupled from markup |

**Deprecated/outdated:**
- `<meta name="keywords">`: Google ignores it. Do not add.
- `<meta http-equiv="X-UA-Compatible" content="IE=edge">`: Unnecessary. IE is dead.
- Multiple favicon link tags with `rel="shortcut icon"`: Use `rel="icon"` only.

---

## Open Questions

1. **OG image: create new or repurpose ascii-art.png?**
   - What we know: `public/ascii-art.png` exists. We don't know its dimensions or if it's suitable for 1200x630 social cards.
   - What's unclear: Whether a new branded OG image should be created vs. cropping/adapting existing art.
   - Recommendation: Create a new `public/og-image.png` at 1200x630. If the developer doesn't have a graphic ready, the meta tag can be omitted from the initial merge and added later — Twitter/OG tags function without an image, showing text-only cards.

2. **Favicon source art: what base image to use?**
   - What we know: The project is "Beach Terminal" themed. No dedicated logo asset exists.
   - What's unclear: Whether to use a terminal-themed icon, the ascii art, or a simple text-based mark.
   - Recommendation: Use https://favicon.io/favicon-generator/ to generate a text-based favicon ("NR" or "N" initials) as a quick starting point. The developer can replace it with a custom design later.

3. **`<h1>` placement: visually hidden or visible?**
   - What we know: The Navbar has a visual title area. The BeachScene fills the viewport.
   - What's unclear: Whether the designer wants a visible h1 in the Navbar or prefers screen-reader-only.
   - Recommendation: Use `sr-only` hidden h1 in App.jsx. Does not affect visual design. Satisfies REQ-008 for crawlers. The planner can mark this as Claude's discretion since no design constraint was stated.

---

## Environment Availability

Step 2.6: SKIPPED — this phase requires no external services, databases, or CLI tools beyond `pnpm` (confirmed present in the CI workflow). All work is static file creation and HTML editing.

---

## Validation Architecture

No test framework is present in this project (confirmed: no `jest.config.*`, no `vitest.config.*`, no `tests/` directory, no test scripts in `package.json`). The `workflow.nyquist_validation` config does not exist (`.planning/config.json` absent).

For this phase, validation is manual but structured:

### Phase Verification Checklist (manual — no automated test framework)

| REQ | Verification Method | Tool |
|-----|--------------------|----|
| REQ-001 | View page source; confirm `<title>` value | Browser devtools |
| REQ-002 | View page source; confirm `<meta name="description">` | Browser devtools |
| REQ-003 | View page source; confirm `<link rel="canonical">` | Browser devtools |
| REQ-004 | Paste URL into https://www.opengraph.xyz | OG debugger |
| REQ-005 | Paste URL into https://cards-dev.twitter.com/validator | Twitter Card validator |
| REQ-006 | Confirm favicon appears in browser tab; test on iOS Safari | Browser + device |
| REQ-007 | Paste URL into https://validator.schema.org | Schema.org validator |
| REQ-008 | View page source; confirm `<nav>`, `<main>`, `<h1>` present | Browser devtools |
| REQ-009 | Inspect canvas element; confirm `aria-label` attribute | Browser devtools |
| REQ-010 | Fetch https://ninocabiltes.dev/robots.txt | Browser / curl |
| REQ-011 | Fetch https://ninocabiltes.dev/sitemap.xml | Browser / curl |
| REQ-012 | Confirm `ascii-art.png` not referenced as `<img>` without alt | Inspect HTML |
| REQ-013 | Run Lighthouse audit; confirm no render-blocking resources | Chrome DevTools Lighthouse |
| REQ-014 | Confirm `src/data/seo.json` exists and values match `index.html` | File inspection |

### Wave 0 Gaps

None — no test framework setup required. All validation is manual inspection against the checklist above.

---

## Sources

### Primary (HIGH confidence)
- https://vite.dev/guide/assets — Vite public directory behavior (files copied verbatim to `dist/`)
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap — Sitemap XML format, Google requirements
- https://ogp.me — Open Graph protocol specification
- https://schema.org/Person — JSON-LD Person type properties
- https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image — Twitter Card `summary_large_image` required tags
- https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs — Minimal modern favicon set (3 files + optional PWA)

### Secondary (MEDIUM confidence)
- https://pagespeedchecklist.com/asynchronous-google-fonts — Google Fonts async preload pattern (verified against general web perf best practice)
- https://jsonld.com/person/ — Person schema example (aligns with schema.org spec)
- https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt — robots.txt syntax
- https://github.com/pmndrs/react-three-a11y — R3F accessibility tooling; ARIA patterns for canvas

### Tertiary (LOW confidence — note for validation)
- WebSearch results on SPA render-blocking and crawlability — directionally correct but verified against higher-priority sources above

---

## Metadata

**Confidence breakdown:**
- Standard stack (no new deps): HIGH — Vite `public/` behavior is documented and confirmed by project structure
- index.html metadata patterns: HIGH — all tags verified against official specs (OGP, schema.org, X developer docs)
- Google Fonts fix: HIGH — async preload pattern well-documented; noscript fallback verified
- Favicon set: HIGH — verified against Evil Martians guide + browser support reality
- Semantic HTML / canvas ARIA: MEDIUM — canvas ARIA approach confirmed by pmndrs/react-three-a11y; exact JSX placement is Claude's discretion
- sitemap/robots.txt: HIGH — Google Search Central docs; Vite public/ mechanism confirmed

**Research date:** 2026-03-27
**Valid until:** 2026-09-27 (stable domain — OGP/schema.org/Vite specifications change slowly)
