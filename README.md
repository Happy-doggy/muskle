# Muskle

**A personal home workout app for strength training, yoga, and physical therapy exercises.**

🌐 [muskle.club](https://www.muskle.club)

---

## What is Muskle?

Muskle is a web app I built for myself to plan and track home workout sessions. It covers strength training, yoga, and physical therapy exercises — the three practices I combine in my weekly routine.

The app lets you:
- Browse a curated exercise catalog with illustrations and video guidance
- Build custom workout blocks (straight sets or circuits)
- Run sessions with a built-in player and rest timer
- Track your history and progress over time

No subscription. No noise. Just training.

---

## Why I built it

I'm a Product Designer. I work with founders and product & tech teams on product creation and redesign — but I've always believed that the best designers are the ones who ship.

Muskle is my sandbox for that. A real product, with real users (starting with me), where every decision — from data architecture to deployment — is mine to make and learn from.

It's also an honest reflection of how the role of Product Designer is evolving: understanding systems, making technical tradeoffs, and building end-to-end, not just designing screens.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript (strict) |
| UI | Tailwind CSS + ShadCN/UI + Lucide React |
| State | Zustand |
| Routing | React Router v6 |
| Animation | Framer Motion |
| Drag & drop | dnd-kit |
| Auth | Firebase Authentication (Google + Magic Link) |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Functions | Firebase Cloud Functions v2 |
| Hosting | Vercel |
| Email | Brevo |
| IDE | Cursor |

---

## Architecture principles

- **Storage adapter pattern** — Firestore is never called directly from components. All data access goes through a `StorageAdapter` interface, making the backend swappable without touching UI code.
- **Centralized exercise catalog** — exercises are managed by the admin back-office and served from Firestore, not hardcoded in the app.
- **Admin back-office** — a protected `/admin` route for managing the exercise catalog (full CRUD with image/video upload) and monitoring user acquisition metrics.
- **No direct localStorage in components** — enforced via `.cursorrules`.

---

## Project structure

```
src/
├── components/       # UI components
│   └── admin/        # Back-office components
├── config/           # App-level constants
├── firebase/         # Firebase init + user tracking
├── hooks/            # Custom React hooks
├── pages/            # Route-level pages
│   └── admin/        # Back-office pages
├── storage/          # StorageAdapter + Firestore adapters
├── types/            # TypeScript types
└── data/             # (deprecated) Static exercise data
functions/
└── src/
    └── index.ts      # Cloud Functions (new user notification)
```

---

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

You'll need a Firebase project with Authentication, Firestore, and Storage enabled. Copy `.env.example` to `.env.local` and fill in your Firebase config and admin UID.

---

## Admin back-office

The back-office is accessible at `/admin` and protected by Firebase UID verification. It includes:

- **Users** — registration date, last login, session count, completed workouts
- **Exercises** — full CRUD with image and video upload to Firebase Storage

---

## Roadmap

- [ ] Multi-device sync polish
- [ ] Exercise filtering by muscle group, equipment, level
- [ ] Session history and progress charts
- [ ] Optional paid tier (TBD)

---

## Legal

Muskle is operated by Thomas RÉAUBOURG (Entrepreneur Individuel, France).
Terms of use and privacy policy are available at [muskle.club/legal](https://www.muskle.club/legal).

---

## About

Built by [Thomas RÉAUBOURG](https://www.linkedin.com/in/thomas-reaubourg) — Product Designer at Lonestone and freelance.
I work with founders and product & tech teams on product creation and redesign.
I write about design, product, and what happens behind the screens.
