// ═══════════════════════════════════════════
//   MR HOSTLY — Homepage scripts
//   Tool + hero chatbot + spells
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────
  // 1. HERO CHATBOT — typing animation loop
  // ────────────────────────────────────────
  const heroChatBody = document.getElementById('heroChatBody');
  if (heroChatBody) {
    const sequence = [
      { type: 'bot', text: 'Hallo! Hoe kan ik helpen?' },
      { type: 'usr', text: 'Tafel voor vrijdag?' },
      { type: 'typing' },
      { type: 'bot', text: 'Voor hoeveel personen?' },
      { type: 'usr', text: '4 personen, 19:00' },
      { type: 'typing' },
      { type: 'bot', text: 'Geboekt! ✓' }
    ];

    let idx = 0;
    function chatStep() {
      heroChatBody.innerHTML = '';
      const visible = sequence.slice(0, idx + 1);
      visible.forEach(m => {
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
      idx = (idx + 1) % sequence.length;
    }
    setInterval(chatStep, 1500);
  }

  // ────────────────────────────────────────
  // 2. INTERACTIEVE TOOL
  // ────────────────────────────────────────
  const answers = {};
  let currentStep = 1;

  const steps = document.querySelectorAll('.tool-step');
  const progress = [
    document.getElementById('ps1'),
    document.getElementById('ps2'),
    document.getElementById('ps3')
  ];
  const counter = document.getElementById('toolCounter');
  const backBtn = document.getElementById('toolBack');
  const ctxPanels = document.querySelectorAll('.tool-ctx');

  // Pakket aanbevelingen
  const packages = {
    laag: {
      name: 'Online pakket',
      price: '€695',
      extra: 'eenmalig · geen abonnement',
      features: [
        'Professionele one-pager op maat',
        'Mobielvriendelijk & responsive',
        'Contactformulier inbegrepen',
        'Live in 5-10 werkdagen'
      ]
    },
    midden: {
      name: 'Groei pakket',
      price: '€1.495',
      extra: '+ vanaf €59/mnd · inclusief hosting',
      features: [
        '3-6 pagina\'s op maat',
        'Hosting & SSL inbegrepen',
        'Kleine aanpassingen het hele jaar',
        '1× per kwartaal frisse blik'
      ]
    },
    hoog: {
      name: 'Slim pakket',
      price: 'vanaf €2.495',
      extra: '+ vanaf €99/mnd · volledig maatwerk',
      features: [
        'Onbeperkt aantal pagina\'s',
        'Volledig maatwerk design',
        'Uitgebreide SEO + Analytics',
        'WhatsApp support'
      ]
    }
  };

  function showCtx(key) {
    ctxPanels.forEach(p => p.classList.remove('active'));
    const target = document.querySelector(`[data-ctx="${key}"]`);
    if (target) target.classList.add('active');
  }

  function showStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.tool-step[data-step="${step}"]`);
    if (target) target.classList.add('active');

    const total = step === 'result' ? 3 : step;
    progress.forEach((p, i) => {
      if (p) p.classList.toggle('active', i < total);
    });

    if (step === 'result') {
      counter.textContent = 'Jouw aanbeveling';
      backBtn.classList.remove('hidden');
    } else {
      counter.textContent = `Stap ${step} van 3`;
      backBtn.classList.toggle('hidden', step === 1);
    }

    currentStep = step;
  }

  function buildResult() {
    const pkg = packages[answers.budget] || packages.midden;

    let html = '<span class="section-eyebrow">Jouw aanbeveling</span>';
    html += '<h3>Dit past bij jou</h3>';
    html += '<p class="tool-result-tagline">Op basis van je antwoorden raden we dit aan</p>';
    html += '<div class="tool-result-pkg">';
    html += '<div class="tool-result-pkg-label">Aanbevolen pakket</div>';
    html += '<div class="tool-result-pkg-name">' + pkg.name + '</div>';
    html += '<div class="tool-result-pkg-price">' + pkg.price + '</div>';
    html += '<div class="tool-result-pkg-extra">' + pkg.extra + '</div>';
    html += '<ul class="tool-result-list">';
    pkg.features.forEach(f => { html += '<li>' + f + '</li>'; });
    html += '</ul></div>';
    html += '<a href="contact.html" class="btn btn-orange btn-arrow btn-prominent">Plan een gratis kennismaking</a>';
    html += '<div><button class="tool-result-restart" id="restartTool">↻ Opnieuw doen</button></div>';

    const resultBox = document.getElementById('toolResult');
    if (resultBox) {
      resultBox.innerHTML = html;
      document.getElementById('restartTool').addEventListener('click', () => {
        Object.keys(answers).forEach(key => delete answers[key]);
        document.querySelectorAll('.tool-option').forEach(o => o.classList.remove('selected'));
        showStep(1);
        showCtx('empty');
      });
    }
  }

  // Klik op een optie
  document.querySelectorAll('.tool-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const stepEl = this.closest('.tool-step');
      const step = stepEl.dataset.step;
      const val = this.dataset.val;

      // Visuele feedback
      stepEl.querySelectorAll('.tool-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');

      // Rechter kolom direct updaten
      showCtx(val);

      if (step === '1') answers.sector = val;
      if (step === '2') answers.behoefte = val;
      if (step === '3') answers.budget = val;

      // Volgende stap na korte vertraging
      setTimeout(() => {
        if (step === '3') {
          buildResult();
          showStep('result');
          showCtx('result');
          // SPELL 3: Confetti bij resultaat
          fireConfetti();
        } else {
          showStep(parseInt(step) + 1);
        }
      }, 320);
    });
  });

  // Terug knop
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep === 'result') {
        showStep(3);
        if (answers.budget) showCtx(answers.budget);
      } else if (typeof currentStep === 'number' && currentStep > 1) {
        const prev = currentStep - 1;
        showStep(prev);
        if (prev === 1 && answers.sector) showCtx(answers.sector);
        if (prev === 2 && answers.behoefte) showCtx(answers.behoefte);
      }
    });
  }

  // ────────────────────────────────────────
  // 3. SPELL 1: Cijfers die meetellen bij scroll
  // ────────────────────────────────────────
  const countElements = document.querySelectorAll('[data-count]');
  const counted = new Set();

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
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
  const tiltCards = document.querySelectorAll('[data-tilt]');

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
    const colors = ['#E8A030', '#1B2D5E', '#FFB955', '#2A4080', '#FFF1DD'];
    const count = 80;
    const toolSection = document.getElementById('tool');
    if (!toolSection) return;
    const rect = toolSection.getBoundingClientRect();
    const originY = rect.top + window.scrollY + (rect.height / 2);
    const originX = window.innerWidth / 2;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = originX + 'px';
      piece.style.top = (originY - window.scrollY) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.opacity = '1';

      const angle = Math.random() * Math.PI * 2;
      const distance = 200 + Math.random() * 400;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance + 300;
      const rot = (Math.random() * 720 - 360);
      const dur = 1200 + Math.random() * 1000;

      piece.style.transition = `transform ${dur}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${dur}ms ease-out`;

      document.body.appendChild(piece);

      requestAnimationFrame(() => {
        piece.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        piece.style.opacity = '0';
      });

      setTimeout(() => piece.remove(), dur + 100);
    }
  }

});
