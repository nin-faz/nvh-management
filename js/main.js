/* ============================================================
   N.V.H MANAGEMENT — main.js
   Progressive enhancement : sans GSAP/Lenis (CDN bloqué) ou en
   prefers-reduced-motion, le site reste 100% lisible en statique.
   ============================================================ */
const body = document.body;
const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP =
  typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

/* ================= UI de base (indépendante de GSAP) ================= */

// Menu hamburger
const burger = document.getElementById("burger");
burger.addEventListener("click", () => {
  const open = body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
});
document.addEventListener("keydown", (e) => {
  if (!body.classList.contains("menu-open")) return;
  if (e.key === "Escape") {
    body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.focus();
    return;
  }
  if (e.key === "Tab") {
    const menuNav = document.getElementById("menu");
    const focusable = [...menuNav.querySelectorAll('a,[href],button,[tabindex]:not([tabindex="-1"])')].filter(
      (el) => !el.closest(".sub-wrap:not(.open)") && getComputedStyle(el).visibility !== "hidden"
    );
    focusable.unshift(burger);
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }
});

// Vidéo fond — fade in quand chargée
const bgVideo = document.querySelector('.bg-video');
if (bgVideo) {
  bgVideo.addEventListener('canplay', () => bgVideo.classList.add('loaded'), { once: true });
  if (RM) bgVideo.pause();
}

// Accordéon Services Gold
const goldToggle = document.getElementById("goldToggle");
const subGold = document.getElementById("subGold");
goldToggle.addEventListener("click", () => {
  const open = subGold.classList.toggle("open");
  goldToggle.setAttribute("aria-expanded", open);
});

// Header au scroll
const header = document.getElementById("siteHeader");
window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

// Upload
const zone = document.getElementById("uploadZone");
const fileInput = document.getElementById("f-file");
const fileName = document.getElementById("fileName");
zone.addEventListener("click", () => fileInput.click());
zone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});
const BLOCKED_TYPES = ["image/svg+xml", "text/html", "application/javascript", "application/x-msdownload"];
const fileError = document.getElementById("fileError");

function validateFile(file) {
  if (!file) return true;
  if (BLOCKED_TYPES.includes(file.type) || /\.(svg|html|htm|js|exe|bat|sh)$/i.test(file.name)) {
    fileInput.value = "";
    fileName.textContent = "";
    fileError.textContent = `Le format « ${file.name.split(".").pop().toUpperCase()} » n'est pas accepté comme pièce jointe email. Utilisez PDF, PNG, JPG, DOCX…`;
    return false;
  }
  fileError.textContent = "";
  return true;
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (validateFile(file)) fileName.textContent = file ? file.name : "";
});
["dragover", "dragleave", "drop"].forEach((ev) => {
  zone.addEventListener(ev, (e) => {
    e.preventDefault();
    zone.classList.toggle("dragover", ev === "dragover");
    if (ev === "drop" && e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        fileInput.files = e.dataTransfer.files;
        fileName.textContent = file.name;
      }
    }
  });
});

// Formulaire : honeypot, validation et envoi via Netlify Function + Resend
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const submitButton = form.querySelector('[type="submit"]');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form.website.value) return;
  let ok = true;
  const check = (name, valid) => {
    const f = form.querySelector(`[data-field="${name}"]`);
    f.classList.toggle("error", !valid);
    if (!valid) ok = false;
  };
  check("objet", form.objet.value.trim().length > 1);
  check("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim()));
  check("message", form.message.value.trim().length > 4);
  if (!ok) return;
  submitButton.disabled = true;
  note.textContent = "Envoi en cours…";
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
    });
    const result = response.headers.get("content-type")?.includes("json")
      ? await response.json()
      : {};
    if (!response.ok) throw new Error(result.error || "Envoi impossible.");
    form.reset();
    fileName.textContent = "";
    note.textContent = "";
    const modal = document.getElementById("successModal");
    modal.hidden = false;
    document.getElementById("modalClose").focus();
  } catch (error) {
    note.textContent = error.message || "Une erreur est survenue. Réessayez.";
  } finally {
    submitButton.disabled = false;
  }
});

// Modale succès — fermeture + focus trap
const successModal = document.getElementById("successModal");
const modalClose = document.getElementById("modalClose");
function closeModal() {
  successModal.hidden = true;
  submitButton.focus();
}
modalClose.addEventListener("click", closeModal);
successModal.addEventListener("click", (e) => { if (e.target === successModal) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !successModal.hidden) { closeModal(); return; }
  if (e.key === "Tab" && !successModal.hidden) {
    const focusable = [...successModal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }
});

