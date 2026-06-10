import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Loader2,
  Mail,
  Shield,
} from 'lucide-react'
import plankImage from '../assets/exercises/plank.png'
import squatImage from '../assets/exercises/squat.png'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import MuskleLogo from '../components/ui/MuskleLogo'
import './login.css'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const { user, loading, completingLink, signIn, sendMagicLink } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/sessions'

  const [email, setEmail] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (user) return
    setLinkSent(false)
    setAuthError(null)
  }, [user])

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setAuthError('Saisis ton adresse e-mail.')
      return
    }
    setSending(true)
    setAuthError(null)
    try {
      await sendMagicLink(trimmed)
      setLinkSent(true)
    } catch (err) {
      console.error('[LoginPage] Failed to send magic link', err)
      setAuthError('Impossible d’envoyer le lien. Réessaie.')
    } finally {
      setSending(false)
    }
  }

  if (loading || completingLink) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="login-page">
      <aside className="login-visual" aria-hidden="true">
        <Link to="/" className="login-visual-logo" aria-label="Muskle">
          <MuskleLogo className="h-8 text-white" />
        </Link>

        <div className="login-visual-body">
          <div className="login-visual-image">
            <div className="login-visual-cards">
              <div className="login-polaroid login-polaroid-back">
                <div className="login-polaroid-photo">
                  <img src={plankImage} alt="Planche" />
                </div>
                <div className="login-polaroid-caption">
                  Gainage de base
                  <div className="login-polaroid-sub">3 exercices · Circuit</div>
                </div>
              </div>
              <div className="login-polaroid login-polaroid-front">
                <div className="login-polaroid-photo">
                  <img src={squatImage} alt="Squat" />
                </div>
                <div className="login-polaroid-caption">
                  Full body — débutant
                  <div className="login-polaroid-sub">45 min · 2 blocs</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1>À l&apos;effort !</h1>
            <p className="login-visual-lead">
              Compose tes séances, lance le minuteur et reste guidé du premier échauffement au dernier repos.
            </p>
          </div>
        </div>

        <div className="login-visual-badges">
          <span><Check />Séances structurées</span>
          <span><Shield />Données sécurisées</span>
          <span><CalendarDays />Prêt en 2 min</span>
        </div>
      </aside>

      <main className="login-form-panel">
        <div className="login-form-inner">
          <Link to="/" className="login-form-back">
            <ArrowLeft size={16} />
            Retour à l&apos;accueil
          </Link>

          {linkSent ? (
            <div className="login-success">
              <div className="login-success-icon">
                <Mail size={24} />
              </div>
              <h3>Vérifie ta boîte mail</h3>
              <p>
                Un lien de connexion a été envoyé à{' '}
                <strong className="text-ink">{email}</strong>.
                Clique dessus pour accéder à Muskle.
              </p>
            </div>
          ) : (
            <>
              <h2>Content de te revoir 👋</h2>
              <p className="login-form-subtitle">
                Connecte-toi pour retrouver tes séances, blocs et exercices.
              </p>

              <button type="button" className="login-social-btn" onClick={() => void signIn()}>
                <GoogleIcon />
                Continuer avec Google
              </button>

              <div className="login-divider">
                <span>ou avec ton e-mail</span>
              </div>

              <form onSubmit={(e) => void handleSendMagicLink(e)}>
                <Label htmlFor="email" className="login-field-label">
                  E-mail
                </Label>
                <div className="login-email-wrap">
                  <Mail />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setAuthError(null)
                    }}
                    autoComplete="email"
                    disabled={sending}
                  />
                </div>

                <Button
                  type="submit"
                  className="login-submit-btn hover:bg-[var(--mint-strong)] hover:opacity-100"
                  disabled={sending}
                >
                  {sending ? 'Envoi…' : 'Recevoir un lien de connexion'}
                  {!sending && <ArrowRight size={16} />}
                </Button>
              </form>
            </>
          )}

          {authError && <p className="login-error">{authError}</p>}
        </div>
      </main>
    </div>
  )
}
