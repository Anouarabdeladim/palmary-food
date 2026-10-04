/* Palmary — clone de démonstration (non affilié) */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  /* ---------- En-tête collant ---------- */
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var closeNav = function () {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* Fermeture au clic sur un lien d'ancrage */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    /* Fermeture au clic hors menu */
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) closeNav();
    });

    /* Fermeture au clavier (Échap) */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    /* Retour au desktop : on nettoie l'état mobile */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---------- Sous-menu « Palmary group » ---------- */
  document.querySelectorAll('.nav-item.has-panel').forEach(function (item) {
    var trigger = item.querySelector('.nav-link');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* Survol (desktop uniquement) */
    item.addEventListener('mouseenter', function () {
      if (window.innerWidth > 760) item.classList.add('is-open');
    });
    item.addEventListener('mouseleave', function () {
      if (window.innerWidth > 760) item.classList.remove('is-open');
    });
  });

  /* Fermeture du sous-menu au clic extérieur */
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav-item.is-open').forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        var t = item.querySelector('.nav-link');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Révélation au défilement ---------- */
  var targets = document.querySelectorAll(
    '.card, .pillar, .news, .brand-pill, .excellence, .section-head, .purpose'
  );

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Bandeau de marques : duplication pour une boucle sans couture ---------- */
  var track = document.getElementById('marqueeTrack');
  if (track) {
    var chips = Array.prototype.slice.call(track.children);
    if (chips.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      /* On duplique jusqu'à couvrir au moins deux largeurs d'écran,
         car l'animation translateX(-50%) doit revenir exactement au point de départ. */
      var need = Math.ceil((window.innerWidth * 2) / (chips[0].offsetWidth + 16)) + 1;
      for (var rep = 0; rep < need; rep++) {
        chips.forEach(function (chip) {
          var clone = chip.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }
    }
  }

  /* ---------- Année courante ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
