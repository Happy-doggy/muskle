// Muskle UI kit — Exercises list screen with category filter.
function ExercisesScreen() {
  const { Icon, PageHeader } = window.MuskleKit;
  const { SegmentedTabs, CategoryBadge } = window.MuskleUI;
  const D = window.MuskleData;
  const [group, setGroup] = React.useState('Tous');

  const filtered = group === 'Tous' ? D.exercises : D.exercises.filter((e) => e.category === group);

  return (
    <div>
      <PageHeader title="Exercices" count={filtered.length} noun="exercice" />

      <div style={{ marginBottom: 24, overflowX: 'auto' }} className="scrollbar-hide">
        <SegmentedTabs
          value={group}
          onChange={setGroup}
          segments={D.muscleGroups.map((g) => ({ value: g, label: g }))}
        />
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map((ex) => (
          <div key={ex.id} className="list-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 56, height: 56, background: 'var(--accent)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="dumbbell" size={20} color="rgba(255,255,255,0.7)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--ink)', margin: 0 }}>{ex.name}</h3>
                <CategoryBadge category={ex.cat} size="sm" />
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'color-mix(in srgb, var(--ink) 60%, transparent)', margin: '0 0 4px' }}>{ex.description}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'color-mix(in srgb, var(--ink) 40%, transparent)', margin: 0, fontFamily: 'var(--font-mono)' }}>{D.formatDefaults(ex)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.ExercisesScreen = ExercisesScreen;
