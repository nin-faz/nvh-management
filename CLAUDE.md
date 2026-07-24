# N.V.H Management — Claude context

French football agency website. Vanilla HTML/CSS/JS + GSAP + Lenis + Netlify Functions + Resend.

## Files
- `index.html` — single page, all sections
- `css/styles.css` — all styles (no build step for CSS)
- `js/main.js` — GSAP animations + UI logic
- `netlify/functions/contacts.mts` — contact form handler (Resend API)
- `assets/img/` — local images (legal/, pillars/, team/, video/)

## Palette
```
--ink:   #112d4f   (darkest, body bg)
--navy:  #1a3d6e
--panel: #1e4278
--white: #f4f7fc
--mist:  #8fa6c4
--gold:  #c6a24b   (reserved for Services Gold section only)
--gold-hi: #e9d08a
```

## Section IDs
- `#hero` — hero + dive animation (GSAP scroll-driven)
- `#qui-sommes-nous` — team grid (3-col, 7 members)
- `#notre-mission` — pillars (3 cards)
- `#services-gold` — Gold services deck cards (split layout)
- `#protection-juridique` — legal cards
- `#contact` — contact form

## Team grid (7 members, 3-col CSS grid)
```
Deige (lead-card, 1 col × 3 rows) | Olivia | Akissi
Deige (suite)                     | Samir  | Nino
Deige (suite)                     | Lucien | Domba
```
Key classes: `.lead-card` (Deige, 1col×3rows, gold border). Tous les autres = cartes régulières.

## Deck cards (Services Gold)
Split layout: `grid-template-columns: 280px 1fr`. Left = `.deck-card-img`, right = `.deck-card-body`. `.card-veil { display: none }`.

## Images used
### Local files
- `assets/img/legal/contractuel.png` — business hexagon collage
- `assets/img/legal/famille.png` — family in football jerseys (image #22 from session)
- `assets/img/pillars/protections.png` — Code du travail consultation

### Unsplash (in HTML via CDN URLs)
- Legal - Protection intérêts: `photo-1517048676732-d65bc937f952` (meeting table)
- Legal - Famille: currently `photo-1557176278-3326a3193580` (man+boy seashore) OR local file
- Legal - Démarches nationales: `photo-1436491865332-7a61a109cc05` (airplane)
- Legal - Prévention conseil: `photo-1454165804606-c3d57bc86b40`
- Legal - Transmission: `photo-1516321318423-f06f85e504b3`
- Deck - Gestion carrière: `photo-1560272564-c83b66b1ad12` (handshake)
- Deck - Conciergerie: `photo-1724230758718-406bab979e67` (hotel reception)
- Deck - Data: `photo-1434494878577-86c23bcb06b9` (Apple Watch)
- Deck - Marketing: `photo-1460925895917-afdab827c52f`

## Dev
```
npm run dev    # vite dev server (port auto-assigned if 5173 busy)
npm run build  # vite build
```

## Deploy
Netlify. Env vars needed: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (fazernino@gmail.com), `RESEND_FROM_EMAIL` (onboarding@resend.dev).

## Design decisions (DO NOT revert without asking)
- Deck cards: split layout chosen over header-strip and full-bg overlay (user tested all 3)
- Team grid: 3-col, Deige lead-card, Lucien tall-card, Domba wide-card — exact layout confirmed
- section-veil::after uses --ink at edges for smooth section blending
- Services Gold ::before has diagonal gold line texture
- Alternating sections: qui-sommes-nous + contact use navy base; notre-mission uses brighter mid-navy

## Banned
- DO NOT use iStock or 123RF images (watermarked)
- DO NOT revert deck card split layout
- DO NOT add gradient text or glassmorphism
