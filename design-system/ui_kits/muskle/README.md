# Muskle — App UI kit

A high-fidelity, click-through recreation of the Muskle web app, built from the production source (`Happy-doggy/muskle`). It composes the design-system primitives — it does not re-implement them.

## Run it

Open `index.html`. It boots the full app shell:

- **Séances** — list of sessions, each with its blocks and a mint **Lancer** button.
- **Blocs** — list of blocks with a Circuit / Liste badge and exercise count.
- **Exercices** — exercise catalog with the sliding-pill muscle-group filter.
- **Player** — click **Lancer** on any session to enter the full-screen runner: phase timer ring (prepare → work → rest), session progress bar, prev/next + play/pause, and the "Séance terminée !" finish screen. The timer actually counts down.

## Files

| File | Role |
|------|------|
| `index.html` | Loads React, Babel, Lucide, the DS bundle, then the screens. |
| `data.js` | Seed exercises / blocks / sessions + the `buildSteps()` player flattener (mirrors `src/data`). |
| `kit.jsx` | Shared `Icon` (Lucide), `Header` (logo + sliding nav), `PageHeader`. |
| `SessionsScreen.jsx` | Sessions list + Lancer. |
| `BlocksScreen.jsx` | Blocks list. |
| `ExercisesScreen.jsx` | Exercise catalog + category filter. |
| `PlayerScreen.jsx` | Full-screen timed player + finish screen. |
| `App.jsx` | Route state; swaps the player in full-screen. |

## Components used from the design system

`Button`, `Badge`, `Card`, `CategoryBadge`, `SegmentedTabs`, `TimerRing` — pulled from `window.MuskleDesignSystem_f221a0` via the compiled `_ds_bundle.js`. Tokens and the `.list-card` / `.scrollbar-hide` utilities come from `styles.css`.

## Fidelity notes

- This is a cosmetic recreation: CRUD forms, drag-and-drop block editing, and sound cues from the real app are intentionally out of scope. The four core views and the player loop are faithful to the source.
- Exercise thumbnails use the app's fallback (a mint tile + dumbbell glyph) since the repo ships no bundled media.
