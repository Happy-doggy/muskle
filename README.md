# FitPlanner

Application web pour planifier et réaliser des séances de sport à la maison — renforcement musculaire, musculation, yoga, kiné.

## Fonctionnalités

- **Exercices** : bibliothèque personnelle avec titre, description, catégorie, image/vidéo optionnelle
- **Blocs** : groupes d'exercices (série, circuit, tabata, AMRAP, EMOM) avec configuration des séries/répétitions/durées et temps de repos
- **Séances** : composition de séances en assemblant des blocs
- **Player** : lecteur de séance plein écran avec minuteur (préparation → exercice → repos), navigation et progression visuelle

## Stack technique

| Outil | Rôle |
|-------|------|
| React 18 + Vite | Framework + bundler |
| TypeScript | Typage strict |
| Zustand | State global |
| React Router v6 | Navigation |
| Tailwind CSS | Styles |
| dnd-kit | Drag & drop |
| Framer Motion | Animations player |
| localStorage | Stockage (swappable → Supabase) |

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Démarrage

```bash
# Cloner le repo
git clone https://github.com/TON_USERNAME/fitplanner.git
cd fitplanner

# Installer les dépendances
npm install

# Lancer en dev
npm run dev
```

L'app est disponible sur `http://localhost:5173`

### Build production

```bash
npm run build
npm run preview  # pour tester le build localement
```

## Structure du projet

```
src/
├── components/
│   ├── exercises/     # Composants CRUD exercices
│   ├── blocks/        # Composants CRUD blocs
│   ├── sessions/      # Composants CRUD séances
│   ├── player/        # Composants du lecteur
│   └── ui/            # Composants partagés (Layout, TimerRing, CategoryBadge…)
├── hooks/
│   ├── useTimer.ts          # Timer et gestion des phases
│   └── useSessionPlayer.ts  # Logique du player (steps, navigation)
├── pages/
│   ├── ExercisesPage.tsx
│   ├── BlocksPage.tsx
│   ├── SessionsPage.tsx
│   └── PlayerPage.tsx       # Plein écran, sans navigation
├── store/
│   └── index.ts             # Store Zustand (CRUD + actions)
├── storage/
│   ├── localStorage.ts      # Adapter localStorage
│   └── index.ts             # Point d'entrée (swapper ici pour changer de backend)
└── types/
    └── index.ts             # Tous les types TypeScript
```

## Données & stockage

Les données (exercices, blocs, séances) sont stockées dans le `localStorage` du navigateur sous les clés :
- `fitplanner:exercises`
- `fitplanner:blocks`
- `fitplanner:sessions`

### Backup / export

> À implémenter en Phase 6 — un bouton "Exporter" générera un fichier JSON téléchargeable.

### Migrer vers Supabase (futur)

1. Créer `src/storage/supabase.ts` qui implémente l'interface `StorageAdapter`
2. Dans `src/storage/index.ts`, remplacer `localStorageAdapter` par `supabaseAdapter`
3. Rien d'autre à toucher dans l'app ✓

## Upload d'images/vidéos

Dépose tes fichiers dans `public/uploads/` et référence-les dans les exercices avec le chemin `/uploads/mon-fichier.jpg`.

> ⚠️ `public/uploads/` est dans `.gitignore` — les médias ne sont pas versionnés.

## Déploiement

### GitHub Pages (gratuit)

```bash
npm install --save-dev gh-pages

# Dans package.json, ajouter :
# "homepage": "https://TON_USERNAME.github.io/fitplanner",
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

npm run deploy
```

### Vercel (recommandé, gratuit)

1. Connecte ton repo GitHub à [vercel.com](https://vercel.com)
2. Framework preset : **Vite**
3. Deploy — c'est tout.

## Roadmap

- [x] Phase 1 — Fondations (types, store, storage, router, player)
- [ ] Phase 2 — CRUD exercices (formulaire, upload image/vidéo)
- [ ] Phase 3 — CRUD blocs (drag & drop exercices)
- [ ] Phase 4 — CRUD séances (assemblage blocs)
- [ ] Phase 5 — Polish player (sons, animations Framer Motion)
- [ ] Phase 6 — Export/Import JSON, PWA

## Licence

MIT — usage personnel et open source.

---

## ShadCN/ui

Ce projet utilise [ShadCN/ui](https://ui.shadcn.com/) pour les composants UI.

### Ajouter un composant ShadCN

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add card
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add progress
npx shadcn@latest add label
```

Les composants sont copiés dans `src/components/ui/` — tu les possèdes et peux les modifier.

### Composants recommandés pour FitPlanner

| Composant | Usage |
|-----------|-------|
| `Button` | Actions principales et secondaires |
| `Input` + `Label` | Formulaires exercices/blocs/séances |
| `Dialog` | Modals de création/édition |
| `Card` | Cartes exercices, blocs, séances |
| `Select` | Sélection catégorie, type de bloc |
| `Badge` | Catégories d'exercices |
| `Progress` | Barre de progression du player |
| `Separator` | Séparateurs dans les listes |
| `Tooltip` | Aide contextuelle |

### Initialisation complète (première fois)

```bash
npm install
npx shadcn@latest add button input label card dialog select badge separator tooltip progress
npm run dev
```
