// Muskle UI kit — Sessions list screen.
function SessionsScreen({ onPlay }) {
  const { Icon, PageHeader } = window.MuskleKit;
  const D = window.MuskleData;
  const sessions = D.sessions;

  return (
    <div>
      <PageHeader title="Séances" count={sessions.length} noun="séance" />
      <div style={{ display: 'grid', gap: 12 }}>
        {sessions.map((s) => (
          <div key={s.id} className="list-card list-card-clickable"
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>{s.name}</h3>
              {s.description && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'color-mix(in srgb, var(--ink) 60%, transparent)', margin: '0 0 8px' }}>{s.description}</p>
              )}
              <ol style={{ fontSize: 'var(--text-sm)', color: 'color-mix(in srgb, var(--ink) 50%, transparent)', margin: 0, paddingLeft: 18 }}>
                {s.blockIds.map((bid) => (
                  <li key={bid} style={{ marginBottom: 2 }}>{D.blockById(bid)?.name || bid}</li>
                ))}
              </ol>
            </div>
            <button onClick={() => onPlay(s.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: 'var(--accent-foreground)',
                padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontWeight: 500, fontFamily: 'var(--font-sans)',
                border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <Icon name="play" size={14} />Lancer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
window.SessionsScreen = SessionsScreen;
