// ═══════════════════════════════════════════
//   MR HOSTLY — Homepage scripts
//   Tool + hero chatbot + spells
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // Respecteer voorkeur voor minder beweging (toegankelijkheid + performance)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ────────────────────────────────────────
  // 1. HERO SHOWCASE — gechoreografeerde live demo
  //    Chat → reservering verschijnt in de kalender → stat reageert
  // ────────────────────────────────────────
  const heroChatBody = document.getElementById('heroChatBody');
  if (heroChatBody) {
    const heroCalCount = document.getElementById('heroCalCount');
    const heroCalSlot  = document.getElementById('heroCalSlot');
    const heroFloat    = document.querySelector('.sc-float-1');

    const M = {
      greet: { type: 'bot', text: 'Hallo! Hoe kan ik helpen?' },
      q1:    { type: 'usr', text: 'Tafel voor vrijdag?' },
      a1:    { type: 'bot', text: 'Voor hoeveel personen?' },
      q2:    { type: 'usr', text: '4 personen, 19:00' },
      done:  { type: 'bot', text: 'Geboekt! ✓' }
    };
    const TYP = { type: 'typing' };

    // Elke frame = de volledige zichtbare chat op dat moment (typing is tijdelijk)
    const frames = [
      { msgs: [M.greet] },
      { msgs: [M.greet, M.q1] },
      { msgs: [M.greet, M.q1, TYP] },
      { msgs: [M.greet, M.q1, M.a1] },
      { msgs: [M.greet, M.q1, M.a1, M.q2] },
      { msgs: [M.greet, M.q1, M.a1, M.q2, TYP] },
      { msgs: [M.greet, M.q1, M.a1, M.q2, M.done], booked: true }
    ];

    function renderFrame(frame) {
      heroChatBody.innerHTML = '';
      frame.msgs.forEach(m => {
        const el = document.createElement('div');
        if (m.type === 'typing') {
          el.className = 'sc-typing';
          el.innerHTML = '<span></span><span></span><span></span>';
        } else {
          el.className = 'sc-msg ' + m.type;
          el.textContent = m.text;
        }
        heroChatBody.appendChild(el);
      });
    }

    function fireBooking() {
      if (heroCalSlot) heroCalSlot.classList.add('booked');
      if (heroCalCount) {
        heroCalCount.textContent = '25 boekingen';
        heroCalCount.classList.add('bumped');
        setTimeout(() => heroCalCount && heroCalCount.classList.remove('bumped'), 900);
      }
      if (heroFloat) {
        heroFloat.classList.add('react');
        setTimeout(() => heroFloat && heroFloat.classList.remove('react'), 1100);
      }
    }
    function resetBooking() {
      if (heroCalSlot) heroCalSlot.classList.remove('booked');
      if (heroCalCount) heroCalCount.textContent = '24 boekingen';
    }

    if (reduceMotion) {
      // Geen beweging: toon meteen het eindresultaat statisch
      renderFrame(frames[frames.length - 1]);
      fireBooking();
    } else {
      let timers = [];
      const at = (ms, fn) => timers.push(setTimeout(fn, ms));
      function runLoop() {
        timers.forEach(clearTimeout);
        timers = [];
        resetBooking();
        renderFrame(frames[0]);
        let t = 500;
        const step = 1150;
        for (let i = 1; i < frames.length; i++) {
          const f = frames[i];
          at(t, () => {
            renderFrame(f);
            if (f.booked) fireBooking();
          });
          t += step;
        }
        at(t + 2000, runLoop);   // resultaat even tonen, dan opnieuw
      }
      runLoop();
    }
  }

  // ────────────────────────────────────────
  // 2. KEUZETOOL — "Bouw jouw oplossing" (gesprek + live opbouw)
  //    Inhoud (vragen, opties, sector-cijfers, pakketten) identiek aan voorheen.
  // ────────────────────────────────────────
  (function buildSolutionTool() {
    const scroll     = document.getElementById('toolChatScroll');
    const solution   = document.getElementById('toolSolution');
    if (!scroll || !solution) return;

    const backBtn    = document.getElementById('toolBack');
    const restartBtn = document.getElementById('toolRestart');
    const solStatus  = document.getElementById('toolSolStatus');
    const solCta     = document.getElementById('toolSolCta');
    const RM         = reduceMotion;

    // ── Data (1-op-1 dezelfde inhoud) ──
    const packages = {
      laag:   { name: 'Online pakket', price: '€695', extra: 'eenmalig · geen abonnement',
        features: ['Professionele one-pager op maat', 'Mobielvriendelijk & responsive', 'Contactformulier inbegrepen', 'Live in 5-10 werkdagen'] },
      midden: { name: 'Groei pakket', price: '€1.495', extra: '+ vanaf €59/mnd · inclusief hosting',
        features: ['3-6 pagina\'s op maat', 'Hosting & SSL inbegrepen', 'Kleine aanpassingen het hele jaar', '1× per kwartaal frisse blik'] },
      hoog:   { name: 'Slim pakket', price: 'vanaf €2.495', extra: '+ vanaf €99/mnd · volledig maatwerk',
        features: ['Onbeperkt aantal pagina\'s', 'Volledig maatwerk design', 'Uitgebreide SEO + Analytics', 'WhatsApp support'] }
    };

    const questions = [
      null,
      { key: 'sector', bot: 'In welke sector ben je actief?', cols: 2, opts: [
        { v: 'horeca',  icon: 'utensils-crossed',     t: 'Horeca',             d: 'Restaurant, café, hotel' },
        { v: 'retail',  icon: 'store',                 t: 'Retail',             d: 'Winkel, salon, dienst' },
        { v: 'leisure', icon: 'activity',              t: 'Leisure',            d: 'Sport, wellness, vrije tijd' },
        { v: 'anders',  icon: 'briefcase',             t: 'Anders',             d: 'Iets specifiekers' }
      ]},
      { key: 'behoefte', bot: 'Top! Waar kan ik je het beste mee helpen?', cols: 1, opts: [
        { v: 'website',       icon: 'globe',              t: 'Een nieuwe website',     d: 'Mijn online uitstraling kan een upgrade gebruiken' },
        { v: 'chatbot',       icon: 'message-square-text', t: 'Een AI-chatbot',        d: 'Mijn klanten moeten 24/7 antwoord krijgen' },
        { v: 'reserveringen', icon: 'calendar-check',     t: 'Reserveringssysteem',    d: 'Reserveringen automatiseren en stroomlijnen' },
        { v: 'alles',         icon: 'sparkles',           t: 'Eigenlijk alles',        d: 'Ik wil compleet digitaal sterk staan' }
      ]},
      { key: 'budget', bot: 'Helder. En wat is ongeveer je budget?', cols: 1, opts: [
        { v: 'laag',   icon: 'piggy-bank', t: 'Tot €1.000',       d: 'Starten met een goede basis' },
        { v: 'midden', icon: 'wallet',     t: '€1.000 — €3.000',  d: 'Iets professioneels neerzetten' },
        { v: 'hoog',   icon: 'gem',        t: '€3.000+',          d: 'Investeren in kwaliteit en maatwerk' }
      ]}
    ];

    const sectorData = {
      horeca:  { name: 'Horeca', effects: [
        { icon: 'calendar-check', count: 30, prefix: '+', suffix: '%', txt: 'Meer boekingen met online reserveren' },
        { icon: 'bell-ring',      count: 40, prefix: '-', suffix: '%', txt: 'Minder no-shows door herinneringen' } ] },
      retail:  { name: 'Retail', effects: [
        { icon: 'calendar-check', count: 27, prefix: '+', suffix: '%', txt: 'Meer afspraken via je website' },
        { icon: 'search',         count: 81,             suffix: '%', txt: 'Checkt eerst online voor het bezoek' } ] },
      leisure: { name: 'Leisure', effects: [
        { icon: 'refresh-cw',     count: 40, prefix: '+', suffix: '%', txt: 'Meer terugkerende klanten' },
        { icon: 'percent',        count: 0,              suffix: '%', txt: 'Commissie aan derde partijen' } ] },
      anders:  { name: 'Anders', effects: [
        { icon: 'ruler',          count: 100,            suffix: '%', txt: 'Op maat geleverd voor jou' },
        { icon: 'eye',            count: 0,                           txt: 'Verborgen kosten — gewoon helder' } ] }
    };

    const serviceData = {
      website:       { icon: 'globe',               name: 'Nieuwe website',       line: 'Je 24/7 verkoper — strak, mobiel-eerst & SEO-klaar' },
      chatbot:       { icon: 'message-square-text', name: 'AI-chatbot',           line: 'Beantwoordt klantvragen 24/7, getraind op jouw bedrijf' },
      reserveringen: { icon: 'calendar-check',      name: 'Reserveringssysteem',  line: 'Klanten boeken zelf — geen telefoontjes of dubbele boekingen' },
      alles:         { icon: 'sparkles',            name: 'Compleet pakket',      line: 'Website + chatbot + reserveringen, geïntegreerd' }
    };

    // ── State ──
    const answers = {};
    const nodes   = [null, null, null, null];   // per stap: { q, chips, user }
    let answered  = 0;
    let started   = false;
    let busy      = false;
    let finalNode = null;

    const placeholders = {};
    solution.querySelectorAll('.tool-sol-slot').forEach(s => { placeholders[s.dataset.slot] = s.innerHTML; });

    // ── Lucide-iconen voor dynamisch toegevoegde elementen ──
    function paintIcons(root) {
      if (!window.lucide || !window.lucide.icons) { setTimeout(() => paintIcons(root), 100); return; }
      root.querySelectorAll('[data-icon]').forEach(el => {
        if (el.dataset.iconDone === '1') return;
        const name = el.getAttribute('data-icon');
        const pascal = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        const data = window.lucide.icons[pascal];
        if (!data) return;
        try {
          const svg = window.lucide.createElement(data);
          svg.setAttribute('width', '1em'); svg.setAttribute('height', '1em');
          svg.style.width = '100%'; svg.style.height = '100%';
          svg.style.maxWidth = '1.2em'; svg.style.maxHeight = '1.2em';
          el.appendChild(svg); el.dataset.iconDone = '1';
        } catch (e) { /* stil */ }
      });
    }

    // ── Chat-helpers ──
    function scrollToEnd() { scroll.scrollTop = scroll.scrollHeight; }
    function bubble(side, text) {
      const b = document.createElement('div');
      b.className = 'tool-msg ' + side + ' msg-in';
      b.textContent = text;
      return b;
    }
    function addBot(text, cb) {
      busy = true;
      if (RM) {
        const b = bubble('bot', text); scroll.appendChild(b); scrollToEnd();
        busy = false; if (cb) cb(b); return;
      }
      const typing = document.createElement('div');
      typing.className = 'tool-msg bot tool-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      scroll.appendChild(typing); scrollToEnd();
      setTimeout(() => {
        typing.remove();
        const b = bubble('bot', text); scroll.appendChild(b); scrollToEnd();
        busy = false; if (cb) cb(b);
      }, 850);
    }

    function showChips(n) {
      const q = questions[n];
      const wrap = document.createElement('div');
      wrap.className = 'tool-choices' + (q.cols === 2 ? ' cols-2' : '');
      q.opts.forEach((o, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tool-choice';
        btn.style.setProperty('--i', idx);
        btn.innerHTML =
          '<span class="tool-choice-ic" data-icon="' + o.icon + '"></span>' +
          '<span class="tool-choice-tx"><span class="tool-choice-t">' + o.t + '</span>' +
          '<span class="tool-choice-d">' + o.d + '</span></span>';
        btn.addEventListener('click', () => { if (!busy) choose(n, o); });
        wrap.appendChild(btn);
      });
      scroll.appendChild(wrap);
      paintIcons(wrap);
      scrollToEnd();
      const first = wrap.querySelector('.tool-choice');
      if (first) first.focus({ preventScroll: true });
      nodes[n] = nodes[n] || {};
      nodes[n].chips = wrap;
    }

    function ask(n) {
      addBot(questions[n].bot, (qEl) => {
        nodes[n] = nodes[n] || {};
        nodes[n].q = qEl;
        showChips(n);
      });
    }

    function choose(n, o) {
      answers[questions[n].key] = o.v;
      const u = bubble('user', o.t);
      scroll.appendChild(u);
      nodes[n].user = u;
      if (nodes[n].chips) { nodes[n].chips.remove(); nodes[n].chips = null; }
      scrollToEnd();
      answered = n;
      fillSlot(n, o.v);
      updateFoot();
      if (n < 3) { ask(n + 1); } else { finish(); }
    }

    // ── Oplossing-kaart ──
    function slotEl(name) { return solution.querySelector('.tool-sol-slot[data-slot="' + name + '"]'); }
    function fillNode(el, html) {
      el.classList.add('filled');
      el.innerHTML = html;
      paintIcons(el);
      if (!RM) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    }
    function addBar(eff) {
      const num = eff.querySelector('.tool-eff-num');
      if (!num) return;
      const target = parseInt(num.dataset.count, 10) || 0;
      if (target <= 0) return;
      const bar = document.createElement('div');
      bar.className = 'tool-eff-bar'; bar.innerHTML = '<span></span>';
      num.insertAdjacentElement('afterend', bar);
      const pct = Math.max(8, Math.min(100, target));
      const f = bar.firstElementChild; f.style.width = '0%';
      if (RM) { f.style.width = pct + '%'; }
      else { requestAnimationFrame(() => { f.style.width = pct + '%'; }); }
    }
    function fillSlot(n, val) {
      if (n === 1) {
        const d = sectorData[val];
        let h = '<div class="tool-sol-k">Sector</div><div class="tool-sol-v">' + d.name + '</div>';
        h += '<div class="tool-sol-effs">';
        d.effects.forEach(e => {
          h += '<div class="tool-eff">';
          h += '<div class="tool-eff-ic" data-icon="' + e.icon + '"></div>';
          h += '<div class="tool-eff-num" data-count="' + e.count + '"' +
               (e.prefix ? ' data-prefix="' + e.prefix + '"' : '') +
               (e.suffix ? ' data-suffix="' + e.suffix + '"' : '') + '>' +
               (e.prefix || '') + '0' + (e.suffix || '') + '</div>';
          h += '<div class="tool-eff-txt">' + e.txt + '</div>';
          h += '</div>';
        });
        h += '</div>';
        const el = slotEl('sector'); fillNode(el, h);
        el.querySelectorAll('.tool-eff-num').forEach(animateCount);
        el.querySelectorAll('.tool-eff').forEach(addBar);
      } else if (n === 2) {
        const d = serviceData[val];
        let h = '<div class="tool-sol-k">Oplossing</div>';
        h += '<div class="tool-sol-svc"><span class="tool-sol-svc-ic" data-icon="' + d.icon + '"></span>';
        h += '<span class="tool-sol-svc-tx"><span class="tool-sol-v">' + d.name + '</span>';
        h += '<span class="tool-sol-line">' + d.line + '</span></span></div>';
        fillNode(slotEl('service'), h);
      } else if (n === 3) {
        const p = packages[val] || packages.midden;
        let h = '<div class="tool-sol-k">Aanbevolen pakket</div>';
        h += '<div class="tool-sol-pkg-top"><span class="tool-sol-pkg-name">' + p.name + '</span>';
        h += '<span class="tool-sol-pkg-price">' + p.price + '</span></div>';
        h += '<div class="tool-sol-pkg-extra">' + p.extra + '</div>';
        h += '<ul class="tool-sol-pkg-list">';
        p.features.forEach(f => { h += '<li>' + f + '</li>'; });
        h += '</ul>';
        fillNode(slotEl('package'), h);
      }
    }
    function clearSlot(name) {
      const el = slotEl(name);
      el.classList.remove('filled', 'pop');
      el.innerHTML = placeholders[name];
      paintIcons(el);
    }

    function showCta() {
      if (!solCta) return;
      solCta.innerHTML = '<a href="contact.html" class="btn btn-orange btn-arrow btn-prominent">Plan een gratis kennismaking</a>';
      solCta.classList.remove('hidden');
    }
    function hideCta() { if (solCta) { solCta.classList.add('hidden'); solCta.innerHTML = ''; } }

    function finish() {
      addBot('Klaar! Op basis van je antwoorden heb ik hiernaast jouw oplossing samengesteld. 🎉', (el) => {
        finalNode = el;
        if (solStatus) solStatus.textContent = 'Compleet ✓';
        showCta();
        if (!RM) fireConfetti();
      });
    }

    // ── Navigatie ──
    function back() {
      if (busy) return;
      if (answered === 3) {
        hideCta();
        if (solStatus) solStatus.textContent = 'Wordt samengesteld…';
        if (finalNode) { finalNode.remove(); finalNode = null; }
        if (nodes[3] && nodes[3].user) { nodes[3].user.remove(); nodes[3].user = null; }
        clearSlot('package');
        answered = 2;
        showChips(3);
        updateFoot();
        scrollToEnd();
        return;
      }
      if (answered >= 1) {
        const c = answered;
        if (nodes[c + 1]) {
          if (nodes[c + 1].chips) nodes[c + 1].chips.remove();
          if (nodes[c + 1].q) nodes[c + 1].q.remove();
          nodes[c + 1] = null;
        }
        if (nodes[c] && nodes[c].user) { nodes[c].user.remove(); nodes[c].user = null; }
        clearSlot(c === 1 ? 'sector' : c === 2 ? 'service' : 'package');
        delete answers[questions[c].key];
        answered = c - 1;
        showChips(c);
        updateFoot();
        scrollToEnd();
      }
    }

    function restart() {
      if (busy) return;
      scroll.innerHTML = '';
      ['sector', 'service', 'package'].forEach(clearSlot);
      Object.keys(answers).forEach(k => delete answers[k]);
      for (let i = 0; i < nodes.length; i++) nodes[i] = null;
      answered = 0; finalNode = null; started = false;
      hideCta();
      if (solStatus) solStatus.textContent = 'Wordt samengesteld…';
      updateFoot();
      start();
    }

    function updateFoot() {
      const canBack = answered >= 1;
      if (backBtn)    backBtn.classList.toggle('hidden', !canBack);
      if (restartBtn) restartBtn.classList.toggle('hidden', !canBack);
    }

    function start() {
      if (started) return;
      started = true;
      addBot('Hoi! Vertel me kort over je bedrijf, dan stel ik jouw oplossing samen.', () => { ask(1); });
    }

    if (backBtn)    backBtn.addEventListener('click', back);
    if (restartBtn) restartBtn.addEventListener('click', restart);

    // Start het gesprek zodra de tool in beeld komt (of meteen bij reduced-motion)
    if (RM) {
      start();
    } else {
      const anchor = document.getElementById('tool') || solution;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { start(); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(anchor);
    }
  })();

  // ────────────────────────────────────────
  // 2c. ROI / BESPARINGSCALCULATOR
  //     Live euro's & uren; conservatieve branchegemiddelden.
  //     Pakketprijzen uit de site (chatbot vanaf €249, reserveren vanaf €299).
  // ────────────────────────────────────────
  (function roiCalculator() {
    if (!document.getElementById('roi')) return;
    const $ = id => document.getElementById(id);
    const reserv = $('roiReserv'), noshow = $('roiNoshow'), hours = $('roiHours'), spend = $('roiSpend');
    if (!reserv || !noshow || !hours || !spend) return;

    const WEEKS = 4.33, NOSHOW_RED = 0.30, TIME_SAVED = 0.65, HOURLY = 25;
    const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    const elLoss = $('roiLoss'), elRec = $('roiRecovered'), elHrs = $('roiHoursSaved');
    const target = { loss: 0, recovered: 0, hoursSaved: 0 };
    const shown  = { loss: 0, recovered: 0, hoursSaved: 0 };
    let looping = false, first = true;

    function render() {
      elLoss.textContent = eur.format(Math.round(shown.loss));
      elRec.textContent  = eur.format(Math.round(shown.recovered));
      elHrs.textContent  = Math.round(shown.hoursSaved) + ' u';
    }
    function loop() {
      let active = false;
      for (const k of ['loss', 'recovered', 'hoursSaved']) {
        const d = target[k] - shown[k];
        if (Math.abs(d) > 0.5) { shown[k] += d * 0.2; active = true; } else { shown[k] = target[k]; }
      }
      render();
      if (active) requestAnimationFrame(loop); else looping = false;
    }
    function kick() { if (!looping) { looping = true; requestAnimationFrame(loop); } }

    function setFill(el) {
      const mn = +el.min, mx = +el.max, v = +el.value;
      el.style.setProperty('--pct', ((v - mn) / (mx - mn) * 100) + '%');
    }

    function update() {
      const R = +reserv.value, N = +noshow.value, U = +hours.value, S = +spend.value;
      $('roiReservOut').textContent = R;
      $('roiNoshowOut').textContent = N + '%';
      $('roiHoursOut').textContent  = U + ' u';
      $('roiSpendOut').textContent  = eur.format(S);
      [reserv, noshow, hours, spend].forEach(setFill);

      const loss       = Math.round(R * WEEKS * (N / 100) * S);
      const hoursSaved = Math.round(U * TIME_SAVED * WEEKS);
      const recovered  = Math.round(loss * NOSHOW_RED);
      const timeValue  = Math.round(hoursSaved * HOURLY);
      const monthly    = recovered + timeValue;

      target.loss = loss; target.recovered = recovered; target.hoursSaved = hoursSaved;
      $('roiHoursValue').textContent = hoursSaved > 0 ? '≈ ' + eur.format(timeValue) + ' aan tijd' : '';

      // Aanbeveling op basis van de drijvende factoren
      const phoneHigh = U >= 8, noshowHigh = N >= 10;
      let name, sub, price;
      if (phoneHigh && noshowHigh)      { name = 'Chatbot + Reserveringssysteem'; sub = 'vanaf €249 + €299'; price = 249 + 299; }
      else if (phoneHigh)               { name = 'Chatbots & AI';        sub = 'vanaf €249'; price = 249; }
      else if (noshowHigh)              { name = 'Reserveringssysteem';   sub = 'vanaf €299'; price = 299; }
      else if (timeValue >= recovered)  { name = 'Chatbots & AI';        sub = 'vanaf €249'; price = 249; }
      else                              { name = 'Reserveringssysteem';   sub = 'vanaf €299'; price = 299; }
      $('roiRecoName').textContent  = name;
      $('roiRecoPrice').textContent = sub;

      const payEl = $('roiPayback');
      if (monthly <= 0) {
        payEl.innerHTML = 'Stel je situatie in om je terugverdientijd te zien.';
      } else if (monthly >= price) {
        payEl.innerHTML = '<span class="roi-pb-check">✓</span> Verdient zichzelf <strong>al in de eerste maand</strong> terug.';
      } else {
        const m = Math.ceil(price / monthly);
        payEl.innerHTML = '<span class="roi-pb-check">✓</span> Verdient zichzelf terug in <strong>± ' + m + ' ' + (m > 1 ? 'maanden' : 'maand') + '</strong>.';
      }

      if (reduceMotion || first) {
        shown.loss = loss; shown.recovered = recovered; shown.hoursSaved = hoursSaved;
        render(); first = false;
      } else {
        kick();
      }
    }

    function pulse() {
      if (reduceMotion) return;
      elRec.classList.remove('pulse'); void elRec.offsetWidth; elRec.classList.add('pulse');
    }

    [reserv, noshow, hours, spend].forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', pulse);
    });
    update();
  })();

  // ────────────────────────────────────────
  // 3. SPELL 1: Cijfers die meetellen bij scroll
  // ────────────────────────────────────────
  const countElements = document.querySelectorAll('[data-count]');
  const counted = new Set();

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    // Toegankelijkheid: bij minder-beweging meteen de eindwaarde tonen (geen animatie)
    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted.has(entry.target)) {
        counted.add(entry.target);
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.4 });

  countElements.forEach(el => countObserver.observe(el));

  // ────────────────────────────────────────
  // 4. SPELL 2: Hover-tilt op dienst-cards
  // ────────────────────────────────────────
  const tiltCards = reduceMotion ? [] : document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ────────────────────────────────────────
  // 5. SPELL 3: Confetti bij tool-resultaat
  // ────────────────────────────────────────
  function fireConfetti() {
    if (reduceMotion) return;
    const colors = ['#E8A030', '#1B2D5E', '#FFB955', '#2A4080', '#FFF1DD', '#C8851A'];
    const count = 72;
    // Ontstaat vanuit de pakket-slot van de oplossing-kaart (valt terug op de tool-sectie)
    const originEl = document.querySelector('.tool-sol-slot[data-slot="package"]') || document.getElementById('tool');
    if (!originEl) return;
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height * 0.32;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const isCircle = Math.random() < 0.35;
      const size = 7 + Math.random() * 7;
      piece.style.width = size + 'px';
      piece.style.height = (isCircle ? size : size * 1.4) + 'px';
      piece.style.borderRadius = isCircle ? '50%' : '2px';
      piece.style.left = originX + 'px';
      piece.style.top = originY + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.opacity = '1';

      // Waaier voornamelijk omhoog, zwaartekracht trekt daarna omlaag
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
      const power = 120 + Math.random() * 260;
      const tx = Math.cos(angle) * power;
      const ty = Math.sin(angle) * power + (180 + Math.random() * 220);
      const rot = Math.random() * 720 - 360;
      const dur = 1400 + Math.random() * 1100;

      piece.style.transition = `transform ${dur}ms cubic-bezier(0.2, 0.6, 0.35, 1), opacity ${dur}ms ease-out`;

      document.body.appendChild(piece);

      requestAnimationFrame(() => {
        piece.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        piece.style.opacity = '0';
      });

      setTimeout(() => piece.remove(), dur + 100);
    }
  }

  // ────────────────────────────────────────
  // 6. CURSOR-GLOW (volgt muis op donkere secties)
  // ────────────────────────────────────────
  if (!reduceMotion) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  const darkSections = document.querySelectorAll('.tool-section, .over-preview-visual, .cta-band');
  let glowX = 0, glowY = 0, curX = 0, curY = 0, glowActive = false;

  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
    let over = false;
    darkSections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        over = true;
      }
    });
    if (over && !glowActive) { glow.classList.add('visible'); glowActive = true; }
    else if (!over && glowActive) { glow.classList.remove('visible'); glowActive = false; }
  });

  function glowLoop() {
    curX += (glowX - curX) * 0.15;
    curY += (glowY - curY) * 0.15;
    glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(glowLoop);
  }
  glowLoop();
  } // einde cursor-glow (overgeslagen bij reduceMotion)

  // ────────────────────────────────────────
  // 7. SCROLL-REVEAL
  // ────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ────────────────────────────────────────
  // 8. PARALLAX op hero-showcase
  // ────────────────────────────────────────
  const heroShowcase = document.querySelector('.hero-showcase');
  if (heroShowcase && window.innerWidth > 900 && !reduceMotion) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 800) {
        heroShowcase.style.transform = `translateY(${scrolled * 0.06}px)`;
      }
    }, { passive: true });
  }

  // ────────────────────────────────────────
  // 8b. 3D MOUSE-PARALLAX op de showcase
  //     Groeps-rotatie op .sc-stage + translateZ-dieptes per laag.
  //     Subtiel (max 6°), zachte lag via rAF + lerp; geen scroll-listener.
  //     Alleen op desktop met fijne aanwijzer en zonder reduced-motion.
  // ────────────────────────────────────────
  const scStage = document.querySelector('.sc-stage');
  const heroArea = document.querySelector('.hero');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (scStage && heroArea && finePointer && window.innerWidth > 900 && !reduceMotion) {
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    const clamp = v => (v < -1 ? -1 : v > 1 ? 1 : v);

    function frame() {
      cx += (tx - cx) * 0.08;   // lerp → zachte, vloeiende lag
      cy += (ty - cy) * 0.08;
      scStage.style.setProperty('--px', cx.toFixed(4));
      scStage.style.setProperty('--py', cy.toFixed(4));
      if (Math.abs(tx - cx) > 0.0006 || Math.abs(ty - cy) > 0.0006) {
        requestAnimationFrame(frame);
      } else {
        // exact uitlijnen en stoppen → geen onnodige frames
        scStage.style.setProperty('--px', tx.toFixed(4));
        scStage.style.setProperty('--py', ty.toFixed(4));
        running = false;
      }
    }
    function kick() {
      if (!running) { running = true; requestAnimationFrame(frame); }
    }

    heroArea.addEventListener('mousemove', (e) => {
      const r = heroArea.getBoundingClientRect();
      tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
      ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1);
      kick();
    }, { passive: true });

    heroArea.addEventListener('mouseleave', () => { tx = 0; ty = 0; kick(); });
  }

  // ────────────────────────────────────────
  // 9. MAGNETISCHE hoofdknop
  // ────────────────────────────────────────
  const magneticBtns = reduceMotion ? [] : document.querySelectorAll('.btn-prominent');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

});
