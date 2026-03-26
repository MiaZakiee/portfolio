# Portfolio Roadmap

## Milestone 1 — Production-Ready Portfolio

**Goal:** Ship a polished, discoverable portfolio that ranks in search, loads fast, and creates a strong first impression for recruiters and collaborators.

---

### Phase 1: SEO & Discoverability

**Goal:** Make the portfolio fully discoverable by search engines and social platforms — correct metadata, structured data, sitemap, and performance foundations.

**Plans:** 3 plans

Plans:
- [ ] 01-01-PLAN.md — index.html SEO metadata + seo.json config (REQ-001 to REQ-007, REQ-013, REQ-014)
- [ ] 01-02-PLAN.md — Static public/ assets: robots.txt, sitemap.xml, favicons, og-image (REQ-006, REQ-010, REQ-011)
- [ ] 01-03-PLAN.md — Semantic HTML, ARIA labels, accessibility (REQ-008, REQ-009, REQ-012)

**Requirements:**
- REQ-001: `<title>` tag is descriptive and includes full name + role ("Nino Rey Cabiltes — Full Stack Developer")
- REQ-002: `<meta name="description">` concise summary of the portfolio for search results
- REQ-003: `<link rel="canonical">` pointing to https://ninocabiltes.dev
- REQ-004: Open Graph tags — og:title, og:description, og:image, og:url, og:type
- REQ-005: Twitter Card tags — twitter:card, twitter:title, twitter:description, twitter:image
- REQ-006: Favicon set (favicon.ico, 16x16, 32x32, 180x180 apple-touch-icon)
- REQ-007: JSON-LD structured data — Person schema with name, job title, url, social links
- REQ-008: Semantic HTML — h1, main, nav, section, article used appropriately
- REQ-009: All images have descriptive alt text
- REQ-010: robots.txt served from root
- REQ-011: sitemap.xml served from root (single-page SPA sitemap)
- REQ-012: Images optimized — compressed and lazy-loaded where appropriate
- REQ-013: Core Web Vitals — no render-blocking resources, fast LCP
- REQ-014: SEO config centralized in `src/data/seo.json` for easy updates

---

*Created: 2026-03-27*
