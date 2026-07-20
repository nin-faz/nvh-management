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
  if (e.key === "Escape" && body.classList.contains("menu-open")) {
    body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.focus();
  }
});

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
fileInput.addEventListener("change", () => {
  fileName.textContent = fileInput.files.length ? fileInput.files[0].name : "";
});
["dragover", "dragleave", "drop"].forEach((ev) => {
  zone.addEventListener(ev, (e) => {
    e.preventDefault();
    zone.classList.toggle("dragover", ev === "dragover");
    if (ev === "drop" && e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      fileName.textContent = e.dataTransfer.files[0].name;
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
    form.innerHTML = `
      <div class="form-success">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
        <p class="form-success-title">Message envoyé.</p>
        <p class="form-success-sub">Nous reviendrons vers vous rapidement.</p>
      </div>`;
  } catch (error) {
    note.textContent = error.message || "Une erreur est survenue. Réessayez.";
  } finally {
    submitButton.disabled = false;
  }
});

/* ================= Fallback statique ================= */
if (RM || !hasGSAP) {
  body.classList.add("static");
} else {
  /* ================= Animations GSAP ================= */
  gsap.registerPlugin(ScrollTrigger);

  // Lenis : inertie de scroll synchronisée avec ScrollTrigger
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    document.documentElement.classList.add("lenis");
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Ancres via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
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
    "#hero-stage",
    { autoAlpha: 0, scale: 0.12, filter: "blur(22px)" },
    {
      autoAlpha: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.6,
      ease: "expo.out",
      onComplete: () => gsap.set("#hero-stage", { clearProps: "filter" }),
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
      autoAlpha: 0,
      duration: 0.65,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 89%" },
    });
  });

  // 2. Titres — dévoilement vertical propre
  gsap.utils.toArray(".section-title.reveal").forEach((el) => {
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  // 3. Team cards — stagger par grille
  gsap.utils.toArray(".team-grid").forEach((grid) => {
    gsap.from(grid.querySelectorAll(".team-card"), {
      y: 40,
      autoAlpha: 0,
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
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.11,
      scrollTrigger: { trigger: grid, start: "top 82%" },
    });
  });

  // 5. Values list — stagger du bas
  gsap.utils.toArray(".values-list li").forEach((li, i) => {
    gsap.from(li, {
      x: 16,
      autoAlpha: 0,
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
      autoAlpha: 0,
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
      autoAlpha: 0,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 87%" },
    });
  });

  // 5. Values list — stagger du bas
  gsap.utils.toArray('.values-list li').forEach((li, i) => {
    gsap.from(li, { x: 16, autoAlpha: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: li, start: 'top 90%' }, delay: i * 0.06 });
  });

  // 6. Legal cards — stagger
  gsap.utils.toArray('.legal-missions').forEach(grid => {
    gsap.from(grid.querySelectorAll('.legal-card'), {
      y: 24, autoAlpha: 0, duration: 0.75, ease: 'power2.out', stagger: 0.09,
      scrollTrigger: { trigger: grid, start: 'top 84%' }
    });
  });

  // 7. Tout le reste .reveal (leads, blocs texte, etc.)
  gsap.utils.toArray('.reveal').forEach(el => {
    if (el.classList.contains('eyebrow') || el.classList.contains('section-title') ||
        el.classList.contains('team-card') || el.classList.contains('pillar') ||
        el.classList.contains('legal-card')) return;
    gsap.from(el, { y: 36, autoAlpha: 0, duration: 0.95, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 87%' } });
  });

  // DECK : animation scale désactivée (design uniforme)

  // Refresh après chargement des fonts
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
