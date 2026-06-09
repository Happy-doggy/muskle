# Muskle — Design System

> **Muskle** is a local-first web app for planning and running **home workouts** — strength training, bodybuilding, yoga, and physio. You build a personal library of *exercises*, group them into *blocks* (series, circuit, AMRAP, EMOM, Tabata), assemble blocks into *sessions* (séances), and run them in a full-screen *player* with a phase timer (prepare → work → rest). Everything is stored in the browser (localStorage), with a swappable adapter to move to a backend later.

The product is **French-language**, warm and low-key — a personal coach's notebook, not a loud commercial fitness app.

---

## Sources

This system was reverse-engineered from the production codebase:

- **GitHub:** https://github.com/Happy-doggy/muskle — `main` branch (React 18 + Vite + TypeScript, Tailwind CSS, ShadCN/ui, Zustand, React Router, dnd-kit, Framer Motion, Lucide icons).

Explore that repository for the source of truth: the live theme lives in `src/index.css` and `tailwind.config.js`; UI primitives are in `src/components/ui/`; the four screens are in `src/pages/`. Reading it will let you build new Muskle surfaces with higher fidelity than this guide alone.

---

## Index — what's in this folder

| Path | What it is |
|------|------------|
| `styles.css` | Global entry point — link this one file. `@import`s only. |
| `tokens/fonts.css` | Google Fonts import (Outfit, Host Grotesk, JetBrains Mono). |
| `tokens/colors.css` | Color custom properties — brand, semantic, category, phase. Light + `.dark`. |
| `tokens/typography.css` | Font families, type scale, weights, tracking. |
| `tokens/spacing.css` | Spacing grid, radii, layout sizes, shadows. |
| `tokens/base.css` | Base element styles + shared utility classes (`.list-card`, `.tab`, `.category-badge`…). |
| `assets/` | `muskle-logo.svg` (wordmark), `favicon.png`. |
| `guidelines/*.card.html` | Foundation specimen cards (Type, Colors, Spacing, Brand). |
| `components/` | Reusable React primitives (Button, Badge, CategoryBadge, Card, Input, SegmentedTabs, TimerRing…). |
| `ui_kits/muskle/` | Full-screen click-through recreation of the app (Sessions, Blocks, Exercises, Player). |
| `SKILL.md` | Agent-Skills manifest for using this system in Claude Code. |

---

## Content fundamentals

**Language.** All UI copy is **French**. Keep it French unless asked otherwise. Use proper accents (é, è, à, ç) and the apostrophe in contractions (`d'exercices`, `tu l'as fait`).

**Voice — second person, informal `tu`.** Muskle speaks to one person, their coach in their pocket. It uses **tutoiement** throughout: *"Compose **ta** première séance"*, *"**Crée**-en un et ajoute **tes** exercices"*, *"Bravo, **tu** l'as fait."* Never the formal *vous*.

**Tone.** Encouraging but never hype. Short, plain, action-first. Empty states explain *what the thing is* then *what to do next* in one or two sentences. Celebration is understated — a single *"Séance terminée !"* with *"Bravo, tu l'as fait."*

**Casing.** Sentence case everywhere — page titles (*Séances*, *Blocs*, *Exercices*), buttons (*Ajouter*, *Lancer*, *Suivant*, *Arrêter*, *Recommencer*, *Terminer*). The only ALL-CAPS is tiny eyebrow/meta labels in the player (block name, phase label *GO !*, *REPOS*), set with wide letter-spacing.

**Numbers & units.** Compact and metric. Reps and seconds read like coach shorthand: *"30s × 3 séries"*, *"12 reps × 4 séries"*, *"3 rounds"*, *"45 min environ"*. Timer counts plain seconds, then `m:ss` past a minute, always tabular/mono.

**Pluralization.** Hand-rolled French plurals with the trailing-s pattern: *"{n} séance{s}"*, *"{n} bloc{s}"*, *"{n} exercice{s}"*.

**Emoji.** Almost never. The one exception in the codebase is a single 🎉 on the workout-complete screen. Don't sprinkle emoji into normal UI — it's a deliberate one-off reward moment.

**Domain vocabulary.** *Séance* (session/workout), *Bloc* (group of exercises), *Exercice*, *Série* (set), *Reps*, *Repos* (rest), *Round*, *Circuit*, *Tabata*, *AMRAP*, *EMOM*, *Gainage* (core), *Préparez-vous* / *Go !* / *Repos* / *Terminé* (timer phases). Muscle-group filters use French anatomy: *Cuisses & Fessiers*, *Ischio-jambiers*, *Pectoraux*, *Épaules*, *Dos*, *Mollets*.

---

## Visual foundations

**The vibe.** Warm, papery, calm. Muskle reads like a well-set printed training journal: a cream page, near-black ink, soft-rounded white cards with hairline borders, and exactly **one** brand color — a confident **mint green** — reserved for actions and the active state. It is deliberately *not* a neon, gradient-heavy gym app.

