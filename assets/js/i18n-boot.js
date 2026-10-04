/* =========================================================
   Amorçage i18n — charge les 3 fichiers JSON puis démarre i18next
   À placer APRÈS i18next (CDN) et i18n.js dans le HTML
   ========================================================= */
(function () {
  'use strict';

  var LANGS = ['fr', 'en', 'ar'];
  var BASE = 'assets/js/locales/';

  /* Un seul fetch par langue, en parallèle */
  Promise.all(LANGS.map(function (code) {
    return fetch(BASE + code + '.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error(code + ' -> HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        return { code: code, data: data };
      })
      .catch(function (err) {
        console.warn('[i18n] langue "' + code + '" indisponible :', err.message);
        return null;
      });
  }))
    .then(function (results) {
      var resources = {};
      var ok = 0;
      results.forEach(function (r) {
        if (r) { resources[r.code] = { translation: r.data }; ok++; }
      });

      if (!ok) {
        console.warn('[i18n] aucune langue chargée — le site reste en français.');
        return;
      }

      /* Si la langue préférée n'a pas pu être chargée, on retombe sur le français */
      if (!resources.fr) {
        var first = LANGS.filter(function (c) { return resources[c]; })[0];
        resources.fr = resources[first];
      }

      if (window.PALMARY && window.PALMARY.initI18n) {
        window.PALMARY.initI18n(resources);
      } else {
        console.error('[i18n] i18n.js absent ou non chargé.');
      }
    })
    .catch(function (err) {
      console.error('[i18n] échec du chargement :', err);
    });
})();
