# Spec Floors LLC

Marketing website for **Spec Floors LLC**, a residential and commercial flooring
contractor serving McHenry County, Illinois.

**Live site:** https://specfloorsllc.com

---

## About the company

Spec Floors LLC installs hard-surface flooring for homes and businesses throughout
McHenry County — hardwood, engineered wood, laminate, luxury and enhanced vinyl plank
(LVP/EVP), rubber tile, VCT and carpet tile.

The company is owned and operated by Nick Herting, a lifelong McHenry County resident
with more than ten years of installation experience across residential remodels and
commercial spaces including offices, schools, medical suites and gyms.

Free estimates on every job. Fully insured.

**Phone:** 815-520-6734
**Email:** specfloorsnick@gmail.com

---

## About the site

A single-page site built with plain HTML, CSS and JavaScript — no frameworks, no build
step, and no dependencies. It is served as static files, which keeps it fast to load and
straightforward to maintain.

The visual design follows the company's business card: a deep navy and blue palette,
radial burst and halftone dot textures, and gold display lettering.

**Notable details**

- Mobile-first responsive layout, since most visitors arrive from a phone
- Persistent tap-to-call actions on every screen size
- Filterable gallery of completed work with a keyboard- and swipe-navigable lightbox
- Estimate request form
- Photography served as WebP with JPEG fallback; roughly 350 KB initial page load
- Semantic, accessible markup with structured data for local search

## Repository layout

```
index.html        page content
css/styles.css    styling
js/main.js        navigation, gallery filters, lightbox, estimate form
images/           project photography (WebP + JPEG)
favicon.svg       browser tab icon
robots.txt        search engine directions
sitemap.xml       search engine page list
CNAME             custom domain configuration
```

Notes on updating the site — editing copy, adding project photos, and configuring the
estimate form — are in [MAINTENANCE.md](MAINTENANCE.md).

---

© Spec Floors LLC. Site content and project photography are the property of
Spec Floors LLC. All rights reserved.
