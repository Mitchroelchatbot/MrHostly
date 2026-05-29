// ═══════════════════════════════════════════
//   MR HOSTLY — Icon renderer
//   Zet data-icon="naam" om naar Lucide SVG iconen
// ═══════════════════════════════════════════

(function () {
  function toPascalCase(str) {
    return str
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
  }

  function renderIcons() {
    if (!window.lucide || !window.lucide.icons) {
      // Lucide nog niet geladen — probeer opnieuw
      setTimeout(renderIcons, 80);
      return;
    }

    document.querySelectorAll('[data-icon]').forEach(el => {
      // Voorkom dubbel renderen
      if (el.dataset.iconDone === '1') return;

      const name = el.getAttribute('data-icon');
      const pascal = toPascalCase(name);
      const iconData = window.lucide.icons[pascal];

      if (iconData) {
        try {
          const svg = window.lucide.createElement(iconData);
          // Schaalt mee met font-size van parent
          svg.setAttribute('width', '1em');
          svg.setAttribute('height', '1em');
          svg.style.width = '100%';
          svg.style.height = '100%';
          svg.style.maxWidth = '1.2em';
          svg.style.maxHeight = '1.2em';
          el.appendChild(svg);
          el.dataset.iconDone = '1';
        } catch (e) {
          // stil falen
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderIcons);
  } else {
    renderIcons();
  }
})();
