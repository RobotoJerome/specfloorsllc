# Maintenance Guide

Practical notes for updating the Spec Floors LLC website. Nothing here is required
reading to browse the code — see [README.md](README.md) for an overview of the project.

The site is plain HTML, CSS and JavaScript with no build step, so what's in the
repository is exactly what gets served.

---

## Deploying a change

The site is served by GitHub Pages from the `main` branch. Any push to `main`
republishes it automatically within a minute or two.

```bash
git add -A
git commit -m "Describe the change"
git push
```

To preview before pushing, open `index.html` directly in a browser — the whole site runs
from the filesystem. To test on a phone, drag the folder onto
[app.netlify.com/drop](https://app.netlify.com/drop) for a temporary live URL.

---

## Editing common things

Everything below is in `index.html` unless noted.

**Phone number** — appears in roughly ten places. Search for `815-520-6734` and replace
all. The clickable links use a different format, `tel:+18155206734` (leading `+1`, no
dashes), so search for that too.

**Email address** — search for `specfloorsnick@gmail.com`. Also update `BUSINESS_EMAIL`
near the top of `js/main.js`.

**Page copy** — plain HTML. Find the sentence and type over it.

**Service area towns** — the `<ul class="towns">` list. Add or remove
`<li>Town Name</li>` lines.

**Colors** — `css/styles.css`, the `:root { }` block at the very top. Every color on the
site derives from those variables, so changing `--gold` there changes it everywhere.

---

## Adding project photos

Each photo needs **two sizes**: a `-thumb` version for the gallery grid and a full-size
version for the lightbox. iPhone `.heic` files must be converted first — browsers cannot
display HEIC.

Using [ffmpeg](https://ffmpeg.org):

```bash
ffmpeg -i IMG_1234.heic -frames:v 1 -update 1 -q:v 2 temp.jpg
ffmpeg -i temp.jpg -map_metadata -1 -vf "scale='if(gt(iw,ih),1800,-2)':'if(gt(iw,ih),-2,1800)'" -q:v 4 images/new-photo.jpg
ffmpeg -i images/new-photo.jpg -map_metadata -1 -q:v 75 images/new-photo.webp
ffmpeg -i temp.jpg -map_metadata -1 -vf "scale='if(gt(iw,ih),1000,-2)':'if(gt(iw,ih),-2,1000)'" -q:v 4 images/new-photo-thumb.jpg
ffmpeg -i images/new-photo-thumb.jpg -map_metadata -1 -q:v 72 images/new-photo-thumb.webp
```

Then copy an existing `<button class="shot">` block in the gallery, paste it, and swap
the filenames, the `alt` text, the `data-caption` and the label.

Set `data-cat` to `residential`, `commercial`, `detail`, or any combination separated by
spaces — that's what the filter buttons read.

> The original `.heic` files are excluded from the repository (see `.gitignore`), since
> browsers can't display them and they add ~25 MB. Keep them backed up locally; they're
> the source if photos ever need re-exporting.

---

## The estimate form

**Current behavior:** submitting opens the visitor's email app with every field already
filled in, ready to send. This requires no account and no server, and works well on
phones. The trade-off is that a desktop visitor with no mail app configured may see
nothing happen — which is why the phone number is the most prominent element on the page.

**To receive submissions as email automatically instead:**

1. Create a form at [formspree.io](https://formspree.io) (the free tier is sufficient)
   pointed at `specfloorsnick@gmail.com`.
2. Copy the endpoint URL it provides.
3. In `js/main.js`, find `var FORM_ENDPOINT = '';` near the top and paste it in:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
```

That is the only change required. The form switches to background submission with a
thank-you message and no longer opens a mail app.

---

## If the domain changes

The custom domain is configured in two places: the `CNAME` file in the repository root
(GitHub writes this when you set the domain under Settings → Pages) and the absolute
URLs in the site itself.

Update all of these so search engines and link previews stay correct:

1. `index.html` — `<link rel="canonical">`
2. `index.html` — `og:url` and `og:image` (both must be full absolute URLs)
3. `index.html` — `url` and `image` in the JSON-LD block
4. `robots.txt` — the `Sitemap:` line
5. `sitemap.xml` — the `<loc>` value


---

## Google reviews

The site links to the Google Business Profile in three places, all using the same
permanent **Place ID**, `ChIJO4Z94ctuo0MRbY37IiBksy0`:

| Where | Link |
| --- | --- |
| "Write a Google Review" band above the footer, and the footer link | `https://search.google.com/local/writereview?placeid=<ID>` |
| "Read All Reviews on Google" under the review cards | `https://www.google.com/maps/place/?q=place_id:<ID>` |

That write-review link is also the one to text customers after a job. Don't replace it
with a URL copied out of the browser address bar after searching Google — those carry
session tokens (`sca_esv`, `gs_lp`) and go stale. The Place ID only changes if the
Business Profile is deleted and recreated.

**Adding a new review** — copy an existing `<figure class="review">` block in the
`#reviews` section and fill in the quote, name, and the "26 reviews" / "Local Guide"
line under the name. Transcribe the review **verbatim**, typos included; don't tidy up a
customer's wording.

The grid is three columns wide and the longest review carries an extra
`review--feature` class that makes it span two of them. That is what keeps five cards
filling two full rows. If the number of reviews changes, move or drop that class so the
last row doesn't end up with an awkward gap:

- 4 or 7 reviews — no feature card
- 5 or 8 reviews — one feature card
- 6 or 9 reviews — no feature card

**Why there is no star-rating markup** — Google's structured-data guidelines forbid a
site from marking up reviews collected on another platform as its own `Review` or
`AggregateRating`. It earns no stars in search results and risks a manual penalty, so
the cards are deliberately plain HTML.

**Why the reviews aren't pulled in automatically** — Google's Places API returns at most
five reviews and picks which five itself, and it needs an API key plus a billing
account. Hand-written cards let Nick choose which reviews appear, cost nothing, and add
no third-party script to the page.

---

## Content notes

A few deliberate decisions worth knowing before editing:

- **There are no customer reviews on the site.** None were invented. Once a few real
  ones exist (Google reviews carry the most weight), they are worth adding — between
  "Our Work" and "About Nick" is the natural placement.
- **"VCT & Carpet Tile"** — carpet tile is listed because it appears on the company
  business card, though it isn't a hard surface. If it's no longer offered, delete that
  single `<article class="card">` block.
- **Insurance** is described as "fully insured" with a certificate available on request.
  No license or certification numbers appear, as none were provided.
- **Business hours and a street address are intentionally absent.** Adding hours would
  help local search rankings; the `HomeAndConstructionBusiness` block near the top of
  `index.html` is where Google reads that structured data.
