// ═══════════════════════════════════════════
//   MR HOSTLY — Chatbots: live demo + tijd/klanten-calculator
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const $ = id => document.getElementById(id);

  // ─────────────────────────────────────────
  // 1. LIVE DEMO — gescript, herkent trefwoorden, typewriter-antwoord
  // ─────────────────────────────────────────
  (function botDemo() {
    const body = $('botBody'), form = $('botForm'), input = $('botInput'), suggest = $('botSuggest');
    if (!body || !form) return;

    const SUGGESTIONS = [
      'Zijn jullie op zondag open?',
      'Kan ik een tafel reserveren?',
      'Is er parkeergelegenheid?',
      'Wat kost een chatbot?'
    ];

    const RULES = [
      { k: ['open', 'zondag', 'maandag', 'openingstijd', 'uur', 'tijden'], a: 'We zijn dinsdag t/m zondag open van 12:00 tot 22:00 — op maandag gesloten. 🕒 Zal ik je iets reserveren?' },
      { k: ['reserv', 'tafel', 'boek', 'plek', 'plaats'], a: 'Zeker! Voor hoeveel personen en welke dag wil je reserveren? Ik leg het direct voor je vast.' },
      { k: ['parkeer', 'parking', 'auto'], a: 'Er is gratis parkeren op 2 minuten lopen, en betaald parkeren voor de deur. 🚗' },
      { k: ['menu', 'kaart', 'eten', 'vega', 'vegetar', 'glutenvrij', 'allergie'], a: 'Onze kaart wisselt met de seizoenen, met altijd vegetarische en glutenvrije opties. Wil je \'m doorgestuurd krijgen?' },
      { k: ['hond', 'huisdier'], a: 'Honden zijn van harte welkom op ons terras! 🐕' },
      { k: ['prijs', 'kost', 'tarief', 'chatbot', 'website', 'reserver'], a: 'Een chatbot zoals deze start vanaf €249. Wil je dat iemand van Mr Hostly even contact opneemt over de mogelijkheden?' },
      { k: ['bedankt', 'dank', 'thanks', 'top'], a: 'Graag gedaan! Kan ik je nog ergens mee helpen? 😊' },
      { k: ['contact', 'bellen', 'mail', 'telefoon', 'bereik'], a: 'Je kunt ons bereiken via info@mrhostly.nl — of stel je vraag gewoon hier, dan help ik je meteen.' }
    ];
    const FALLBACK = 'Goede vraag! Een chatbot die op jóuw bedrijf is getraind, geeft hier meteen het juiste antwoord op. Zal ik Mr Hostly vragen contact met je op te nemen?';

    let busy = false;

    function scrollEnd() { body.scrollTop = body.scrollHeight; }
    function addUser(text) {
      const b = document.createElement('div');
      b.className = 'tool-msg user msg-in';
      b.textContent = text;
      body.appendChild(b); scrollEnd();
    }
    function typeInto(el, text, done) {
      if (reduceMotion) { el.textContent = text; scrollEnd(); if (done) done(); return; }
      const txt = document.createTextNode(''), caret = document.createElement('span');
      caret.className = 'tool-caret';
      el.appendChild(txt); el.appendChild(caret);
      const per = Math.max(8, Math.min(22, Math.round(700 / text.length)));
      let i = 0;
      (function step() {
        txt.nodeValue = text.slice(0, ++i); scrollEnd();
        if (i < text.length) setTimeout(step, per);
        else setTimeout(() => { caret.remove(); if (done) done(); }, 300);
      })();
    }
    function addBot(text, done) {
      busy = true;
      if (reduceMotion) {
        const b = document.createElement('div'); b.className = 'tool-msg bot msg-in';
        b.textContent = text; body.appendChild(b); scrollEnd(); busy = false; if (done) done(); return;
      }
      const typing = document.createElement('div');
      typing.className = 'tool-msg bot tool-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing); scrollEnd();
      setTimeout(() => {
        typing.remove();
        const b = document.createElement('div'); b.className = 'tool-msg bot msg-in';
        body.appendChild(b);
        typeInto(b, text, () => { busy = false; if (done) done(); });
      }, 550);
    }
    function answer(q) {
      const low = q.toLowerCase();
      const hit = RULES.find(r => r.k.some(k => low.indexOf(k) !== -1));
      return hit ? hit.a : FALLBACK;
    }
    function send(text) {
      if (busy || !text.trim()) return;
      addUser(text);
      input.value = '';
      setTimeout(() => addBot(answer(text)), 150);
    }

    SUGGESTIONS.forEach(s => {
      const chip = document.createElement('button');
      chip.type = 'button'; chip.className = 'dchat-chip'; chip.textContent = s;
      chip.addEventListener('click', () => send(s));
      suggest.appendChild(chip);
    });

    form.addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });

    addBot('Hoi! Ik ben de demo-assistent van Mr Hostly. Stel gerust een vraag — of tik op een voorbeeld hieronder. 👇');
  })();

  // ─────────────────────────────────────────
  // 2. CALCULATOR — tijd & gemiste klanten
  // ─────────────────────────────────────────
  (function calc() {
    const tabsWrap = $('ccTabs');
    if (!tabsWrap) return;

    const AUTOMATION = 0.65, HOURLY = 25, CAPTURE = 0.5, WEEKS = 4.33;
    const BRANCHES = {
      horeca:  { hours: 12, after: 30, value: 85 },
      retail:  { hours: 8,  after: 20, value: 60 },
      leisure: { hours: 10, after: 25, value: 55 }
    };
    let branch = 'horeca';

    const hours = $('ccHours'), after = $('ccAfter'), value = $('ccValue');
    const hoursOut = $('ccHoursOut'), afterOut = $('ccAfterOut'), valueOut = $('ccValueOut');
    const totalEl = $('ccTotal'), hsEl = $('ccHoursSaved'), capEl = $('ccCaptured');
    const recoName = $('ccRecoName'), recoPrice = $('ccRecoPrice'), payback = $('ccPayback');

    const target = { total: 0, hs: 0, cap: 0 };
    const shown  = { total: 0, hs: 0, cap: 0 };
    let looping = false;
    function paint() {
      totalEl.textContent = eur.format(Math.round(shown.total));
      hsEl.textContent = Math.round(shown.hs) + ' u';
      capEl.textContent = Math.round(shown.cap);
    }
    function loop() {
      let active = false;
      for (const k of ['total', 'hs', 'cap']) {
        const d = target[k] - shown[k];
        if (Math.abs(d) > 0.5) { shown[k] += d * 0.2; active = true; } else { shown[k] = target[k]; }
      }
      paint();
      if (active) requestAnimationFrame(loop); else looping = false;
    }
    function kick() {
      if (reduceMotion) { shown.total = target.total; shown.hs = target.hs; shown.cap = target.cap; paint(); return; }
      if (!looping) { looping = true; requestAnimationFrame(loop); }
      totalEl.classList.remove('pulse'); void totalEl.offsetWidth; totalEl.classList.add('pulse');
    }
    function setFill(el) {
      const mn = +el.min, mx = +el.max, v = +el.value;
      el.style.setProperty('--pct', ((v - mn) / (mx - mn) * 100) + '%');
    }

    function recommend(total) {
      if (total < 300)  return { name: 'Online pakket', price: 'vanaf €249', oneoff: 249, monthly: 0 };
      if (total < 800)  return { name: 'Groei pakket',  price: 'vanaf €249 + €59/mnd', oneoff: 249, monthly: 59 };
      return { name: 'Slim pakket', price: 'vanaf €499 + €129/mnd', oneoff: 499, monthly: 129 };
    }

    function update() {
      const b = BRANCHES[branch];
      const H = +hours.value, Q = +after.value, V = +value.value;
      hoursOut.textContent = H + ' u';
      afterOut.textContent = Q;
      valueOut.textContent = eur.format(V);
      [hours, after, value].forEach(setFill);

      const hoursSaved = H * WEEKS * AUTOMATION;
      const timeValue  = hoursSaved * HOURLY;
      const captured   = Q * WEEKS * CAPTURE;
      const capturedRev = captured * V;
      const total = timeValue + capturedRev;

      target.hs = hoursSaved; target.cap = captured; target.total = total;
      kick();

      const r = recommend(total);
      recoName.textContent = r.name;
      recoPrice.textContent = r.price;
      if (total > 0) {
        if (r.monthly > 0) {
          const ratio = Math.max(1, Math.round(total / r.monthly));
          payback.innerHTML = 'Dat dekt de €' + r.monthly + '/mnd van dit pakket geschat <strong>~' + ratio + '×</strong>.';
        } else {
          const months = Math.max(1, Math.ceil(r.oneoff / total));
          payback.innerHTML = 'Dit pakket verdient zichzelf geschat terug in <strong>~' + months + ' ' + (months === 1 ? 'maand' : 'maanden') + '</strong>.';
        }
      } else { payback.textContent = ''; }
    }

    [hours, after, value].forEach(el => el.addEventListener('input', update));
    tabsWrap.querySelectorAll('.calc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        branch = tab.dataset.branch;
        tabsWrap.querySelectorAll('.calc-tab').forEach(t => {
          const on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        const b = BRANCHES[branch];
        hours.value = b.hours; after.value = b.after; value.value = b.value;
        update();
      });
    });
    update();
  })();
});
