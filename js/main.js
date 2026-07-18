/* ============================================================
   N.V.H MANAGEMENT — main.js
   Progressive enhancement : sans GSAP/Lenis (CDN bloqué) ou en
   prefers-reduced-motion, le site reste 100% lisible en statique.
   ============================================================ */
const body = document.body;
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

/* ================= UI de base (indépendante de GSAP) ================= */

// Menu hamburger
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const open = body.classList.toggle('menu-open');
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && body.classList.contains('menu-open')) {
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.focus();
  }
});

// Accordéon Services Gold
const goldToggle = document.getElementById('goldToggle');
const subGold = document.getElementById('subGold');
goldToggle.addEventListener('click', () => {
  const open = subGold.classList.toggle('open');
  goldToggle.setAttribute('aria-expanded', open);
});

// Header au scroll
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Upload
const zone = document.getElementById('uploadZone');
const fileInput = document.getElementById('f-file');
const fileName = document.getElementById('fileName');
zone.addEventListener('click', () => fileInput.click());
zone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
});
fileInput.addEventListener('change', () => {
  fileName.textContent = fileInput.files.length ? fileInput.files[0].name : '';
});
['dragover', 'dragleave', 'drop'].forEach(ev => {
  zone.addEventListener(ev, e => {
    e.preventDefault();
    zone.classList.toggle('dragover', ev === 'dragover');
    if (ev === 'drop' && e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      fileName.textContent = e.dataTransfer.files[0].name;
    }
  });
});

// Formulaire : honeypot + validation.
// Pré-câblé Netlify Forms : en prod, retirer le preventDefault (voir README).
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (form.website.value) return; // bot piégé
  let ok = true;
  const check = (name, valid) => {
    const f = form.querySelector(`[data-field="${name}"]`);
    f.classList.toggle('error', !valid);
    if (!valid) ok = false;
  };
  check('objet', form.objet.value.trim().length > 1);
  check('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim()));
  check('message', form.message.value.trim().length > 4);
  note.textContent = ok
    ? 'Maquette : formulaire valide — l\u2019envoi sera activé au déploiement (Netlify Forms).'
    : '';
});

// Boutons magnétiques (souris précise uniquement)
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !RM) {
  document.querySelectorAll('[data-magnet]').forEach(el => {
    const strength = 14;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.22,.8,.3,1)';
      el.style.transform = '';
      setTimeout(() => (el.style.transition = ''), 500);
    });
  });
}

/* ================= Fallback statique ================= */
if (RM || !hasGSAP) {
  body.classList.add('static');
} else {
  /* ================= Animations GSAP ================= */
  gsap.registerPlugin(ScrollTrigger);

  // Lenis : inertie de scroll synchronisée avec ScrollTrigger
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    document.documentElement.classList.add('lenis');
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Ancres via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Barre de progression
  gsap.to('.progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: .3 }
  });

  // Entrée
  gsap.from('#logoHero', { autoAlpha: 0, scale: 1.06, duration: 1.8, ease: 'power3.out', delay: .15 });
  gsap.from('#scrollHint', { autoAlpha: 0, y: 10, duration: 1, delay: 1.2 });
  gsap.from('.burger', { autoAlpha: 0, y: -10, duration: .8, delay: .5 });

  // PLONGÉE
  gsap.timeline({
    scrollTrigger: {
      trigger: '.dive', start: 'top top', end: 'bottom bottom', scrub: 1,
      onUpdate: self => body.classList.toggle('past-dive', self.progress > .6)
    }
  })
    .to('#logoHero', { scale: 16, ease: 'power2.in' }, 0)
    .to('#scrollHint', { autoAlpha: 0, ease: 'none' }, 0)
    .to('#logoHero', { autoAlpha: 0, ease: 'none', duration: .3 }, .5)
    .to('#diveVeil', { opacity: .95, ease: 'none', duration: .4 }, .55);

  // Parallax des fonds de section
  gsap.utils.toArray('.section-veil img').forEach(img => {
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.closest('.band'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Révélations
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      y: 44, autoAlpha: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  // DECK : la carte qui part recule et s'assombrit
  const cards = gsap.utils.toArray('.deck-card');
  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    const next = cards[i + 1];
    gsap.timeline({
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=140', scrub: true }
    })
      .to(card, { scale: .93, transformOrigin: 'center top', ease: 'none' }, 0)
      .to(card.querySelector('.card-veil'), { opacity: .55, ease: 'none' }, 0);
  });

  // Refresh après chargement des fonts
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
