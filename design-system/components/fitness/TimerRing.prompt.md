The circular phase countdown at the heart of Muskle's player. Warm track, phase-colored arc, mono time, phase label.

```jsx
<TimerRing progress={0.62} remaining={18} phase="work" size={220} />
```

Notes:
- `phase` sets color + French label: `prepare` (blue, "Préparez-vous"), `work` (orange, "Go !"), `rest` (mint, "Repos"), `done` (violet, "Terminé").
- Drive `progress`/`remaining` from your own timer loop; the arc eases over 1s.
- Lives on the dark player background — center text is light (`--paper`), so keep it on a dark surface for contrast.
