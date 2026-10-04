/* =========================================================
   i18n — multilingue FR / EN / AR (avec bascule RTL)
   Dépendance : i18next via CDN (voir <script> dans le HTML)
   Repli : si le CDN est indisponible, le site reste en français
   ========================================================= */
(function () {
  'use strict';

  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.languages) || [
    { code: 'fr', label: 'Français', flag: '', dir: 'ltr' }
  ];
  var defaultLang = (window.SITE_CONFIG && window.SITE_CONFIG.defaultLanguage) || 'fr';

  function getDir(code) {
    for (var i = 0; i < cfg.length; i++) if (cfg[i].code === code) return cfg[i].dir || 'ltr';
    return 'ltr';
  }

  /* ---------- Applique les traductions au DOM ---------- */
  function applyTranslations() {
    if (!window.i18next) return;

    // data-i18n="cle"  -> textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = window.i18next.t(key);
      if (val && val !== key) el.textContent = val;
    });

    // data-i18n-placeholder="cle" -> placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = window.i18next.t(key);
      if (val && val !== key) el.setAttribute('placeholder', val);
    });

    // data-i18n-attr="placeholder:cle; aria-label:cle2"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) {
          var val = window.i18next.t(bits[1].trim());
          if (val && val !== bits[1].trim()) el.setAttribute(bits[0].trim(), val);
        }
      });
    });
  }

  /* ---------- Bascule langue + sens RTL ---------- */
  function setLanguage(code) {
    if (!window.i18next) return;
    window.i18next.changeLanguage(code);
    try { localStorage.setItem('palmary_lang', code); } catch (e) { /* mode privé */ }

    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', getDir(code));
    document.body.classList.toggle('rtl', getDir(code) === 'rtl');

    document.querySelectorAll('[data-lang-option]').forEach(function (b) {
      b.setAttribute('aria-current', b.getAttribute('data-lang-option') === code ? 'true' : 'false');
    });
  }

  /* ---------- Sélecteur de langue ---------- */
  function buildSwitcher() {
    var mount = document.getElementById('lang-switcher');
    if (!mount) return;

    var langs = cfg.map(function (l) {
      return '<button type="button" class="lang-btn" data-lang-option="' + l.code +
             '" aria-current="false" title="' + l.label + '">' +
             (l.flag ? '<span class="lang-flag" aria-hidden="true">' + l.flag + '</span>' : '') +
             '<span class="lang-label">' + l.label + '</span></button>';
    }).join('');

    mount.innerHTML =
      '<button type="button" class="lang-toggle" id="langToggle" aria-expanded="false" ' +
      'data-i18n-attr="aria-label:nav.language">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
      '<path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" ' +
      'fill="none" stroke="currentColor" stroke-width="1.8"/></svg>' +
      '<span id="langCurrent"></span></button>' +
      '<div class="lang-menu" id="langMenu" role="menu">' + langs + '</div>';

    var toggle = document.getElementById('langToggle');
    var menu = document.getElementById('langMenu');

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lang-option]');
      if (!btn) return;
      setLanguage(btn.getAttribute('data-lang-option'));
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', function (e) {
      if (!mount.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.PALMARY.updateLangLabel = function (code) {
      var cur = cfg.filter(function (l) { return l.code === code; })[0] || cfg[0];
      var el = document.getElementById('langCurrent');
      if (el) el.textContent = cur.label;
      document.querySelectorAll('.lang-btn').forEach(function (b) {
        b.setAttribute('aria-current', b.getAttribute('data-lang-option') === code ? 'true' : 'false');
      });
    };
  }

  /* ---------- Démarrage ---------- */
  function start() {
    var saved = null;
    try { saved = localStorage.getItem('palmary_lang'); } catch (e) { /* ignore */ }

    var initial = saved || defaultLang;
    if (cfg.filter(function (l) { return l.code === initial; }).length === 0) initial = defaultLang;

    if (!window.i18next) {           // CDN indisponible : on reste en français
      document.documentElement.setAttribute('lang', defaultLang);
      return;
    }

    window.i18next.init({
      lng: initial,
      fallbackLng: defaultLang,
      debug: false,
      resources: window.PALMARY_RESOURCES || {},
      interpolation: { escapeValue: false }
    }, function () {
      setLanguage(window.i18next.language);
      applyTranslations();
      if (window.PALMARY.updateLangLabel) window.PALMARY.updateLangLabel(window.i18next.language);
      document.dispatchEvent(new CustomEvent('palmary:i18n-ready'));
    });
  }

  // Le module attend que les 3 JSON soient chargés
  window.PALMARY = { setLanguage: setLanguage, applyTranslations: applyTranslations };
  window.PALMARY.initI18n = function (resources) {
    window.PALMARY_RESOURCES = resources;
    start();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSwitcher);
  } else {
    buildSwitcher();
  }
})();
