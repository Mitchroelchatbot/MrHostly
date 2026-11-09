# Mr Hostly — Handoff voor een nieuwe Claude Code-sessie

> Lees dit eerst. Bijgewerkt op 9 november 2026, na commit `4de03d9`.
> Dit bestand vervangt de oude handoff (die ging nog over Vercel, oude kleuren en oude fonts).

## In één alinea
Mr Hostly (Eindhoven) is een digitale technologiepartner voor **horeca & leisure**:
websites, SEO & GEO, AI-chatbots, automatiseringen en maatwerk. De site is **statische
HTML/CSS/JS zonder build-stap**, gehost op **Netlify** (deploy vanaf `main`), te zien op
mrhostly.netlify.app en mrhostly.nl. Eigenaar en gezicht: **Mitch**.

## Repo, branches en livegang
- Repo: `Mitchroelchatbot/MrHostly`. Werkbranch: `claude/amazing-mendel-gGYDm`.
- Netlify publiceert de repo-root (`netlify.toml`: `publish = "."`, geen build).
  `vercel.json` is een overblijfsel, Vercel wordt niet meer gebruikt.
- Werkwijze die tot nu toe is gebruikt: committen op de werkbranch, pushen, en daarna
  `main` fast-forwarden zodat Netlify live zet:
  ```
  git push origin claude/amazing-mendel-gGYDm
  git fetch origin main && git checkout main && git reset --hard origin/main \
    && git merge --ff-only claude/amazing-mendel-gGYDm && git push origin main
  git checkout claude/amazing-mendel-gGYDm
  ```
- **Vraag bij twijfel eerst of iets live mag.** Bij de tools-opdracht gold expliciet:
  "commit en deploy niet zonder het eerst te vragen". Daarna zei Mitch steeds
  "commit en zet live".
- De Netlify-connector moet opnieuw geautoriseerd worden (claude.ai → connectors).
  Zonder die koppeling kun je de deploy-status niet controleren; de live site is vanuit
  de cloudomgeving ook niet bereikbaar met curl.

## Harde inhoudsregels (van Mitch)
- **0641806311 / `https://wa.me/31641806311` is alleen voor WhatsApp**, niet om te bellen.
  Schrijf dus nooit "bel ons" bij dat nummer.
- Geen "25 jaar"-claim. **Roel** komt nergens voor. **Café Costa** wordt niet bij naam
  genoemd (de case heet "een feestcafé in Eindhoven").
- Geen verzonnen cijfers, reviews of claims. Mitch' verhaal staat alleen op **Over ons**.
- Eén hoofd-CTA: **"Plan een gratis kennismaking"** (→ `/contact`), plus WhatsApp als tweede.
- Teksten in het Nederlands, je-vorm, kort en direct.

## Bedrijfsgegevens
- E-mail: info@mrhostly.nl · KvK **42068995** (staat in de footer en in het schema op de homepage).
- **Btw-id: nog niet geplaatst.** Mitch stuurde `nl005470895l`; dat is onvolledig
  (formaat is `NL` + 9 cijfers + `B` + 2 cijfers). Eerst laten bevestigen, dan in de footer
  achter het KvK-nummer zetten: `© 2026 Mr Hostly · KvK 42068995 · btw NL…B..`.
- Instagram: https://www.instagram.com/mr.hostly/ (enige social in de footer; LinkedIn en
  Facebook bewust weggehaald).
- Formspree-formulier: `https://formspree.io/f/mljdnopg` (contactpagina en de tools).

## Opbouw van de site
| Pad | Wat |
|---|---|
| `/` (`index.html`) | Homepage: foto-hero, 3 diensten, "wat we kunnen", stappen, case, stats, ROI-calculator, zelfbeheer, FAQ, CTA |
| `/online-aanwezigheid`, `/ai-automatisering`, `/maatwerk` | De drie categoriepagina's |
| `/over-ons` | Mitch' verhaal + case |
| `/contact` | Formspree-formulier (`js/contact.js`) + WhatsApp |
| `/blog` + `/blog-<slug>` | 11 artikelen (zie Blog) |
| `/tools/`, `/tools/ai-label-checker/`, `/tools/noshow-calculator/` | Gratis tools (zie Tools) |
| `/template` | Sjabloonpagina, nog publiek bereikbaar (eventueel verbergen) |

- **Schone URL's**: `netlify.toml` stuurt elke `/pagina.html` met een 301 door naar `/pagina`.
  Voeg bij een nieuwe pagina ook zo'n redirect toe. Interne links zijn root-relatief
  (`/contact`); assets op rootpagina's relatief (`css/…`), in `/tools/` absoluut (`/css/…`).
- **Nav en footer** staan als vaste HTML op elke pagina (geen includes). Wijzig je ze,
  doe dat dan in álle `*.html` én `tools/**/index.html` (een Python-replace werkt goed).
  Nav: Online aanwezigheid · AI & automatisering · Maatwerk · Over ons · Blog · Gratis tools · Contact.
