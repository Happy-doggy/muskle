White card surface — the base container for every list item in Muskle. Hairline border, soft 10px corners, flat (no shadow).

```jsx
<Card clickable>
  <CardTitle>Gainage de base</CardTitle>
  <CardDescription>3 exercices · 3 rounds</CardDescription>
</Card>
```

Notes:
- `clickable` adds the signature mint hover-border for tappable rows.
- Keep cards flat — reserve shadows for dialogs/popovers only.
- Cards sit in white on the cream `--background`; don't nest a card on a card.
