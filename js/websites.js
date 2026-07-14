// ═══════════════════════════════════════════
//   MR HOSTLY — Websites: "Wat kost een gemiste online klant?"
//   Branche-gesplitst, conservatief op branchegemiddelden.
//   Formule: gemiste klanten = zoekers × afhaak% × conversiefactor
//            gemiste omzet   = gemiste klanten × besteding
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const tabsWrap = document.getElementById('wcTabs');
  if (!tabsWrap) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const $ = id => document.getElementById(id);

  // Conservatieve conversiefactor per branche (deel van de afhakers dat klant was geworden)
  const BRANCHES = {
    horeca:  { conv: 0.18, search: 600, drop: 35, spend: 45 },
    retail:  { conv: 0.16, search: 800, drop: 30, spend: 60 },
    leisure: { conv: 0.20, search: 400, drop: 30, spend: 40 }
  };
  let branch = 'horeca';

  const search = $('wcSearch'), drop = $('wcDrop'), spend = $('wcSpend');
  const searchOut = $('wcSearchOut'), dropOut = $('wcDropOut'), spendOut = $('wcSpendOut');
  const revEl = $('wcRevenue'), custEl = $('wcCust'), yearEl = $('wcYear');
  const recoName = $('wcRecoName'), recoPrice = $('wcRecoPrice'), payback = $('wcPayback');

  // Soepel tellende getallen
  const target = { rev: 0, cust: 0, year: 0 };
  const shown  = { rev: 0, cust: 0, year: 0 };
  let looping = false;
  function paint() {
    revEl.textContent  = eur.format(Math.round(shown.rev));
    custEl.textContent = Math.round(shown.cust);
    yearEl.textContent = eur.format(Math.round(shown.year));
  }
  function loop() {
    let active = false;
    for (const k of ['rev', 'cust', 'year']) {
      const d = target[k] - shown[k];
      if (Math.abs(d) > 0.5) { shown[k] += d * 0.2; active = true; } else { shown[k] = target[k]; }
    }
    paint();
    if (active) requestAnimationFrame(loop); else looping = false;
  }
  function kick() {
    if (reduceMotion) { shown.rev = target.rev; shown.cust = target.cust; shown.year = target.year; paint(); return; }
    if (!looping) { looping = true; requestAnimationFrame(loop); }
    revEl.classList.remove('pulse'); void revEl.offsetWidth; revEl.classList.add('pulse');
  }

  function setFill(el) {
    const mn = +el.min, mx = +el.max, v = +el.value;
    el.style.setProperty('--pct', ((v - mn) / (mx - mn) * 100) + '%');
  }

  function recommend(monthlyRevenue) {
    // Koppel verlies aan een passend website-pakket
    if (monthlyRevenue < 900) return { name: 'Simpel', price: '€695 + €50/mnd', cost: 695 };
    return { name: 'Maatwerk', price: 'vanaf €1.295 + €50/mnd', cost: 1295 };
  }

  function update() {
    const b = BRANCHES[branch];
    const S = +search.value, D = +drop.value, V = +spend.value;
    searchOut.textContent = S;
    dropOut.textContent   = D + '%';
    spendOut.textContent  = eur.format(V);
    [search, drop, spend].forEach(setFill);

    const lostCust = S * (D / 100) * b.conv;
    const lostRev  = lostCust * V;
    target.cust = lostCust;
    target.rev  = lostRev;
    target.year = lostRev * 12;
    kick();

    const r = recommend(lostRev);
    recoName.textContent  = r.name;
    recoPrice.textContent = r.price;
    if (lostRev > 0) {
      const months = Math.max(1, Math.ceil(r.cost / lostRev));
      payback.innerHTML = 'Een ' + r.name + ' verdient zichzelf dan geschat terug in <strong>~' + months + ' ' + (months === 1 ? 'maand' : 'maanden') + '</strong>.';
    } else {
      payback.textContent = '';
    }
  }

  [search, drop, spend].forEach(el => el.addEventListener('input', update));

  // Branche-tabs: zet defaults en herbereken
  tabsWrap.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      branch = tab.dataset.branch;
      tabsWrap.querySelectorAll('.calc-tab').forEach(t => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      const b = BRANCHES[branch];
      search.value = b.search; drop.value = b.drop; spend.value = b.spend;
      update();
    });
  });

  update();
});
