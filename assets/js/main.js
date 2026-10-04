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

  /* ---------- Voile sombre derrière le tiroir mobile ---------- */
  var scrim = document.createElement('div');
  scrim.className = 'nav-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  document.body.appendChild(scrim);

  var lockScroll = function (on) {
    document.body.style.overflow = on ? 'hidden' : '';
  };

  var originalClose = closeNav;
  closeNav = function () {
    originalClose();
    scrim.classList.remove('is-on');
    lockScroll(false);
  };

  /* Intercepte l'ouverture pour poser le voile + le verrou */
  document.addEventListener('click', function (e) {
    if (e.target.closest('#burger') && nav && nav.classList.contains('is-open') === false) {
      scrim.classList.add('is-on');
      lockScroll(true);
    }
  }, true);

  scrim.addEventListener('click', closeNav);

  /* Piège à focus dans le menu ouvert (accessibilité clavier) */
  if (nav && burger) {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
      var f = nav.querySelectorAll('a, button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- Lien de navigation actif (au défilement) ---------- */
  var sections = ['produits', 'marques', 'engagements', 'actualites'];
  var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-current', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Barre de progression de lecture ---------- */
  var bar = document.getElementById('readProgress');
  var toTop = document.getElementById('toTop');
  var heroMedia = document.querySelector('.hero-media img');

  function onScrollFx() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;

    if (bar && h > 0) bar.style.width = Math.min(100, (y / h) * 100) + '%';
    if (toTop) toTop.classList.toggle('is-on', y > 520);

    /* Parallaxe douce sur l'image du hero */
    if (heroMedia && y < window.innerHeight * 1.2) {
      heroMedia.style.transform = 'scale(1.06) translateY(' + (y * 0.18) + 'px)';
    }
  }
  onScrollFx();
  window.addEventListener('scroll', onScrollFx, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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
