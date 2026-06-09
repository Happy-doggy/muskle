// Muskle UI kit — component resolver.
// In the Design System tab the compiled bundle is served, so we use the
// REAL design-system components. Opened standalone (raw preview), the
// underscore-prefixed bundle isn't served — so we fall back to local
// copies of the same primitives. Either way the kit renders identically.
(function () {
  const ns = window.MuskleDesignSystem_f221a0;
  if (ns && ns.Button && ns.SegmentedTabs && ns.TimerRing) {
    window.MuskleUI = ns;
    return;
  }

  // ── Local fallbacks (mirror components/*) ──────────────────────────
  const BTN_VARIANTS = {
    default:     { background: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid transparent' },
    secondary:   { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid transparent' },
    outline:     { background: '#fff', color: 'var(--foreground)', border: '1px solid var(--input)' },
    ghost:       { background: 'transparent', color: 'var(--foreground)', border: '1px solid transparent' },
    destructive: { background: 'var(--destructive)', color: 'var(--destructive-foreground)', border: '1px solid transparent' },
    link:        { background: 'transparent', color: 'var(--primary)', border: '1px solid transparent', textDecoration: 'underline', textUnderlineOffset: '4px' },
  };
  const BTN_SIZES = {
    default: { height: 40, padding: '0 16px', fontSize: 14 },
    sm: { height: 36, padding: '0 12px', fontSize: 14 },
    lg: { height: 44, padding: '0 32px', fontSize: 15 },
    icon: { height: 40, width: 40, padding: 0, fontSize: 14 },
  };
  const BTN_HOVER = { default: 0.9, secondary: 0.8, destructive: 0.9, outline: 1, ghost: 1, link: 1 };

  function Button({ variant = 'default', size = 'default', disabled = false, style, children, ...props }) {
    const [hover, setHover] = React.useState(false);
    const v = BTN_VARIANTS[variant] || BTN_VARIANTS.default;
    const s = BTN_SIZES[size] || BTN_SIZES.default;
    const fillHover = (variant === 'outline' || variant === 'ghost') && hover;
    return (
      <button disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap',
          fontFamily: 'var(--font-sans)', fontWeight: 500, borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.15s ease', opacity: disabled ? 0.5 : hover ? BTN_HOVER[variant] : 1,
          background: fillHover ? 'var(--accent)' : v.background, color: fillHover ? 'var(--accent-foreground)' : v.color,
          border: v.border, textDecoration: v.textDecoration || 'none', textUnderlineOffset: v.textUnderlineOffset, ...s, ...style }}
        {...props}>{children}</button>
    );
  }

  const BADGE_VARIANTS = {
    default: { background: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid transparent' },
    secondary: { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid transparent' },
    destructive: { background: 'var(--destructive)', color: 'var(--destructive-foreground)', border: '1px solid transparent' },
    outline: { background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' },
  };
  function Badge({ variant = 'default', style, children, ...props }) {
    const v = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
    return <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-pill)', padding: '2px 10px',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 600, lineHeight: 1.4, ...v, ...style }} {...props}>{children}</span>;
  }

  const CAT = {
    musculation:  { label: 'Musculation',  color: 'var(--cat-musculation)' },
    renforcement: { label: 'Renforcement', color: 'var(--cat-renforcement)' },
    yoga:         { label: 'Yoga',         color: 'var(--cat-yoga)' },
    kine:         { label: 'Kiné',         color: 'var(--cat-kine)' },
    cardio:       { label: 'Cardio',       color: 'var(--cat-cardio)' },
    mobilite:     { label: 'Mobilité',     color: 'var(--cat-mobilite)' },
    autre:        { label: 'Autre',        color: 'var(--cat-autre)' },
  };
  function CategoryBadge({ category, size = 'md', style, ...props }) {
    const cfg = CAT[category] || CAT.autre;
    const small = size === 'sm';
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 'var(--radius-pill)',
      padding: small ? '0 6px' : '3px 12px', fontFamily: 'var(--font-sans)', fontSize: small ? '10px' : 'var(--text-xs)',
      fontWeight: 600, lineHeight: small ? 1.6 : 1.5, color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 12%, white)`, ...style }} {...props}>{cfg.label}</span>;
  }

  function SegmentedTabs({ segments, value, onChange, fullWidth = false, style }) {
    const containerRef = React.useRef(null);
    const [pill, setPill] = React.useState(null);
    const measure = React.useCallback(() => {
      const c = containerRef.current; if (!c) return;
      const a = c.querySelector('[data-active="true"]'); if (!a) { setPill(null); return; }
      const cr = c.getBoundingClientRect(), ar = a.getBoundingClientRect();
      setPill({ left: ar.left - cr.left, width: ar.width });
    }, []);
    React.useLayoutEffect(() => { measure(); }, [value, segments, fullWidth, measure]);
    React.useEffect(() => { window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure); }, [measure]);
    return (
      <div ref={containerRef} style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4,
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 4, width: fullWidth ? '100%' : 'fit-content', ...style }}>
        {pill && <span aria-hidden style={{ position: 'absolute', top: 4, bottom: 4, left: pill.left, width: pill.width,
          background: 'var(--mint)', borderRadius: 'var(--radius-md)',
          transition: 'left 0.32s cubic-bezier(0.34,1.56,0.64,1), width 0.32s cubic-bezier(0.34,1.56,0.64,1)', zIndex: 0 }} />}
        {segments.map((seg) => {
          const active = seg.value === value;
          return (
            <button key={seg.value} type="button" data-active={active} onClick={() => onChange && onChange(seg.value)}
              style={{ position: 'relative', zIndex: 1, flex: fullWidth ? 1 : 'initial', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 500,
                color: active ? '#fff' : 'var(--muted-foreground)', transition: 'color 0.2s ease', whiteSpace: 'nowrap' }}>
              {seg.icon}{seg.label}
            </button>
          );
        })}
      </div>
    );
  }

  const PHASE_COLORS = { prepare: 'var(--phase-prepare)', work: 'var(--phase-work)', rest: 'var(--phase-rest)', done: 'var(--phase-done)' };
  const PHASE_LABELS = { prepare: 'Préparez-vous', work: 'Go !', rest: 'Repos', done: 'Terminé' };
  function TimerRing({ progress = 0, remaining = 0, phase = 'work', size = 200 }) {
    const radius = (size - 20) / 2;
    const circ = 2 * Math.PI * radius;
    const offset = circ * (1 - Math.max(0, Math.min(1, progress)));
    const color = PHASE_COLORS[phase] || PHASE_COLORS.work;
    const m = Math.floor(remaining / 60), sec = remaining % 60;
    return (
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ring-track)" strokeWidth={8} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-4xl)', fontWeight: 500, color: 'var(--paper)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : String(remaining)}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, marginTop: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color }}>
            {PHASE_LABELS[phase] || ''}
          </span>
        </div>
      </div>
    );
  }

  function Card({ clickable = false, style, children, ...props }) {
    const [hover, setHover] = React.useState(false);
    return <div onMouseEnter={() => clickable && setHover(true)} onMouseLeave={() => clickable && setHover(false)}
      style={{ background: 'var(--card)', color: 'var(--card-foreground)', border: `1px solid ${hover ? 'var(--mint)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', padding: 'var(--space-4)', cursor: clickable ? 'pointer' : 'default', transition: 'border-color 0.2s ease', ...style }} {...props}>{children}</div>;
  }

  window.MuskleUI = { Button, Badge, CategoryBadge, SegmentedTabs, TimerRing, Card };
})();
