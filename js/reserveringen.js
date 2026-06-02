// ═══════════════════════════════════════════
//   MR HOSTLY — Reserveringen: live demo + no-show calculator
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const $ = id => document.getElementById(id);

  // ─────────────────────────────────────────
  // 1. LIVE DEMO — gesimuleerd mini-reserveringssysteem
  // ─────────────────────────────────────────
  (function resvDemo() {
    const formEl = $('resvForm'), doneEl = $('resvDone'), confirmBtn = $('resvConfirm');
    if (!formEl) return;

    const DAYS = ['Vrijdag', 'Zaterdag', 'Zondag'];
    const TIMES = ['17:30', '18:30', '19:00', '20:00', '20:30'];
    const PEOPLE = ['2', '3', '4', '5', '6+'];
    const sel = { day: null, time: null, people: null };

    function buildRow(wrap, items, key) {
      items.forEach(val => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'resv-opt'; b.textContent = val;
        b.addEventListener('click', () => {
          sel[key] = val;
          wrap.querySelectorAll('.resv-opt').forEach(o => o.classList.toggle('sel', o === b));
          confirmBtn.disabled = !(sel.day && sel.time && sel.people);
        });
        wrap.appendChild(b);
      });
    }
    buildRow($('resvDays'), DAYS, 'day');
    buildRow($('resvTimes'), TIMES, 'time');
    buildRow($('resvPeople'), PEOPLE, 'people');

    confirmBtn.addEventListener('click', () => {
      const ppl = sel.people === '6+' ? '6 of meer' : sel.people;
      doneEl.innerHTML =
        '<div class="resv-confirm">' +
          '<div class="ic" data-icon="check-circle"></div>' +
          '<h4>Reservering bevestigd!</h4>' +
          '<p>We zien je graag op <span class="resv-detail">' + sel.day + ' om ' + sel.time + '</span>, ' +
          'voor <span class="resv-detail">' + ppl + ' personen</span>.<br>Je krijgt een bevestiging en een herinnering per mail.</p>' +
          '<button type="button" class="resv-reset" id="resvReset">Nog een reservering proberen</button>' +
        '</div>';
      formEl.hidden = true;
      doneEl.hidden = false;
      if (window.lucide && doneEl.querySelector('[data-icon]')) {
        // laat icons.js de nieuwe icon tekenen
        doneEl.querySelectorAll('[data-icon]').forEach(el => { el.dataset.iconDone = ''; });
      }
      // herteken icoon
      retryIcons(doneEl);
      const reset = $('resvReset');
      if (reset) reset.addEventListener('click', () => {
        sel.day = sel.time = sel.people = null;
        formEl.querySelectorAll('.resv-opt').forEach(o => o.classList.remove('sel'));
        confirmBtn.disabled = true;
        doneEl.hidden = true; doneEl.innerHTML = '';
        formEl.hidden = false;
      });
    });

    function retryIcons(root) {
      if (!window.lucide || !window.lucide.icons) { setTimeout(() => retryIcons(root), 80); return; }
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
          el.appendChild(svg); el.dataset.iconDone = '1';
        } catch (e) {}
      });
    }
  })();

  // ─────────────────────────────────────────
  // 2. NO-SHOW CALCULATOR
  // ─────────────────────────────────────────
  (function calc() {
    const tabsWrap = $('rcTabs');
    if (!tabsWrap) return;

    const WEEKS = 4.33, REMINDER_CUT = 0.30;
    const BRANCHES = {
      horeca:  { resv: 80, noshow: 12, spend: 45, label: 'Reserveringen per week' },
      retail:  { resv: 40, noshow: 15, spend: 60, label: 'Afspraken per week' },
      leisure: { resv: 60, noshow: 12, spend: 40, label: 'Boekingen of lessen per week' }
    };
    let branch = 'horeca';

    const resv = $('rcResv'), noshow = $('rcNoshow'), spend = $('rcSpend');
    const resvOut = $('rcResvOut'), noshowOut = $('rcNoshowOut'), spendOut = $('rcSpendOut');
    const resvLabel = $('rcResvLabel');
    const recoveredEl = $('rcRecovered'), lossEl = $('rcLoss'), yearEl = $('rcYear');
    const recoName = $('rcRecoName'), recoPrice = $('rcRecoPrice'), payback = $('rcPayback');

    const target = { rec: 0, loss: 0, year: 0 };
    const shown  = { rec: 0, loss: 0, year: 0 };
    let looping = false;
    function paint() {
      recoveredEl.textContent = eur.format(Math.round(shown.rec));
      lossEl.textContent = eur.format(Math.round(shown.loss));
      yearEl.textContent = eur.format(Math.round(shown.year));
    }
    function loop() {
      let active = false;
      for (const k of ['rec', 'loss', 'year']) {
        const d = target[k] - shown[k];
        if (Math.abs(d) > 0.5) { shown[k] += d * 0.2; active = true; } else { shown[k] = target[k]; }
      }
      paint();
      if (active) requestAnimationFrame(loop); else looping = false;
    }
    function kick() {
      if (reduceMotion) { shown.rec = target.rec; shown.loss = target.loss; shown.year = target.year; paint(); return; }
      if (!looping) { looping = true; requestAnimationFrame(loop); }
      recoveredEl.classList.remove('pulse'); void recoveredEl.offsetWidth; recoveredEl.classList.add('pulse');
    }
    function setFill(el) {
      const mn = +el.min, mx = +el.max, v = +el.value;
      el.style.setProperty('--pct', ((v - mn) / (mx - mn) * 100) + '%');
    }

    function recommend(loss) {
      if (loss < 400)  return { name: 'Online pakket', price: 'vanaf €299 + €39/mnd', monthly: 39 };
      if (loss < 1200) return { name: 'Groei pakket',  price: 'vanaf €499 + €79/mnd', monthly: 79 };
      return { name: 'Slim pakket', price: 'vanaf €999 + €149/mnd', monthly: 149 };
    }

    function update() {
      const R = +resv.value, N = +noshow.value, S = +spend.value;
      resvOut.textContent = R;
      noshowOut.textContent = N + '%';
      spendOut.textContent = eur.format(S);
      [resv, noshow, spend].forEach(setFill);

      const lossMonth = R * WEEKS * (N / 100) * S;
      const recovered = lossMonth * REMINDER_CUT;
      target.loss = lossMonth;
      target.rec  = recovered;
      target.year = recovered * 12;
      kick();

      const r = recommend(lossMonth);
      recoName.textContent = r.name;
      recoPrice.textContent = r.price;
      if (recovered > 0) {
        const ratio = Math.max(1, Math.round(recovered / r.monthly));
        payback.innerHTML = 'Dat is geschat <strong>~' + ratio + '×</strong> de €' + r.monthly + '/mnd van dit pakket.';
      } else { payback.textContent = ''; }
    }

    [resv, noshow, spend].forEach(el => el.addEventListener('input', update));
    tabsWrap.querySelectorAll('.calc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        branch = tab.dataset.branch;
        tabsWrap.querySelectorAll('.calc-tab').forEach(t => {
          const on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        const b = BRANCHES[branch];
        resv.value = b.resv; noshow.value = b.noshow; spend.value = b.spend;
        if (resvLabel) resvLabel.textContent = b.label;
        update();
      });
    });
    update();
  })();
});