- **CSS**: `css/style.css` (tokens, nav, footer, knoppen), `css/home.css` (homepage, ook geladen
  op subpagina's), `css/pages.css` (subpagina's, blog, artikel-layout), `css/tools.css` (tools).
  Tokens: navy `#0F2044`, navy-deep `#0A1730`, oranje `#E8953A`, oranje-deep `#C87A1E`,
  cream `#F8F7F4`; font Plus Jakarta Sans.
- **JS**: `js/main.js` (nav/hamburger), `js/pages.js` (Lenis, GSAP-reveal, actieve navlink,
  cursor-glow), `js/icons.js` (Lucide via `data-icon`), `js/home.js` (homepage).
  Scriptvolgorde op subpagina's: lucide 1.17.0 → gsap 3.12.5 → ScrollTrigger → lenis 1.1.14
  → icons.js → main.js → pages.js (allemaal `defer`, via unpkg).
- **Favicons**: `favicon.ico/.svg`, `favicon-96x96.png`, `apple-touch-icon.png`,
  `icon-192/512.png`, `site.webmanifest` (oranje H op navy). Links staan in elke `<head>`.

## Blog
- 10 artikelen uit de Drive (map Mr Hostly/Instagram) + het oudere `blog-no-shows`.
  Beelden: `images/blog/blog-<slug>.webp` (Instagram-posts met foto-achtergrond),
  deelbeelden `images/blog/og-<slug>.jpg`. Elk artikel heeft bronnen + JSON-LD BlogPosting.
- **Publicatiedatums**: kaarten in `blog.html` hebben `data-publish="YYYY-MM-DD"`. Een klein
  script onderaan zet toekomstige artikelen onder "Binnenkort" (niet klikbaar). Planning
  liep di/do van 29 sep t/m 29 okt 2026; inmiddels is alles verschenen.

## Tools (lead magnets)
- Bron: twee losse HTML-tools van Mitch (Drive-map `tools/`). Ingepast met site-nav en -footer;
  tool-CSS gescoped onder `.tool-page`. **De tool-scripts zijn bewust ongewijzigd**
  (`metadataText`, `analyse`, rekenformule). Uitzondering: in de checker is daarna het
  **slepen** uitgebreid (hele mappen, melding als er niets bruikbaars binnenkomt).
- Harde grenzen (van Mitch): **nooit** een functie toevoegen die metadata, C2PA of watermerken
  verwijdert of opnieuw encodeert. Wijzig detectie of formule niet zonder de tests opnieuw te
  draaien. Het label "Aanname" bij "50% minder no-shows" blijft staan tot er een echt klantcijfer is.
- Tests die moeten slagen: JPG/PNG/WebP zonder metadata → "Geen AI-signalen"; XMP
  `Iptc4xmpExt:DigitalSourceType` = `trainedAlgorithmicMedia` → "Krijgt AI-label",
  `compositeWithTrainedAlgorithmicMedia` → "Mogelijk label"; calculator met standaard
  150 / 8% / €45 / 20% / 48 weken → **€ 20.736** per jaar.
- Onder beide uitslagen staat een optioneel formulier "Stuur me de uitslag" (Formspree,
  uitslag in verborgen velden). Formspree mailt de bezoeker níét automatisch: Mitch stuurt
  de uitslag zelf (of zet een autoresponder aan bij Formspree).
- Er is **geen analytics** op de site; voeg geen trackingdienst toe zonder te vragen.

## Testen (handig in de cloudomgeving)
- Lokaal serveren: `python3 -m http.server 4430 --bind 127.0.0.1` in de repo; stoppen met
  `pkill -f "http[.]server 44"` (dit patroon, anders sluit je je eigen shell af).
- Screenshots: Playwright staat in `/opt/node22/lib/node_modules/playwright/index.mjs`,
  Chromium in `/opt/pw-browsers/` (niet `playwright install` draaien). Google Fonts is niet
  bereikbaar: haal het font met `npm pack @fontsource/plus-jakarta-sans` en route
  `fonts.googleapis.com` naar de lokale woff2-bestanden.
- Controleer altijd op horizontale overflow bij **375 en 320 px** breed.

## Open punten
1. **Btw-id** bevestigen en in de footer zetten (zie Bedrijfsgegevens).
2. **Foto van Mitch** voor Over ons: `images/mitch.jpg` (staand, min. 800×1000). Nu staat er
   een placeholder (`[NEEDS INPUT]` in `over-ons.html`).
3. **Hero-foto**: Mitch stuurde ooit een nieuwe hero-foto die niet als bestand aankwam; opnieuw vragen.
4. **VakTechLink**-blok linkt naar `https://www.vaktechlink.nl` (adres uit de Drive-bestanden,
   niet live gecontroleerd). Laten bevestigen dat dat klopt.
5. Geen `sitemap.xml` en `robots.txt`; aangeboden, nog geen antwoord.
6. `/template` is publiek bereikbaar; eventueel verwijderen of afschermen.
7. Tip voor Mitch: in Google Search Console `https://mrhostly.nl/` laten herindexeren
   (oude titels en wereldbol-icoon staan nog in Google).
8. Deze `HANDOFF.md` wordt door Netlify mee gepubliceerd (publish = repo-root). Zet er dus
   geen gevoelige gegevens in.
