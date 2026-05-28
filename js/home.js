// MR HOSTLY - Homepage scripts (interactieve tool)

document.addEventListener('DOMContentLoaded', () => {

  const answers = {};
  let currentStep = 1;

  const steps = document.querySelectorAll('.tool-step');
  const progress = document.querySelectorAll('.tool-progress-step');
  const counter = document.getElementById('toolCounter');
  const backBtn = document.getElementById('toolBack');

  // Pakket aanbevelingen op basis van budget
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
      extra: '+ vanaf €39/mnd · inclusief hosting',
      features: [
        '5-8 pagina\'s op maat',
        'Hosting & SSL inbegrepen',
        'Kleine aanpassingen gedurende het jaar',
        'SEO-basis ingebouwd'
      ]
    },
    hoog: {
      name: 'Slim pakket',
      price: 'vanaf €2.495',
      extra: '+ vanaf €50/mnd · maatwerk',
      features: [
        'Volledig maatwerk design',
        'Uitgebreide SEO-optimalisatie',
        'Analytics dashboard',
        'Chatbot-ready integratie'
      ]
    }
  };

  function showStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`[data-step="${step}"]`);
    if (target) target.classList.add('active');

    const total = step === 'result' ? 3 : step;
    progress.forEach((p, i) => p.classList.toggle('active', i < total));

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
    const sectorText = {
      horeca: 'horeca',
      retail: 'retail',
      leisure: 'leisure',
      anders: 'jouw bedrijf'
    }[answers.sector] || 'jouw bedrijf';

    let html = '<span class="section-eyebrow">Op maat voor ' + sectorText + '</span>';
    html += '<h3>Dit past bij jou</h3>';
    html += '<p class="tool-result-tagline">Op basis van je antwoorden raden we dit pakket aan</p>';
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
        for (const key in answers) delete answers[key];
        document.querySelectorAll('.tool-option').forEach(o => o.classList.remove('selected'));
        showStep(1);
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

      if (step === '1') answers.sector = val;
      if (step === '2') answers.behoefte = val;
      if (step === '3') answers.budget = val;

      // Volgende stap na korte vertraging
      setTimeout(() => {
        if (step === '3') {
          buildResult();
          showStep('result');
        } else {
          showStep(parseInt(step) + 1);
        }
      }, 280);
    });
  });

  // Terug knop
  backBtn.addEventListener('click', () => {
    if (currentStep === 'result') {
      showStep(3);
    } else if (typeof currentStep === 'number' && currentStep > 1) {
      showStep(currentStep - 1);
    }
  });

});
