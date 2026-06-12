import { Link } from 'react-router-dom'
import {
  Play,
  WifiOff,
  UserX,
  Smartphone,
  CalendarDays,
  Layers,
  Dumbbell,
  Timer,
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
} from 'lucide-react'
import MuskleLogo from '@/components/ui/MuskleLogo'
import UserMenu from '@/components/UserMenu'
import { useAuth } from '@/hooks/useAuth'
import { useCatalogExercises } from '@/hooks/useCatalogExercises'
import type { Exercise } from '@/types/exercise'
import plankImage from '@/assets/exercises/plank.png'
import sidePlankImage from '@/assets/exercises/side-plank.png'
import supermanImage from '@/assets/exercises/superman.png'
import './landing.css'

const LANDING_FEATURE_EXERCISE_IDS = ['lunge', 'crunch', 'push-up'] as const

function formatExerciseMeta(exercise: Exercise): string {
  if (exercise.type === 'duration') {
    return `${exercise.defaultDuration ?? 30}s × ${exercise.defaultSets ?? 3} séries`
  }
  return `${exercise.defaultReps ?? 10} reps × ${exercise.defaultSets ?? 3} séries`
}

function ExerciseThumb({ image, alt }: { image?: string; alt: string }) {
  return (
    <div className={`ex-thumb${image ? ' ex-thumb-img' : ''}`}>
      {image ? (
        <img src={image} alt={alt} />
      ) : (
        <Dumbbell />
      )}
    </div>
  )
}

const BLOCK_TYPES = [
  {
    label: 'Série',
    color: 'var(--cat-renforcement)',
    bg: 'color-mix(in srgb, var(--cat-renforcement) 14%, white)',
    title: 'Séries classiques',
    desc: '— répétitions et repos entre chaque série.',
  },
  {
    label: 'Circuit',
    color: 'var(--mint-strong)',
    bg: 'color-mix(in srgb, var(--mint) 14%, white)',
    title: 'Enchaînement en rounds',
    desc: '— peu de repos entre les exercices.',
  },
  {
    label: 'Tabata',
    color: 'var(--cat-musculation)',
    bg: 'color-mix(in srgb, var(--cat-musculation) 12%, white)',
    title: "20s d'effort / 10s de repos",
    desc: '— le HIIT minuté à la seconde.',
  },
  {
    label: 'AMRAP',
    color: 'var(--cat-kine)',
    bg: 'color-mix(in srgb, var(--cat-kine) 12%, white)',
    title: 'As many rounds as possible',
    desc: '— un maximum de tours sur un temps donné.',
  },
  {
    label: 'EMOM',
    color: 'var(--cat-mobilite)',
    bg: 'color-mix(in srgb, var(--cat-mobilite) 14%, white)',
    title: 'Every minute on the minute',
    desc: '— un effort à lancer chaque minute.',
  },
] as const

