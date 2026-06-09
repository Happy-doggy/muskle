// Muskle UI kit — full-screen session player with live timer.
function PlayerScreen({ sessionId, onExit }) {
  const { Icon } = window.MuskleKit;
  const { TimerRing } = window.MuskleUI;
  const D = window.MuskleData;
  const session = D.sessions.find((s) => s.id === sessionId);
  const steps = React.useMemo(() => D.buildSteps(session), [sessionId]);

  const [idx, setIdx] = React.useState(0);
  const [remaining, setRemaining] = React.useState(steps[0]?.duration || 0);
  const [running, setRunning] = React.useState(true);
  const [finished, setFinished] = React.useState(false);

  const step = steps[idx];
  const hasReps = step && step.phase === 'work' && step.reps != null;

  const goNext = React.useCallback(() => {
    setIdx((i) => {
      if (i >= steps.length - 1) { setFinished(true); return i; }
      return i + 1;
    });
  }, [steps.length]);
  const goPrev = () => setIdx((i) => Math.max(0, i - 1));

  // Reset timer on step change
  React.useEffect(() => {
    if (!step) return;
    setRemaining(step.duration || 0);
    setRunning(!hasReps && (step.duration || 0) > 0);
  }, [idx]);

  // Tick
  React.useEffect(() => {
    if (!running || hasReps || !step) return;
    if (remaining <= 0) { goNext(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [running, remaining, hasReps, step, goNext]);

  const PHASE = { prepare: 'var(--phase-prepare)', work: 'var(--phase-work)', rest: 'var(--phase-rest)', done: 'var(--phase-done)' };

  if (finished) {
    return (
      <div style={{ minHeight: '100%', background: 'var(--ink)', color: 'var(--paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: 24 }}>
        <div style={{ textAlign: 'center' }} className="animate-slide-up">
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', margin: '0 0 8px' }}>Séance terminée&nbsp;!</h1>
          <p style={{ color: 'rgba(242,240,237,0.5)', margin: 0 }}>Bravo, tu l'as fait.</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => { setIdx(0); setFinished(false); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 'var(--radius)', border: '1px solid rgba(242,240,237,0.2)', background: 'transparent', color: 'rgba(242,240,237,0.7)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Icon name="rotate-ccw" size={16} />Recommencer
          </button>
          <button onClick={onExit}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--accent)', color: 'var(--accent-foreground)', cursor: 'pointer', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
            Terminer
          </button>
        </div>
      </div>
    );
  }

  if (!step) return null;
  const phaseColor = PHASE[step.phase];
  const stepFraction = !hasReps && step.duration > 0 ? (step.duration - remaining) / step.duration : 0;
  const sessionPct = Math.min(100, ((idx + stepFraction) / steps.length) * 100);

  return (
    <div style={{ minHeight: '100%', background: 'var(--ink)', color: 'var(--paper)', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
      {/* Top bar */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button onClick={onExit}
            style={{ width: 72, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(242,240,237,0.2)', background: '#fff', color: 'var(--mint)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', flexShrink: 0 }}>
            Arrêter
          </button>
          <div style={{ textAlign: 'center', minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(242,240,237,0.4)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.name}</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(242,240,237,0.7)', fontWeight: 500, margin: 0 }}>{step.blockTitle}</p>
          </div>
          <span style={{ width: 72, fontSize: 'var(--text-xs)', color: 'rgba(242,240,237,0.6)', fontWeight: 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{Math.round(sessionPct)}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 9999, overflow: 'hidden', background: 'var(--ring-track)' }}>
          <div style={{ height: '100%', background: 'var(--mint)', width: `${sessionPct}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 32 }}>
        <div style={{ textAlign: 'center' }} className="animate-fade-in" key={step.exerciseTitle + step.set + idx}>
          <p style={{ color: 'rgba(242,240,237,0.5)', fontSize: 'var(--text-sm)', margin: '0 0 4px' }}>
            Série {step.set}/{step.totalSets}
            {step.totalEx > 1 && <span> · Exercice {step.exIdx + 1}/{step.totalEx}</span>}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--paper)', margin: '0 0 8px' }}>{step.exerciseTitle}</h1>
          {hasReps && (
            <div style={{ fontSize: 'var(--text-5xl)', fontFamily: 'var(--font-display)', color: phaseColor, marginTop: 8 }}>
              {step.reps} <span style={{ fontSize: 'var(--text-2xl)', color: 'rgba(242,240,237,0.5)' }}>reps</span>
            </div>
          )}
        </div>

        {!hasReps && step.duration > 0 && (
          <TimerRing progress={stepFraction} remaining={remaining} phase={step.phase} size={220} />
        )}

        {step.exerciseDescription && step.phase !== 'rest' && (
          <p style={{ color: 'rgba(242,240,237,0.5)', fontSize: 'var(--text-sm)', textAlign: 'center', maxWidth: 320, lineHeight: 'var(--leading-relaxed)' }}>{step.exerciseDescription}</p>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: '16px 24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <button onClick={goPrev} disabled={idx === 0}
            style={{ padding: 12, borderRadius: 9999, border: 'none', background: 'transparent', color: 'rgba(242,240,237,0.4)', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.2 : 1 }}>
            <Icon name="chevron-left" size={28} />
          </button>
          {hasReps ? (
            <button onClick={goNext}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 12, fontWeight: 500, color: '#fff', border: 'none', cursor: 'pointer', background: phaseColor, fontFamily: 'var(--font-sans)' }}>
              <Icon name="skip-forward" size={20} />Suivant
            </button>
          ) : (
            <button onClick={() => setRunning((r) => !r)}
              style={{ padding: 20, borderRadius: 9999, color: '#fff', border: 'none', cursor: 'pointer', background: phaseColor, display: 'inline-flex' }}>
              <Icon name={running ? 'pause' : 'play'} size={28} />
            </button>
          )}
          <button onClick={goNext}
            style={{ padding: 12, borderRadius: 9999, border: 'none', background: 'transparent', color: 'rgba(242,240,237,0.4)', cursor: 'pointer' }}>
            <Icon name="chevron-right" size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
window.PlayerScreen = PlayerScreen;
