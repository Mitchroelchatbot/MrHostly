# Mr Hostly — Handoff / sessie-context

> Doel van dit bestand: de context van de vorige Claude Code-sessie meenemen naar
> een nieuwe sessie. Lees dit eerst (`lees HANDOFF.md`) voordat je verdergaat.

## Project
- **Statische site** (geen build/framework): `index.html` + `css/style.css` + `css/home.css` + `js/` (`main.js`, `home.js`, `icons.js`).
- Iconen via Lucide (CDN, gepind op `1.17.0`) + eigen `icons.js` die `data-icon` omzet naar SVG.
- Deploy via Vercel (`vercel.json`, `cleanUrls`).
- **Branch:** `claude/gracious-goodall-NZXci` — alle werk staat hier + in **PR #1**.

## Huisstijl (tokens in `css/style.css` :root)
- Navy `#1B2D5E` (`--navy`), navy-deep `#142348`, oranje `#E8A030` (`--orange`), oranje-deep `#C8851A`.
- Cream `#FAF7F0`, off-white `#F9F8F4`, wit, muted `#6B7280`.
- Fonts: **Geist** (titels, `--font-display`), **Inter Tight** (body, `--font-body`).

## Designrichting (BELANGRIJK — vastgesteld met de gebruiker)
- **Warme stijl met afwisseling licht↔donker** (Linear/Stripe-gevoel), NIET volledig donker.
  Een volledig donkere variant is geprobeerd en **bewust teruggedraaid** — te zwaar.
- Huidige pagina-flow (geen twee donkere secties naast elkaar):
  hero (licht/off-white) → tool (navy donker) → diensten (wit) → stats (cream) →
  doelgroep (wit) → aanpak (cream) → over-ons (wit) → cta (oranje) → footer (navy).
- Hero = licht: off-white achtergrond, navy titel/slogan, oranje accenten, subtiele glow-cirkels.
- De lichte "floating" showcase-kaarten (`.sc-*`) en tool-mockups blijven bewust licht.
- De `.cta-band` blijft fel oranje (enige warme climax vóór de footer).

## Wat al gedaan is (chronologisch)
1. **ui-ux-pro-max skill** geïnstalleerd in `.claude/skills/ui-ux-pro-max/` (zelfstandig, MIT).
2. **Performance + a11y**: Lucide gepind + `defer` + preconnect; `:focus-visible` states;
   `prefers-reduced-motion` gerespecteerd (CSS + JS-animaties geguard).
3. **Chatbot layout-shift fix**: `.sc-chat-body` vaste `height: 192px` (mobiel ≤480px: 240px),
   `justify-content: flex-end`, `overflow: hidden`. NIET terugdraaien.
4. **Donkere conversie**: geprobeerd en **teruggedraaid** (revert) — zie hierboven.
5. **Wow — hero live-demo**: `js/home.js` sectie 1 is een gechoreografeerde loop:
   chat → "Geboekt! ✓" → reservering popt in kalender (`#heroCalSlot` dag 6) →
   teller `#heroCalCount` 24→25 → `.sc-float-1` pulseert. ~8s loop, statische
   eindstaat onder reduced-motion. CSS in "WOW"-blok onderaan `css/home.css`.
6. **Tool polish**: vloeiendere stap-/context-overgangen (expo-out easing),
   gloed-ring op geselecteerde optie, verfijnde resultaat-reveal.

## Bekende beperkingen van de web-sandbox
- **Geen browser** om live te renderen; alles is statisch geverifieerd (JS-syntax, accolades, logica).
  Visuele check doet de gebruiker op **mrhostly.nl** na deploy.
- **Netwerk-allowlist** blokkeert externe hosts. Daardoor:
  - Lucide-CDN niet bereikbaar in de sandbox (werkt wel op productie).
  - **Magic MCP (21st.dev) geblokkeerd** — fout "Host not in allowlist".

## Magic MCP gebruiken (openstaand)
- Server is toegevoegd (user scope) met API-key; tools: `mcp__magic__*`.
- Vereist dat de **network policy** van de omgeving deze hosts toestaat:
  - `magic.21st.dev` (verplicht), `api.svgl.app` (voor logo-search, optioneel).
- Policy aanpassen → **nieuwe sessie starten** (policy wordt bij containerstart vastgezet).
- Let op: Magic levert **React + Tailwind**; deze site is vanilla → output met de hand porten.

## Openstaande TODO's / ideeën
- [ ] Magic MCP echt inzetten zodra `magic.21st.dev` ge-allowlist is.
- [ ] **Ontbrekende pagina's** bouwen — nav/footer linken ernaar maar ze bestaan niet (404):
      `websites.html`, `chatbots.html`, `reserveringen.html`, `over-ons.html`, `blog.html`, `contact.html`.
- [ ] **SEO/social meta**: Open Graph/Twitter-tags, favicon, canonical, JSON-LD bedrijfsschema.
- [ ] Eventueel hero-kalender timing/dagcel verder tunen.

## Werkafspraken
- Ontwikkel op branch `claude/gracious-goodall-NZXci`, commit + push per afgeronde stap.
- Maak GEEN PR tenzij expliciet gevraagd (PR #1 bestaat al).
- Communicatie met de gebruiker in het **Nederlands**.
