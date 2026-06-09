Muskle's signature control: pill tabs with a mint indicator that **slides** between selections. Use for top nav and for filter rows (categories, block types).

```jsx
const [tab, setTab] = React.useState('all');
<SegmentedTabs
  value={tab}
  onChange={setTab}
  segments={[
    { value: 'all', label: 'Tous' },
    { value: 'gainage', label: 'Gainage' },
    { value: 'cuisses', label: 'Cuisses & Fessiers' },
  ]}
/>
```

Notes:
- Controlled: you own `value` + `onChange`.
- Pass a Lucide icon via `segment.icon` for nav items.
- `fullWidth` makes tabs share the row equally (good for a 2–3 option toggle).
- The sliding pill is the brand motion signature — don't replace it with a static highlight.
