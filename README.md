# TechStratus

Marketing website for **TechStratus** — friendly technology support for families,
seniors, and small businesses in Missoula, Montana.

Plain static site (HTML / CSS / JS). No build step. Hosted on **Cloudflare Pages**,
source on **GitHub**.

## Structure

Multi-page static site. Each page is a standalone `.html` file with the same
header/footer copied in (no build step, so shared markup is duplicated across
files, not templated).

```
.
├── index.html          # Home (full content)
├── personal-technology.html, family-support.html,
│   senior-support.html                              # Personal Technology + subpages
├── business-technology.html, website-design.html, website-care.html,
│   branding.html, social-media.html,
│   cloud-business-systems.html, ai-automation.html,
│   custom-software.html                             # Business Technology + subpages
├── about.html, contact.html, jacob.html             # jacob.html = digital business card (QR code)
├── archive/            # Retired Resources pages (not linked, redirected to home)
├── favicon.ico, sitemap.xml                         # Google favicon + page list (update sitemap when adding pages)
├── css/styles.css      # all styles (brand colors live in :root at the top)
├── js/main.js          # mobile nav, scroll effects, contact form
├── assets/             # logos, hero video/photos
├── _headers            # Cloudflare caching/security headers
└── _redirects          # Old (retired) page URLs -> current pages
```

## Editing & previewing locally

Open `index.html` in a browser, or run a tiny local server (nicer for video/paths):

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploying

Cloudflare Pages is connected to this GitHub repo. **Any push to `main`
automatically publishes the live site** — no manual deploy needed.

Manual deploy (optional, uses the Wrangler CLI):

```bash
npx wrangler pages deploy . --project-name techstratus
```

## To do

See **[PROJECT-PLAN.md](PROJECT-PLAN.md)** — the full site map (which pages are
built vs. still blank) and the running punch list live there now, not here.

## Contact info on the site

- Phone: 406-218-0032
- Email: jacob@techstratus.com
- Location: Missoula, MT

## Contact form

Both forms (`contact.html` and `index.html`) submit to **Web3Forms**
(`https://api.web3forms.com/submit`), which emails each message to the address
the access key was created with. The access key is public by design and lives in
a hidden `access_key` field in both forms. The handler is in `js/main.js`.

**History:** the forms used Formspree until Nov 2026, but its spam filter kept
routing real messages (including Jacob's own tests) to the Spam tab, so no
notification emails were sent. The old Formspree form ID was `mwlejzle`.

**Plan limits:** Web3Forms free tier is 250 submissions/month. To change the
destination address, create a new access key at web3forms.com and replace it in
both forms.

**How the form behaves:**

- Sends in the background; shows a success message without a page reload.
- Clears the form **only after** a successful send.
- If sending fails, shows the phone number and email and **keeps the
  visitor's text** so nothing is lost.
- A hidden honeypot checkbox (`botcheck`) silently discards most spam bots.
- Homepage submissions are subject-tagged "(homepage)" so you can tell
  which page a message came from.