**Color.**
- **Canvas** is warm cream `#FDF5EF` (`--background`), never pure white. Cards sit *on top* in pure white `#FFFFFF` so they lift gently off the page.
- **Ink** is `#0F0F0F` — near-black, soft. Secondary text is the same ink at reduced opacity (`text-ink/50`, `/60`) rather than a separate gray, which keeps everything harmonious on the warm ground.
- **Mint** `#4BA278` is the single brand color: primary buttons, active tab pill, `Lancer`/`Play`, focus ring, hover border on cards. Used sparingly and confidently.
- **Category hues** are earthy and muted, one per discipline — musculation `#E85D4A`, renforcement `#E8963C`, yoga `#6BAE8E`, kiné `#5B8EC4`, cardio `#D4604A`, mobilité `#9B7BB8`, autre `#8A9BA8`. They appear as *tinted* chips (`bg-{cat}/10 text-{cat}`), never as solid fills in lists.
- **Player phases** carry their own semantic colors so the runner is glanceable: prepare = blue `#5B8EC4`, work = orange `#E8603C`, rest = mint `#4BA278`, done = violet `#9B7BB8`, over a warm timer-ring track `#F6D5BC`.
- **Dark mode** exists (`.dark` + the full-screen player): near-black `#121212` ground, `#F2F0ED` paper text, same mint accent.

**Type.** Three families: **Outfit** for display/headings (rounded, friendly, athletic — all `h1/h2/h3`), **Host Grotesk** for body & UI (neutral, legible), **JetBrains Mono** for the timer and any tabular numerics. Page titles are `font-display` ~30px; card titles `font-medium`; meta/labels small with `text-ink/50`. Numbers in the timer are large mono with `tabular-nums`.

**Spacing & layout.** 4px base grid. Content lives in a centered `max-w-4xl` (896px) column with `px-4` gutters and `py-8` vertical rhythm. The header is a 56px sticky bar. Lists are vertical stacks with `gap-3`; cards pad `p-4` (lists) to `p-6` (rich cards).

**Corners & borders.** Base radius **10px** (`--radius`, `0.625rem`) on cards, inputs, buttons. Chips and nav pills are fully rounded (pill). Borders are hairline (1px) in the very light `--stroke` `#F7EDE5`; on hover a card's border becomes mint. Borders — not shadows — define most surfaces.

**Elevation.** Mostly flat. Shadows are reserved for genuinely floating layers (dialogs, popovers, selects). No drop shadows on list cards.

**Backgrounds.** Flat warm color. No gradients, no photographic hero imagery, no repeating textures or patterns. Exercise thumbnails (when present) are small rounded photos inside cards; absent, a mint rounded tile with a Lucide dumbbell glyph stands in.

**Animation & motion.** Quick and spring-y, never bouncy-cartoonish. The signature motion is the **sliding tab pill** — a `framer-motion` shared-layout `layoutId` pill that glides between the active tab/nav item (`spring`, stiffness 400, damping 32). Entrances are short: `fade-in` 0.2s, `slide-up` 0.3s (12px rise). The timer ring animates its `stroke-dashoffset` linearly over 1s and cross-fades phase color over 0.4s.

**Interaction states.**
- **Hover:** primary/accent buttons drop opacity to ~0.9; secondary to ~0.8; ghost/outline fill with the accent tint; cards shift their border to mint; inactive tabs get a translucent mint wash.
- **Press / active:** player control buttons scale down (`active:scale-95`). No color inversion.
- **Focus:** 2px mint ring offset 2px from the element (`--ring`), standard ShadCN focus treatment.
- **Disabled:** 50% opacity, pointer events off.

**Transparency & blur.** Used in two places only: the sticky header (`color-mix` of the background at 95% + `backdrop-blur`), and category chips (10% tint of the hue). Otherwise surfaces are opaque.

---

## Iconography

- **System:** [**Lucide**](https://lucide.dev) (`lucide-react` in the app), the only icon set. Clean, consistent **2px stroke**, rounded line caps — it pairs naturally with Outfit's rounded display face.
- **Sizing:** small and functional — `16px` in nav/buttons, `14px` inline in pills, `20–28px` for player transport controls, `32px` for empty-state glyphs.
- **Color:** icons inherit `currentColor`; in lists they sit at reduced ink opacity, on mint buttons they're white.
- **Icons in use:** `CalendarDays` (Séances), `Layers` (Blocs), `Dumbbell` (Exercices / placeholder), `Plus` (add), `Play` / `Pause` (player), `SkipForward`, `ChevronLeft` / `ChevronRight` (navigate steps), `RotateCcw` (restart).
- **In this design system,** load Lucide from CDN: `<script src="https://unpkg.com/lucide@latest"></script>` then `lucide.createIcons()`, or use named SVGs. Match the 2px stroke. **Do not** substitute another icon set or hand-draw glyphs.
- **Emoji as icon:** only the single 🎉 on the finished-workout screen. Don't introduce others.
- **Logo:** `assets/muskle-logo.svg` — a single-path wordmark (the muscly "muskle" lettering) that renders in `currentColor`, so it inherits ink on cream and flips to paper on dark. ~28px tall in the header.

---

## Substitutions & notes

- **Fonts** load from Google Fonts (the production app does the same via `<link>`); no local font binaries are bundled. If you need fully offline assets, download Outfit / Host Grotesk / JetBrains Mono and add `@font-face` rules.
- **Icons** are linked from the Lucide CDN rather than vendored, matching the app's `lucide-react` dependency.
