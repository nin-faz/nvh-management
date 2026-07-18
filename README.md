# N.V.H Management — Site vitrine

Site one-page premium pour l'agence de footballeurs professionnels N.V.H Management.
Charte : navy profond / blanc / **or réservé à la section Services Gold**.

## Stack & pourquoi

- **HTML / CSS / JS vanilla** : site vitrine statique → aucun framework nécessaire
  (pas d'état applicatif, pas de composants répétés à grande échelle). Performance maximale,
  zéro dépendance runtime à maintenir.
- **Vite** : dev server avec hot reload + build minifié (`dist/`).
- **GSAP + ScrollTrigger + Lenis** (via CDN) : plongée du logo scrubée au scroll,
  deck sticky des Services Gold, parallax des fonds, inertie de scroll.
- **Progressive enhancement** : sans JS, sans CDN ou en `prefers-reduced-motion`,
  le site reste entièrement lisible en statique (aucun contenu masqué par défaut).

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
```

⚠️ Toujours passer par `npm run dev` — ne pas ouvrir index.html en double-clic
(les modules ES sont bloqués en file://).

## Déploiement Netlify

Le repo contient `netlify.toml` : connecter le repo Git sur Netlify, c'est tout.
Le **formulaire est pré-câblé Netlify Forms** (`data-netlify="true"` + honeypot).
Pour activer l'envoi réel : dans `js/main.js`, remplacer le `preventDefault` du
submit par un envoi effectif (ou laisser le POST natif) une fois en production.
Les soumissions arrivent dans l'onglet *Forms* du dashboard Netlify.

## Structure

```
index.html              — structure complète (logo SVG vectorisé inline)
css/styles.css          — styles (variables de charte en tête de fichier)
js/main.js              — interactions + animations (fallback statique intégré)
assets/logo-nvh.svg     — logo vectorisé (à remplacer par le fichier source officiel)
assets/img/team/        — portraits duotone navy (originaux dans originals/)
assets/img/sections/    — fonds de section duotone (crédits : CREDITS.md)
assets/img/sponsors/    — déposer ici les logos officiels des marques
```

## TODO avant mise en ligne

- [ ] Logo source officiel (AI/EPS/SVG) → remplacer le tracé `assets/logo-nvh.svg` + inline dans index.html
- [ ] URL Instagram réelle (3 occurrences de `https://www.instagram.com/`)
- [ ] Logos sponsors : récupérer les **kits presse officiels** Nike / Adidas / Puma,
      les déposer dans `assets/img/sponsors/` et remplacer le contenu des `.brand-slot`
      (usage nominatif : l'agence affiche ses partenaires réels)
- [ ] « Tovio » : confirmer l'orthographe et obtenir le logo
- [ ] Photos de fond : celles fournies sont sous licence CC BY (attribution requise,
      voir `assets/img/sections/CREDITS.md`) → soit créditer dans les mentions légales,
      soit remplacer par des photos du client
- [ ] Rédiger Mentions légales + Politique de confidentialité (RGPD : formulaire
      avec email + upload). Bandeau cookies uniquement si analytics ajouté.
- [ ] Vérifier l'ordre/attribution des portraits d'équipe (mapping fait d'après
      l'ordre d'envoi des photos)
