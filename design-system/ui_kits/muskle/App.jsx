// Muskle UI kit — app shell + navigation between screens.
function App() {
  const { Header } = window.MuskleKit;
  const [route, setRoute] = React.useState('sessions');
  const [playing, setPlaying] = React.useState(null); // sessionId or null

  // Full-screen player takes over the whole viewport.
  if (playing) {
    return <window.PlayerScreen sessionId={playing} onExit={() => setPlaying(null)} />;
  }

  return (
    <div style={{ minHeight: '100%', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
      <Header route={route} onNavigate={setRoute} />
      <main style={{ flex: 1, maxWidth: 'var(--container-max)', margin: '0 auto', width: '100%', padding: '32px 16px' }}>
        {route === 'sessions' && <window.SessionsScreen onPlay={(id) => setPlaying(id)} />}
        {route === 'blocks' && <window.BlocksScreen />}
        {route === 'exercises' && <window.ExercisesScreen />}
      </main>
    </div>
  );
}
window.MuskleApp = App;
