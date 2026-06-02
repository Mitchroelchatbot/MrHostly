// ═══════════════════════════════════════════
//   MR HOSTLY — Contactformulier
//   Client-side validatie + Formspree (AJAX, geen herlaad) + nette feedback.
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('cformStatus');
  const submitBtn = document.getElementById('cformSubmit');
  const fields = Array.from(form.querySelectorAll('.cfield[data-validate]'));
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getInput(field) {
    return field.querySelector('input, textarea, select');
  }

  function validateField(field) {
    const input = getInput(field);
    const type = field.dataset.validate;
    let ok = true;
    const val = (input.value || '').trim();
    if (type === 'required') ok = val.length > 0;
    else if (type === 'email') ok = emailRe.test(val);
    field.classList.toggle('invalid', !ok);
    return ok;
  }

  // Validatie op blur (niet bij elke toetsaanslag — minder irritant)
  fields.forEach(field => {
    const input = getInput(field);
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => { if (field.classList.contains('invalid')) validateField(field); });
    if (input.tagName === 'SELECT') input.addEventListener('change', () => validateField(field));
  });

  function setStatus(kind, msg) {
    statusEl.className = 'cform-status ' + kind;
    statusEl.textContent = msg;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Valideer alle verplichte velden; focus de eerste foute
    let firstInvalid = null;
    fields.forEach(field => {
      const ok = validateField(field);
      if (!ok && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      statusEl.className = 'cform-status';
      getInput(firstInvalid).focus();
      return;
    }

    // Formspree nog niet gekoppeld? Geef een duidelijke instructie i.p.v. een nep-succes.
    if (form.action.indexOf('JOUW_FORM_ID') !== -1) {
      setStatus('err', 'Formulier nog niet gekoppeld: vul je Formspree form-ID in (zie de instructie-comment in contact.html).');
      return;
    }

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = 'Versturen…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        fields.forEach(f => f.classList.remove('invalid'));
        setStatus('ok', 'Bedankt! We hebben je bericht ontvangen en nemen snel persoonlijk contact op.');
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data && data.errors && data.errors.length
          ? data.errors.map(x => x.message).join(' ')
          : 'Er ging iets mis bij het versturen. Probeer het later opnieuw of mail naar info@mrhostly.nl.';
        setStatus('err', msg);
      }
    } catch (err) {
      setStatus('err', 'Geen verbinding. Probeer het later opnieuw of mail rechtstreeks naar info@mrhostly.nl.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
});
