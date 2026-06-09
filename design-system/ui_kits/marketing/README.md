# Muskle — Marketing landing page

A single-page marketing site presenting Muskle through its benefits and features. Built entirely on the design system (`styles.css` tokens, Lucide icons, the logo) — warm cream canvas, one mint accent, Outfit/Host Grotesk type, flat hairline cards.

## Open it

`index.html` — a self-contained static page (no build step). Sections, in order:

1. **Header** — logo, anchor nav, mint "Commencer" CTA (links to the app kit).
2. **Hero** — headline + value prop with a tilted phone mockup of the Séances screen.
3. **Benefits** — four quick value cards (bibliothèque, blocs, séances, player).
4. **Fonctionnalités** — three alternating feature rows (Exercices, Blocs, Séances) each with an on-brand mock panel.
5. **Le player** — a dark (ink) showcase band with a recreated timer ring.
6. **Comment ça marche** — three numbered steps.
7. **Types de blocs** — Série / Circuit / Tabata / AMRAP / EMOM with the category-hued badges.
8. **CTA** — mint call-to-action band.
9. **Footer**.

## Notes

- **French, informal `tu`**, sentence case — matches the product's voice.
- App mockups are lightweight HTML/CSS recreations (phone frame, timer ring) styled with the design-system tokens — no external images, fully offline.
- "Commencer" / "Ouvrir Muskle" buttons link to `../muskle/index.html` (the app UI kit).
- Responsive: collapses to single-column and hides the anchor nav under ~920px.
