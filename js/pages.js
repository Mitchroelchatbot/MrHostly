// ═══════════════════════════════════════════
//   MR HOSTLY — Binnenpagina's
//   Actieve nav-link + scroll-reveal + cursor-glow.
//   (Homepage gebruikt home.js; subpagina's gebruiken dit bestand.)
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Smooth scroll (Lenis) + GSAP-koppeling — parity met de homepage ──
  const hasGSAP  = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (hasLenis && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false
    });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    // Anker-links via Lenis (smooth), met nav-offset
    const navH = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 0;
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      a.addEventListener('click', (e) => { e.preventDefault(); lenis.scrollTo(target, { offset: -(navH + 20) }); });
    });
  }

  // ── Actieve nav-link automatisch op basis van de huidige pagina ──
  // Zo blijft het nav-blok byte-identiek op elke pagina (geen handmatige active).
  const current = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    // De Contact-knop (nav-cta/mob-cta) blijft altijd zijn knop-stijl houden
    if (a.classList.contains('nav-cta') || a.classList.contains('mob-cta')) return;
    const href = (a.getAttribute('href') || '').split('/').pop().replace(/\.html$/, '');
    if (href && href === current) a.classList.add('active');
  });

  // ── Scroll-reveal (GSAP ScrollTrigger met fallback, zoals de homepage) ──
  const revealEls = document.querySelectorAll('.reveal');
  const delayFor = (el) =>
    el.classList.contains('delay-4') ? 0.40 :
    el.classList.contains('delay-3') ? 0.30 :
    el.classList.contains('delay-2') ? 0.20 :
    el.classList.contains('delay-1') ? 0.10 : 0;
  if (hasGSAP && !reduceMotion) {
    document.documentElement.classList.add('gsap-reveals');
    revealEls.forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: delayFor(el), ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  } else if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
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