export default function LandingPage() {
  const { user } = useAuth()
  const { exercises } = useCatalogExercises()
  const appEntry = user ? '/sessions' : '/login'

  return (
    <div className="landing bg-background text-ink font-sans">
      <header className="site">
        <div className="wrap nav">
          <a className="nav-logo" href="#top" aria-label="Muskle">
            <MuskleLogo className="h-[26px]" />
          </a>
          <nav className="nav-links">
            <a className="link" href="#fonctionnalites">Fonctionnalités</a>
            <a className="link" href="#etapes">Comment ça marche</a>
            <a className="link" href="#blocs">Types de blocs</a>
          </nav>
          <div className="nav-cta">
            {user ? (
              <UserMenu />
            ) : (
              <Link className="btn btn-primary" to="/login">Se connecter</Link>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="wrap hero">
          <div className="hero-text">
            <span className="eyebrow">Renfo · Muscu · Yoga · Kiné</span>
            <h1 className="font-display">Tes séances maison, enfin structurées.</h1>
            <p className="lead">
              Muskle t'aide à composer tes exercices en blocs et en séances, puis te guide à l'effort
              avec un minuteur plein écran. Tout ton entraînement, au même endroit — sans matériel,
              sans compte.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-primary btn-lg" to={appEntry}>
                <Play size={18} />
                Lancer ma première séance
              </Link>
              <a className="btn btn-outline btn-lg" href="#fonctionnalites">
                Voir les fonctionnalités
              </a>
            </div>
            <div className="hero-meta">
              <span><WifiOff size={16} />100% local</span>
              <span><UserX size={16} />Sans compte</span>
              <span><Smartphone size={16} />Sur tous tes écrans</span>
            </div>
          </div>

          <div className="stage">
            <div className="blob" />
            <div className="phone">
              <div className="phone-screen">
                <div className="m-header">
                  <MuskleLogo className="h-[19px]" />
                  <div className="m-tabs">
                    <span className="m-tab active">
                      <CalendarDays size={13} />
                      Séances
                    </span>
                    <span className="m-tab"><Layers size={13} /></span>
                    <span className="m-tab"><Dumbbell size={13} /></span>
                  </div>
                </div>
                <div className="m-body">
                  <div className="m-title">Séances</div>
                  <div className="m-sub">2 séances</div>
                  <div className="m-card">
                    <div className="m-card-row">
                      <div>
                        <h4>Full body — débutant</h4>
                        <p>Gainage + cuisses, 45 min environ</p>
                        <ol><li>Gainage de base</li><li>Cuisses — force</li></ol>
                      </div>
                      <span className="m-lancer"><Play size={12} />Lancer</span>
                    </div>
                  </div>
                  <div className="m-card">
                    <div className="m-card-row">
                      <div>
                        <h4>Push &amp; Pull</h4>
                        <p>Séance haut du corps, 30 min</p>
                        <ol><li>Haut du corps</li><li>Gainage de base</li></ol>
                      </div>
                      <span className="m-lancer"><Play size={12} />Lancer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 32 }}>
          <div className="wrap">
            <div className="benefits">
              {[
                { icon: Dumbbell, title: 'Ta bibliothèque', desc: 'Crée tes exercices avec titre, description, catégorie et média. Toujours sous la main.' },
                { icon: Layers, title: 'Des blocs sur mesure', desc: 'Séries, circuits, Tabata, AMRAP, EMOM. Règle répétitions, durées et temps de repos.' },
                { icon: CalendarDays, title: 'Des séances assemblées', desc: 'Empile tes blocs pour bâtir la séance parfaite, prête à lancer en un geste.' },
                { icon: Timer, title: "Guidé à l'effort", desc: 'Le player plein écran enchaîne préparation, effort et repos avec minuteur et sons.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="benefit">
                  <span className="ic"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="section">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">Fonctionnalités</span>
              <h2 className="font-display">De l'exercice à la séance, sans friction.</h2>
              <p className="lead">Quatre briques qui s'emboîtent. Tu construis une fois, tu réutilises à l'infini.</p>
            </div>

            <div className="feature">
              <div className="feature-text">
                <span className="eyebrow"><Dumbbell size={16} />Exercices</span>
                <h3 className="font-display">Ta bibliothèque personnelle.</h3>
                <p>Range chaque mouvement par groupe musculaire, ajoute une description claire et des valeurs par défaut. Filtre en un tap pour retrouver le bon exercice.</p>
                <ul className="feature-list">
                  <li><Check />Catégories par groupe musculaire et discipline</li>
                  <li><Check />Reps ou durée, séries par défaut</li>
                  <li><Check />Image ou vidéo en option</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="ex-card-grid">
                  {LANDING_FEATURE_EXERCISE_IDS.map((id) => {
                    const ex = exercises.find((e) => e.id === id)
                    if (!ex) return null
                    return (
                      <div key={ex.id} className="ex-card">
                        <div className="ex-card-media">
                          {ex.videoUrl ? (
                            <video
                              src={ex.videoUrl}
                              poster={ex.imageUrl}
                              loop
                              muted
                              autoPlay
                              playsInline
                            />
                          ) : ex.imageUrl ? (
                            <img src={ex.imageUrl} alt={ex.name} />
                          ) : null}
                        </div>
                        <div className="ex-card-body">
                          <div className="ex-card-head">
                            <h4>{ex.name}</h4>
                            <span className="ex-card-cat">{ex.category}</span>
                          </div>
                          <p className="ex-card-meta">{formatExerciseMeta(ex)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="feature flip">
              <div className="feature-text">
                <span className="eyebrow"><Layers size={16} />Blocs</span>
                <h3 className="font-display">Groupe, configure, répète.</h3>
                <p>Un bloc rassemble plusieurs exercices en liste ou en circuit. Choisis le format, le nombre de tours et les repos — Muskle s'occupe du reste à l'effort.</p>
                <ul className="feature-list">
                  <li><Check />Liste classique ou circuit en rounds</li>
                  <li><Check />Repos entre séries et entre tours</li>
                  <li><Check />Glisser-déposer pour réordonner</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="panel">
                  <div className="m-card-row" style={{ marginBottom: 14 }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Gainage de base</h4>
                      <p style={{ fontSize: '0.875rem', color: 'color-mix(in srgb, var(--ink) 52%, transparent)', margin: '4px 0 0' }}>
                        3 exercices · 3 rounds
                      </p>
                    </div>
                    <span className="mode-badge" style={{ background: 'var(--mint)', color: '#fff' }}>Circuit</span>
                  </div>
                  {[
                    { name: 'Planche', meta: '30s · repos 15s', image: plankImage },
                    { name: 'Planche latérale', meta: '20s · repos 15s', image: sidePlankImage },
                    { name: 'Superman', meta: '10 reps · repos 20s', image: supermanImage },
                  ].map((ex) => (
                    <div key={ex.name} className="ex-row" style={{ padding: '10px 0' }}>
                      <ExerciseThumb image={ex.image} alt={ex.name} />
                      <div>
                        <h4>{ex.name}</h4>
                        <p>{ex.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="feature">
              <div className="feature-text">
                <span className="eyebrow"><CalendarDays size={16} />Séances</span>
                <h3 className="font-display">Assemble ta séance idéale.</h3>
                <p>Empile tes blocs dans l'ordre qui te convient, ajoute une note, et obtiens une séance complète prête à démarrer. Réutilise-la séance après séance.</p>
                <ul className="feature-list">
                  <li><Check />Composition par blocs réordonnables</li>
                  <li><Check />Durée estimée automatique</li>
                  <li><Check />Lance en un seul bouton</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="panel">
                  <div className="m-card-row">
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 4px' }}>Full body — débutant</h4>
                      <p style={{ fontSize: '0.875rem', color: 'color-mix(in srgb, var(--ink) 55%, transparent)', margin: '0 0 10px' }}>
                        Gainage + cuisses, 45 min environ
                      </p>
                      <ol style={{ fontSize: '0.875rem', color: 'color-mix(in srgb, var(--ink) 50%, transparent)', margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                        <li>Gainage de base</li>
                        <li>Cuisses — force</li>
                        <li>Cardio express</li>
                      </ol>
                    </div>
                    <Link className="btn btn-primary" to={appEntry} style={{ padding: '9px 16px', fontSize: '0.875rem' }}>
                      <Play size={14} />
                      Lancer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section player-band">
          <div className="wrap feature flip">
            <div className="feature-text">
              <span className="eyebrow"><Timer size={16} />Le player</span>
              <h3 className="font-display text-paper">Reste guidé, du premier échauffement au dernier repos.</h3>
              <p>Plein écran, sans distraction. Muskle enchaîne préparation, effort et repos, t'annonce chaque phase et suit ta progression dans la séance. Tu n'as plus qu'à transpirer.</p>
              <ul className="feature-list">
                <li><Check />Minuteur à anneau, couleur par phase</li>
                <li><Check />Signaux sonores aux transitions</li>
                <li><Check />Navigation libre entre les étapes</li>
              </ul>
            </div>
            <div className="feature-visual">
              <div className="ring-card">
                <div className="ring-meta">
                  <p className="serie">Série 2/4 · Exercice 1/3</p>
                  <p className="exo">Squat</p>
                </div>
                <div className="ring-svg">
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r="100" fill="none" stroke="var(--ring-track)" strokeWidth="8" />
                    <circle
                      cx="110" cy="110" r="100" fill="none"
                      stroke="var(--phase-work)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray="628.3" strokeDashoffset="232"
                      transform="rotate(-90 110 110)"
                    />
                  </svg>
                  <div className="ring-center">
                    <span className="t">0:18</span>
                    <span className="ph">Go !</span>
                  </div>
                </div>
                <div className="ring-controls">
                  <span className="nav-btn"><ChevronLeft /></span>
                  <span className="ring-play"><Pause /></span>
                  <span className="nav-btn"><ChevronRight /></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="etapes" className="section">
          <div className="wrap">
            <div className="head center">
              <span className="eyebrow">Comment ça marche</span>
              <h2 className="font-display">Prêt à transpirer en trois étapes.</h2>
            </div>
            <div className="steps">
              {[
                { n: 1, title: 'Crée tes exercices', desc: 'Ajoute les mouvements que tu pratiques, classés par groupe musculaire, avec leurs valeurs par défaut.' },
                { n: 2, title: 'Assemble blocs & séances', desc: 'Regroupe tes exercices en blocs, puis enchaîne tes blocs pour composer une séance complète.' },
                { n: 3, title: 'Lance le player', desc: 'Démarre la séance et laisse-toi guider, minuteur à l\'appui, jusqu\'au « Séance terminée ! ».' },
              ].map((step) => (
                <div key={step.n} className="step">
                  <span className="num">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="blocs" className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">Types de blocs</span>
              <h2 className="font-display">Tous les formats d'entraînement.</h2>
              <p className="lead">Du renfo tranquille au HIIT le plus intense, Muskle parle ton langage.</p>
            </div>
            <div className="panel" style={{ padding: '8px 28px' }}>
              {BLOCK_TYPES.map((mode) => (
                <div key={mode.label} className="mode-row">
                  <span className="mode-badge" style={{ background: mode.bg, color: mode.color }}>
                    {mode.label}
                  </span>
                  <p><strong>{mode.title}</strong> {mode.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band">
              <h2 className="font-display">Ta prochaine séance commence maintenant.</h2>
              <p>Aucune inscription, aucun matériel. Ouvre Muskle, compose ta séance et lance le minuteur.</p>
              <Link className="btn btn-on-mint btn-lg" to={appEntry}>
                <Play size={18} />
                Ouvrir Muskle
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site">
        <div className="wrap foot">
          <MuskleLogo className="h-6" />
          <div className="links">
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#etapes">Comment ça marche</a>
            <a href="#blocs">Types de blocs</a>
            <a href="https://github.com/Happy-doggy/muskle" target="_blank" rel="noopener noreferrer">GitHub</a>
            <Link to="/legal">CGU &amp; mentions légales</Link>
          </div>
          <span className="copy">© 2026 Muskle — Entraîne-toi à la maison.</span>
        </div>
      </footer>
    </div>
  )
}
