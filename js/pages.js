// ═══════════════════════════════════════════
//   MR HOSTLY — Binnenpagina's
//   Actieve nav-link + scroll-reveal + cursor-glow.
//   (Homepage gebruikt home.js; subpagina's gebruiken dit bestand.)
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Actieve nav-link automatisch op basis van de huidige pagina ──
  // Zo blijft het nav-blok byte-identiek op elke pagina (geen handmatige active).
  const current = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    // De Contact-knop (nav-cta/mob-cta) blijft altijd zijn knop-stijl houden
    if (a.classList.contains('nav-cta') || a.classList.contains('mob-cta')) return;
    const href = (a.getAttribute('href') || '').split('/').pop().replace(/\.html$/, '');
    if (href && href === current) a.classList.add('active');
  });

  // ── Scroll-reveal (zelfde gedrag als op de homepage) ──
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // ── Cursor-glow op donkere zones (page-hero of expliciet [data-glow]) ──
  if (!reduceMotion) {
    const zones = document.querySelectorAll('.page-hero, [data-glow]');
    if (zones.length) {
      const glow = document.createElement('div');
      glow.className = 'cursor-glow';
      document.body.appendChild(glow);

      let gx = 0, gy = 0, cx = 0, cy = 0, active = false;
      document.addEventListener('mousemove', (e) => {
        gx = e.clientX; gy = e.clientY;
        let over = false;
        zones.forEach(z => {
          const r = z.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) over = true;
        });
        if (over && !active) { glow.classList.add('visible'); active = true; }
        else if (!over && active) { glow.classList.remove('visible'); active = false; }
      });

      (function loop() {
        cx += (gx - cx) * 0.15;
        cy += (gy - cy) * 0.15;
        glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      })();
    }
  }

});
