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
7. **Homepage polish-ronde 1** (commit `6fcafa9`):
   - `scroll-padding-top` op `html` → ankerlinks (#tool/#diensten) verdwijnen niet meer onder de vaste nav.
   - Nav-elevatie: `.main-nav.scrolled` krijgt schaduw bij scrollen (toggle in `js/main.js`).
   - `font-variant-numeric: tabular-nums` op tellende cijfers → geen breedte-jitter tijdens count-up.
   - Reduced-motion fix: `animateCount` in `js/home.js` zet meteen de eindwaarde bij `prefers-reduced-motion`.
8. **Homepage polish-ronde 2** (commit `09374cf`):
   - **Scroll-voortgangsbalk** (`.scroll-progress`, 3px oranje) bovenaan, opgebouwd in `js/main.js` → werkt op alle pagina's.
     (Klassieke nav-scroll-spy kon niet: de nav linkt naar aparte pagina's, niet naar secties.)
   - **Focus-management** in de keuzetool: `showStep()` zet focus (`preventScroll`) op de nieuwe vraag/het resultaat.
   - **Hero-microcopy**: geruststellingsregel onder de knoppen ("✓ Gratis & vrijblijvend · resultaat in 1 minuut").
     Koppen/knoplabels bewust NIET aangepast (merkstem) — openstaand of de gebruiker dat alsnog wil.

## Bekende beperkingen van de web-sandbox
- **Geen browser** om live te renderen; alles is statisch geverifieerd (JS-syntax, accolades, logica).
  Visuele check doet de gebruiker op **mrhostly.nl** na deploy.
- Lucide-CDN niet altijd bereikbaar in de sandbox (werkt wel op productie).

## Magic MCP — STATUS: geconfigureerd, wacht op sessie-herstart
- ✅ **Netwerk is nu open**: `magic.21st.dev` geeft een echt HTTP-antwoord (geen "Host not in allowlist" meer).
- ✅ **Server geconfigureerd** op user scope in `/root/.claude.json` en **verbindt** (`claude mcp list` → magic ✓ Connected).
  Toegevoegd met: `claude mcp add magic --scope user --env API_KEY="<key>" -- npx -y @21st-dev/magic@latest`
- ⚠️ **Maar**: midden in een sessie toegevoegd → de `mcp__magic__*` tools laden pas bij **sessie-start**.
  **Actie voor de nieuwe sessie:** Magic is dan automatisch geladen; check met ToolSearch `+magic` of de tools er zijn.
- ⚠️ Magic levert **React + Tailwind**; deze site is vanilla → output met de hand porten.
- Optioneel: `api.svgl.app` voor logo-search.

## Openstaande TODO's / ideeën
- [ ] Magic MCP echt inzetten (na herstart de `mcp__magic__*` tools gebruiken voor nieuwe componenten).
- [ ] Hero koppen/knoplabels eventueel aanscherpen (merkstem — alleen op verzoek gebruiker).
- [ ] **Ontbrekende pagina's** bouwen — nav/footer linken ernaar maar ze bestaan niet (404):
      `websites.html`, `chatbots.html`, `reserveringen.html`, `over-ons.html`, `blog.html`, `contact.html`.
- [ ] **SEO/social meta**: Open Graph/Twitter-tags, favicon, canonical, JSON-LD bedrijfsschema.
- [ ] Eventueel hero-kalender timing/dagcel verder tunen.

## Werkafspraken
- Ontwikkel op branch `claude/gracious-goodall-NZXci`, commit + push per afgeronde stap.
- Maak GEEN PR tenzij expliciet gevraagd (PR #1 bestaat al).
- Communicatie met de gebruiker in het **Nederlands**.
