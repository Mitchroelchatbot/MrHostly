// MR HOSTLY - Homepage scripts

document.addEventListener('DOMContentLoaded', () => {

  // ── Tabs voor pakketten ──
  const tabs = document.querySelectorAll('.pakket-tab');
  const sliderWraps = {
    websites: document.getElementById('slider-websites'),
    chatbots: document.getElementById('slider-chatbots')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Toggle tab active state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Toggle slider visibility
      Object.keys(sliderWraps).forEach(key => {
        sliderWraps[key].style.display = key === target ? 'block' : 'none';
      });
    });
  });

  // ── Slider functionaliteit ──
  function setupSlider(sliderId, dotsId) {
    const slider = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsId);
    if (!slider || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.slider-dot');
    const cards = slider.querySelectorAll('.pakket-card');

    if (cards.length === 0) return;

    // Update active dot bij scrollen
    slider.addEventListener('scroll', () => {
      const cardWidth = cards[0].offsetWidth + 20; // +gap
      const index = Math.round(slider.scrollLeft / cardWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === Math.min(index, dots.length - 1));
      });
    });

    // Klik op dot scrollt naar kaart
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 20;
        slider.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
      });
    });
  }

  setupSlider('websites-slider', 'dots-websites');
  setupSlider('chatbots-slider', 'dots-chatbots');

  // ── Pijl knoppen ──
  document.querySelectorAll('.slider-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
      const sliderName = arrow.dataset.slider;
      const direction = arrow.dataset.direction;
      const slider = document.getElementById(sliderName + '-slider');
      if (!slider) return;

      const card = slider.querySelector('.pakket-card');
      if (!card) return;

      const scrollAmount = card.offsetWidth + 20;
      slider.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    });
  });

});
