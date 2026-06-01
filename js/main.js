// MR HOSTLY - Shared JavaScript

document.addEventListener('DOMContentLoaded', () => {

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      navMobile.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Sluit menu bij klik op link
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Nav krijgt een subtiele schaduw zodra de pagina gescrold is
  const nav = document.querySelector('.main-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll-voortgangsbalk bovenaan (oriëntatie / premium gevoel)
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<span></span>';
  document.body.appendChild(bar);
  const fill = bar.firstElementChild;
  const updateProgress = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
    fill.style.transform = 'scaleX(' + p + ')';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

});
