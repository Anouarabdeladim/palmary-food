/* =========================================================
   Formulaire de contact → Supabase (table public.messages)
   Utilise l'API REST avec la clé "anon" (jamais service_role).
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var submit = document.getElementById('submitBtn');
  var localeInput = document.getElementById('localeField');

  /* ---------- Anti-spam : champ piège + horodatage ---------- */
  var trap = document.getElementById('website');   // piège à robots
  var startedAt = Date.now();
  var MIN_MS = 2500;                               // sous 2,5 s = robot

  /* ---------- Traduction d'un message d'erreur ---------- */
  function t(key, fallback) {
    if (window.i18next && window.i18next.t) {
      var v = window.i18next.t(key);
      if (v && v !== key) return v;
    }
    return fallback;
  }

  function say(type, text) {
    if (!status) return;
    status.className = 'form-status is-' + type;
    status.textContent = text;
    status.setAttribute('role', 'status');
  }

  function setBusy(busy) {
    if (submit) {
      submit.disabled = busy;
      submit.classList.toggle('is-loading', busy);
      submit.setAttribute('aria-busy', busy ? 'true' : 'false');
      var label = submit.querySelector('.btn-label');
      if (label) {
        label.textContent = busy
          ? t('contact.sending', 'Envoi en cours…')
          : t('contact.submit', 'Envoyer le message');
      }
    }
  }

  /* ---------- Validation ---------- */
  function fieldError(input, key, fallback) {
    input.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    return t(key, fallback);
  }

  function clearErrors() {
    form.querySelectorAll('.has-error').forEach(function (el) {
      el.classList.remove('has-error');
      el.removeAttribute('aria-invalid');
    });
  }

  function validate(data) {
    clearErrors();
    var problems = [];

    var name = form.elements.name, email = form.elements.email,
        message = form.elements.message, phone = form.elements.phone;

    if (!data.name || data.name.length < 2) problems.push(fieldError(name, 'contact.required', 'Champ obligatoire'));
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(data.email))
      problems.push(fieldError(email, 'contact.invalidEmail', 'Adresse e-mail invalide'));
    if (!data.message || data.message.length < 20)
      problems.push(fieldError(message, 'contact.tooShort', 'Merci d\'écrire au moins 20 caractères'));

    /* Téléphone facultatif : chiffres, espaces, +, -, () seulement */
    if (data.phone && !/^[0-9+\-\s().]{6,30}$/.test(data.phone))
      problems.push(fieldError(phone, 'contact.invalidEmail', 'Numéro de téléphone invalide'));

    return problems;
  }

  /* ---------- Envoi vers Supabase ---------- */
  function send(payload) {
    var conf = (window.SITE_CONFIG && window.SITE_CONFIG.supabase) || {};
    var url = (conf.url || '').replace(/\/+$/, '');
    var key = conf.anonKey || '';

    if (!url || !key || url.indexOf('VOTRE-') === 0 || key.indexOf('VOTRE_') === 0) {
      return Promise.reject(new Error('CONFIG'));
    }

    return fetch(url + '/rest/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (res.status === 201 || res.status === 200) return true;
      return res.text().then(function (body) {
        throw new Error('HTTP ' + res.status + ' ' + body.slice(0, 200));
      });
    });
  }

  /* ---------- Soumission ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (trap && trap.value) return;                      // robot silencieux
    if (Date.now() - startedAt < MIN_MS) return;          // humain trop rapide

    var data = {
      name:    String(form.elements.name.value || '').trim(),
      email:   String(form.elements.email.value || '').trim(),
      phone:   String(form.elements.phone.value || '').trim() || null,
      subject: String(form.elements.subject.value || '').trim() || null,
      message: String(form.elements.message.value || '').trim()
    };

    var problems = validate(data);
    if (problems.length) {
      say('error', problems[0]);
      var firstBad = form.querySelector('.has-error');
      if (firstBad) firstBad.focus();
      return;
    }

    data.locale = window.i18next ? window.i18next.language : 'fr';
    if (data.locale.indexOf('VOTRE') === 0) data.locale = 'fr';

    setBusy(true);
    say('info', t('contact.sending', 'Envoi en cours…'));

    send(data)
      .then(function () {
        form.reset();
        setBusy(false);
        say('success', t('contact.success',
          'Merci ! Votre message a bien été envoyé. Nous vous répondons sous 48 heures.'));
        form.classList.add('is-sent');
      })
      .catch(function (err) {
        setBusy(false);
        if (err && err.message === 'CONFIG') {
          say('error', 'Configuration Supabase manquante — voir assets/js/config.js');
          console.error('[contact] Renseignez supabase.url et supabase.anonKey dans config.js');
        } else {
          say('error', t('contact.error', 'Une erreur est survenue. Merci de réessayer dans quelques instants.'));
          console.error('[contact]', err);
        }
      });
  });

  /* Retire l'erreur dès que l'utilisateur corrige */
  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('has-error')) {
      e.target.classList.remove('has-error');
      e.target.removeAttribute('aria-invalid');
    }
  });

  /* Garde la langue courante à jour si elle change */
  document.addEventListener('palmary:i18n-ready', function () {
    if (localeInput) localeInput.value = window.i18next.language;
  });
})();
