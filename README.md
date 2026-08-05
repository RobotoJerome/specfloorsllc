# Spec Floors LLC — Website

A fast, single-page marketing site for Spec Floors LLC. Plain HTML, CSS and JavaScript —
no build step, no frameworks, no dependencies. Open `index.html` and it works.

```
index.html          the whole page
css/styles.css      all styling
js/main.js          menu, gallery filters, lightbox, estimate form
images/             optimized photos (WebP + JPEG)
favicon.svg         browser tab icon
robots.txt          search engine directions
sitemap.xml         search engine page list
```

> **Note:** the original iPhone `.heic` photos are deliberately excluded from the repo
> (see `.gitignore`). Browsers can't display HEIC — the converted WebP/JPEG files in
> `images/` are what the site serves. Keep the originals backed up locally; they're the
> source if photos ever need re-exporting.

---

## Publishing it

This site lives at **github.com/RobotoJerome/specfloorsllc** and is designed to be
served by **GitHub Pages** straight from the `main` branch — there's no build step,
so what's in the repo is exactly what gets served.

**To turn Pages on (one time):**

1. Go to the repo → **Settings** → **Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Set the branch to **`main`** and the folder to **`/ (root)`**. Save.

The site is live at **https://specfloorsllc.com** (custom domain, HTTPS enforced).
`www.specfloorsllc.com` redirects to it automatically. Every `git push` to `main`
republishes within a minute or two.

### Updating the site later

```bash
git add -A
git commit -m "Describe the change"
git push
```

### Connecting a real domain

When `specfloorsllc.com` (or similar) is registered, add it under Settings → Pages →
"Custom domain". GitHub walks you through the DNS records and issues an HTTPS
certificate for free.

**Then update these four places** so search engines and link previews point at the real
domain instead of the github.io address:

1. `index.html` — `<link rel="canonical">`
2. `index.html` — `og:url` and `og:image` (both must be full absolute URLs)
3. `index.html` — `url` and `image` in the JSON-LD block
4. `robots.txt` and `sitemap.xml` — the URLs in each

A custom domain also needs a `CNAME` file in the repo root containing just the domain
name — GitHub creates this for you when you set the custom domain in Settings.

---

## Editing the common things

Everything below lives in `index.html` unless noted.

**Phone number** — appears in ~10 places. Search for `815-520-6734` and replace all.
Note the clickable links use the format `tel:+18155206734` (with `+1`, no dashes) —
update those too.

**Email** — search for `specfloorsnick@gmail.com`. Also update `BUSINESS_EMAIL`
at the top of `js/main.js`.

**Text on the page** — it's all plain HTML. Find the sentence you want to change and type over it.

**Service area towns** — the `<ul class="towns">` list. Add or remove `<li>Town Name</li>` lines.

**Colors** — `css/styles.css`, the `:root { }` block at the very top. Every color on
the site comes from those variables, so changing `--gold` there changes it everywhere.

---

## Adding new project photos

Photos live in `images/`. Each one needs **two sizes**: a `-thumb` for the gallery grid
and a full-size for the pop-up viewer. If you have iPhone photos (`.heic`), they must be
converted first — browsers can't display HEIC.

Using [ffmpeg](https://ffmpeg.org):

```bash
ffmpeg -i IMG_1234.heic -frames:v 1 -update 1 -q:v 2 temp.jpg
ffmpeg -i temp.jpg -map_metadata -1 -vf "scale='if(gt(iw,ih),1800,-2)':'if(gt(iw,ih),-2,1800)'" -q:v 4 images/new-photo.jpg
ffmpeg -i images/new-photo.jpg -map_metadata -1 -q:v 75 images/new-photo.webp
ffmpeg -i temp.jpg -map_metadata -1 -vf "scale='if(gt(iw,ih),1000,-2)':'if(gt(iw,ih),-2,1000)'" -q:v 4 images/new-photo-thumb.jpg
ffmpeg -i images/new-photo-thumb.jpg -map_metadata -1 -q:v 72 images/new-photo-thumb.webp
```

Then copy an existing `<button class="shot">` block in the gallery, paste it, and swap the
filenames, the `alt` text, the `data-caption`, and the label. Set `data-cat` to
`residential`, `commercial`, `detail`, or any combination separated by spaces —
that's what the filter buttons use.

---

## How the estimate form works

**Right now:** submitting opens the visitor's email app with every field already filled
in — they just press send. This needs no account and no server, and works especially well
on phones. The trade-off is that a visitor on a desktop with no mail app configured may
see nothing happen (which is why the phone number is the loudest thing on the page).

**To have submissions arrive as email automatically instead:**

1. Sign up at [formspree.io](https://formspree.io) (free tier is plenty) and create a
   form pointed at `specfloorsnick@gmail.com`.
2. Copy the endpoint URL it gives you.
3. Open `js/main.js`, find `var FORM_ENDPOINT = '';` near the top, and paste it in:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
```

That's the only change needed — the form switches to background submission with a
thank-you message, and no longer opens a mail app.

---

## Notes on the content

A few things were written to be edited once real details are known:

- **No customer reviews are on the site.** Nothing was invented. Once there are a few
  real ones (Google reviews are the most valuable), they're worth adding — a testimonial
  section between "Our Work" and "About Nick" is the natural spot.
- **"VCT & Carpet Tile"** — carpet tile is included because it's advertised on the
  business card. If that's no longer offered, delete that one `<article class="card">`.
- **Insurance** is stated as "fully insured" with COI available on request. No license
  or certification numbers were added, since none were provided.
- **Business hours and a physical address** are deliberately absent. Adding hours helps
  local SEO; the `HomeAndConstructionBusiness` block near the top of `index.html` is
  where Google reads that structured data.

---

## Local preview

Double-clicking `index.html` works fine for a quick look — the whole site runs from the
filesystem. The fastest way to see it on a real URL (and test it on your phone) is to
drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop), which gives
you a live link in about ten seconds without an account.
