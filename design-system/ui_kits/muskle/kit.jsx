// Muskle UI kit — shared helpers (Icon + Header). Attaches to window.
const { SegmentedTabs } = window.MuskleUI;

/** Lucide icon — renders an inline SVG via the lucide UMD global. */
function Icon({ name, size = 16, color, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    host.appendChild(i);
    window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': 2 } });
  }, [name, size]);
  return <span ref={ref} style={{ display: 'inline-flex', color: color || 'currentColor', ...style }} />;
}

/** App header — logo + sliding-pill nav. */
function Header({ route, onNavigate }) {
  const segments = [
    { value: 'sessions', label: 'Séances', icon: <Icon name="calendar-days" size={16} /> },
    { value: 'blocks', label: 'Blocs', icon: <Icon name="layers" size={16} /> },
    { value: 'exercises', label: 'Exercices', icon: <Icon name="dumbbell" size={16} /> },
  ];
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'color-mix(in srgb, var(--background) 95%, transparent)',
      backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 16px',
        height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => onNavigate('sessions')} aria-label="Muskle"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'inline-flex', padding: 0 }}>
          <img src="../../assets/muskle-logo.svg" alt="Muskle" style={{ height: 28, width: 'auto' }} />
        </button>
        <SegmentedTabs segments={segments} value={route} onChange={onNavigate} />
      </div>
    </header>
  );
}

/** Page heading row with title, count line, and an "Ajouter" action. */
function PageHeader({ title, count, noun }) {
  const { Button } = window.MuskleUI;
  const plural = count !== 1 ? 's' : '';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--ink)', margin: 0 }}>{title}</h1>
        <p style={{ color: 'color-mix(in srgb, var(--ink) 50%, transparent)', fontSize: 'var(--text-sm)', margin: '4px 0 0' }}>
          {count} {noun}{plural}
        </p>
      </div>
      <Button variant="outline"><Icon name="plus" size={16} />Ajouter</Button>
    </div>
  );
}

window.MuskleKit = { Icon, Header, PageHeader };
