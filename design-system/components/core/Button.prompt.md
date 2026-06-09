The mint action button for Muskle — primary actions, with `outline` / `ghost` / `secondary` / `destructive` / `link` variants and `sm`/`default`/`lg`/`icon` sizes.

```jsx
<Button>Lancer</Button>
<Button variant="outline">Ajouter</Button>
<Button variant="ghost" size="sm">Annuler</Button>
<Button variant="destructive">Supprimer</Button>
```

Notes:
- `default` = mint fill (the brand action). Use **one** per view.
- `outline` is the workhorse for "Ajouter" headers — white fill, hairline border, mint-tint on hover.
- Pair with a Lucide icon as the first child (`<Plus size={16} />`) — gap is handled.
- Hover drops opacity (0.9 default / 0.8 secondary); disabled = 50% + no pointer.
