// Muskle UI kit — Blocks list screen.
function BlocksScreen() {
  const { PageHeader } = window.MuskleKit;
  const { Badge } = window.MuskleUI;
  const D = window.MuskleData;
  const blocks = D.blocks;

  return (
    <div>
      <PageHeader title="Blocs" count={blocks.length} noun="bloc" />
      <div style={{ display: 'grid', gap: 12 }}>
        {blocks.map((b) => (
          <div key={b.id} className="list-card list-card-clickable">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--ink)', margin: 0 }}>{b.name}</h3>
              <Badge>{b.mode === 'circuit' ? 'Circuit' : 'Liste'}</Badge>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'color-mix(in srgb, var(--ink) 50%, transparent)', margin: 0 }}>
              {b.exercises.length} exercice{b.exercises.length !== 1 ? 's' : ''}
              {b.mode === 'circuit' && b.rounds != null && <span> · {b.rounds} rounds</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
window.BlocksScreen = BlocksScreen;
