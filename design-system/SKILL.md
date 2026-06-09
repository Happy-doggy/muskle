---
name: muskle-design
description: Use this skill to generate well-branded interfaces and assets for Muskle, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## What is Muskle

Muskle is a local-first, French-language web app for planning and running **home workouts** (strength, bodybuilding, yoga, physio). Users build *exercises* → group them into *blocs* → assemble *séances* → run them in a full-screen *player* with a phase timer. Warm, papery, calm — a coach's notebook, not a loud gym app.

## Map

- `readme.md` — the full design guide: content fundamentals (French, informal `tu`), visual foundations, iconography. **Read this first.**
- `styles.css` — link this one file to get every token, font, and base utility class.
- `tokens/` — colors, typography, spacing, base element styles.
- `guidelines/*.card.html` — visual specimens (color, type, spacing, brand).
- `components/` — React primitives (`Button`, `Badge`, `Card`, `Input`, `SegmentedTabs`, `CategoryBadge`, `TimerRing`). Each has a `.prompt.md` with usage.
- `ui_kits/muskle/` — full click-through app recreation; copy screens as a starting point.
- `assets/` — `muskle-logo.svg`, `favicon.png`.

## Rules of thumb

- One brand color: **mint `#4BA278`**, for actions + active state only. Canvas is warm cream `#FDF5EF`, never white; cards are white with hairline borders, no shadows.
- Type: **Outfit** (display) / **Host Grotesk** (UI) / **JetBrains Mono** (timers).
- Icons: **Lucide**, 2px stroke, nothing else. Emoji only the single 🎉 finish moment.
- Copy is French, informal `tu`, sentence case, encouraging but plain.
- Motion: the sliding-pill segmented control is the signature; keep entrances short.
