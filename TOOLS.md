# Stack outils — Design & Frontend immersif

## Skills Claude Code

### `frontend-design` (Anthropic)
Force des choix esthétiques intentionnels avant de coder — direction visuelle (luxury, brutalism, maximalism…), typographie, palette, motion. Évite le look générique IA. Supporte HTML/CSS/JS, React, Vue. 678K installs.
```bash
npx skills add "https://github.com/anthropics/skills" --skill frontend-design -g -y
```

### `impeccable`
Design prod-grade avec 20+ commandes spécialisées : `/craft` (construire), `/animate` (motion), `/polish` (finitions), `/critique` (audit), `/colorize` (palette), `/typeset` (typo). Bloque les anti-patterns (glassmorphism, gradient text, side-stripe). Génère du vrai code engagé. 197K installs.
```bash
npx skills add "https://github.com/pbakaus/impeccable" --skill impeccable -g -y
```

### `taste-skill` (leonxlnx)
14 skills design focalisés sur l'esthétique haute gamme. Couvre : design-to-code, redesign de projets existants, brand kit, interfaces mobile/web, styles minimalist et brutalist industriel. 2.4M installs au total.
```bash
npx skills add "https://github.com/leonxlnx/taste-skill" -g -y
```

### `ui-ux-pro-max`
Base de données design locale : 84 styles visuels, 192 palettes couleur, 74 font pairings, 99 règles UX. Multi-stack (React, Vue, Svelte, HTML/CSS, mobile). Référence pour choisir une direction visuelle ou valider des décisions design. 273K installs.
```bash
npx skills add "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" --skill ui-ux-pro-max -g -y
```

### `gsap` (heygen-com/hyperframes)
Skill GSAP pour HyperFrames — framework open source qui convertit HTML/CSS/animations en vidéos MP4 déterministes. Couvre timelines GSAP, CSS keyframes, Anime.js, WAAPI, FLIP, SVG morph. Utilisable en local (CLI) indépendamment de HeyGen. 93K installs.
```bash
npx skills add "https://github.com/heygen-com/hyperframes" --skill gsap -g -y
```

### `superpowers` (obra)
Bundle de 14 skills workflow : brainstorming, parallel agents, plans, debugging systématique, TDD, git worktrees, code review, vérification avant completion. Améliore la façon dont l'agent structure et exécute les tâches complexes.
```bash
npx skills add "https://github.com/obra/superpowers" -g -y
```

### `gstack` (garrytan — Y Combinator)
62 skills couvrant tout le cycle dev : `review`, `qa`, `ship`, `plan-ceo-review`, `plan-eng-review`, `design-review`, `design-html`, `land-and-deploy`, `benchmark`, `scrape`. Créé par Garry Tan (CEO Y Combinator). 30K installs.
```bash
npx skills add "https://github.com/garrytan/gstack" -g -y
```

### `claude-mem` (thedotmack)
Mémoire persistante entre sessions. Capture tout ce que l'agent fait, compresse avec IA, injecte le contexte pertinent dans les sessions suivantes. Search naturel dans l'historique projet. Balise `<private>` pour exclure données sensibles. Web UI temps réel. Compatible Claude Code, Codex, Gemini, Copilot.
```bash
npx claude-mem install
```
Ou via plugin :
```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

---

## Plugins officiels Claude

### `security-guidance` (claude-plugins-official)
Guidance sécurité intégrée dans l'agent. Pertinent pour tout projet avec auth, données sensibles, APIs exposées. Plugin officiel Anthropic.
```
claude plugin install security-guidance@claude-plugins-official
```

---

## Skills built-in Claude Code (aucune install)

- `/review` — code review PR
- `/security-review` — audit sécurité du code (pertinent pour tout projet)
- `/init` — génère CLAUDE.md documentant le projet

---

## MCP Servers

### `@21st-dev/magic`
Banque de composants UI avec recherche sémantique. Installe composants + dépendances directement dans le projet. Génère des variantes design via IA. Intègre Claude Code, Cursor, Lovable.

Config dans `~/.claude/mcp.json` :
```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "ta_clé_ici"
      }
    }
  }
}
```
Clé API : 21st.dev → Settings → API Keys

---

## Libs npm — sites immersifs

| Lib | Rôle | Usage |
|-----|------|-------|
| **GSAP + ScrollTrigger** | Animations haute perf pilotées au scroll | Vanilla JS / React |
| **Lenis** | Smooth scroll inertiel | Vanilla JS / React |
| **Framer Motion** | Animations déclaratives React | React uniquement |
| **Three.js** | WebGL / 3D dans le browser | Vanilla JS / React |
| **Spline** | Scènes 3D interactives exportables web | Embed ou React |
| **Rive** | Animations interactives légères avec états | Vanilla / React / iOS |

> Framer Motion = React only. Pour site vanilla, GSAP reste la référence.

---

## Fichiers de référence projet

### `DESIGN.md`
À créer dans chaque projet. Contient : palette de couleurs (tokens CSS), font pairings, règles de spacing, composants définis, contraintes visuelles. Utilisé par `impeccable` et `frontend-design` pour garder la cohérence entre sessions.

### `awesome design.md`
Fichier de références visuelles externes — sites, portfolios, motion design, typographie. Sert d'inspiration ancrable pour orienter le style du projet.