/* ================= Fallback statique ================= */
if (RM || !hasGSAP) {
  body.classList.add("static");
} else {
  /* ================= Animations GSAP ================= */
  gsap.registerPlugin(ScrollTrigger);

  // Lenis : inertie de scroll synchronisée avec ScrollTrigger
  // Désactivé sur touch (mobile/tablette) — le scroll natif + ScrollTrigger.normalizeScroll est plus fiable
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  let lenis = null;
  if (typeof Lenis !== "undefined" && !isTouch) {
    document.documentElement.classList.add("lenis");
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    ScrollTrigger.normalizeScroll(true);
  }

  // Scroll vers éléments focalisés au clavier (Lenis bloque le scroll natif)
  let usingKeyboard = false;
  document.addEventListener("keydown", () => { usingKeyboard = true; }, { capture: true });
  document.addEventListener("mousedown", () => { usingKeyboard = false; }, { capture: true });
  document.addEventListener("focusin", (e) => {
    if (!usingKeyboard || !lenis) return;
    if (body.classList.contains("menu-open")) return;
    lenis.scrollTo(e.target, { offset: -120, duration: 0.4 });
  });

  // Ancres via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const menuWasOpen = body.classList.contains("menu-open");
      body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
      if (menuWasOpen) burger.focus();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Barre de progression
  gsap.to(".progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  // Entrée
  gsap.fromTo(
    "#intro-stage",
    { autoAlpha: 0, scale: 0.12, filter: "blur(22px)" },
    {
      autoAlpha: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.6,
      ease: "expo.out",
      onComplete: () => gsap.set("#intro-stage", { clearProps: "filter" }),
    },
  );
  gsap.from("#scrollHint", { autoAlpha: 0, y: 10, duration: 0.8, delay: 0.7 });
  gsap.from(".burger", { autoAlpha: 0, y: -10, duration: 0.6, delay: 0.3 });

  // PLONGÉE
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".dive",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) =>
          body.classList.toggle("past-dive", self.progress > 0.6),
      },
    })
    .fromTo(
      "#logoHero",
      { scale: 1 },
      { scale: 16, ease: "power2.in", immediateRender: false },
      0,
    )
    .to("#scrollHint", { autoAlpha: 0, ease: "none" }, 0)
    .fromTo(
      "#logoHero",
      { autoAlpha: 1 },
      { autoAlpha: 0, ease: "none", duration: 0.3, immediateRender: false },
      0.5,
    )
    .to("#diveVeil", { opacity: 0.95, ease: "none", duration: 0.4 }, 0.55);

  // Parallax des fonds de section
  gsap.utils.toArray(".section-veil img").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: img.closest(".band"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  // Révélations différenciées
  // 1. Eyebrows — slide gauche
  gsap.utils.toArray(".eyebrow.reveal").forEach((el) => {
    gsap.from(el, {
      x: -20,
      opacity: 0,
      duration: 0.65,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 89%" },
    });
  });

  // 2. Titres — dévoilement vertical propre
  gsap.utils.toArray(".section-title.reveal").forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  // 3. Team cards — stagger par grille
  gsap.utils.toArray(".team-grid").forEach((grid) => {
    gsap.from(grid.querySelectorAll(".team-card"), {
      y: 40,
      opacity: 0,
      scale: 0.96,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: { trigger: grid, start: "top 80%" },
    });
  });

  // 4. Pillars — stagger horizontal
  gsap.utils.toArray(".pillars").forEach((grid) => {
    gsap.from(grid.querySelectorAll(".pillar"), {
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.11,
      scrollTrigger: { trigger: grid, start: "top 82%" },
    });
  });

  // 5. Values list — stagger
  gsap.utils.toArray(".values-list li").forEach((li, i) => {
    gsap.from(li, {
      x: 16,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: li, start: "top 90%" },
      delay: i * 0.06,
    });
  });

  // 6. Legal cards — stagger
  gsap.utils.toArray(".legal-missions").forEach((grid) => {
    gsap.from(grid.querySelectorAll(".legal-card"), {
      y: 24,
      opacity: 0,
      duration: 0.75,
      ease: "power2.out",
      stagger: 0.09,
      scrollTrigger: { trigger: grid, start: "top 84%" },
    });
  });

  // 7. Tout le reste .reveal (leads, blocs texte, etc.)
  gsap.utils.toArray(".reveal").forEach((el) => {
    if (
      el.classList.contains("eyebrow") ||
      el.classList.contains("section-title") ||
      el.classList.contains("team-card") ||
      el.classList.contains("pillar") ||
      el.classList.contains("legal-card")
    )
      return;
    gsap.from(el, {
      y: 36,
      opacity: 0,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 87%" },
    });
  });

  // Refresh après fonts + images (évite positions mal calculées)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
