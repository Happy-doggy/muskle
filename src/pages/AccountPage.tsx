import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, LogOut, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import AccountPageNav, { AccountPageMobileNav } from '../components/AccountPageNav'
import UserEquipmentSection from '../components/UserEquipmentSection'
import UserOnboardingPreferencesSection from '../components/UserOnboardingPreferencesSection'
import { toast } from '@/lib/toast'

export default function AccountPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { user, display, loading, saveFirstName } = useUserProfile()
  const [firstName, setFirstName] = useState('')
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (display) setFirstName(display.firstName)
  }, [display])

  if (loading || !user || !display) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        Chargement…
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!display.canEditName) return
    const trimmed = firstName.trim()
    if (!trimmed) {
      setError('Saisis un prénom.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await saveFirstName(trimmed)
      toast.success('Prénom enregistré')
    } catch (err) {
      console.error('[AccountPage] Failed to save profile', err)
      toast.error('Impossible d’enregistrer. Réessaie.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      toast.success('Déconnexion réussie')
      navigate('/')
    } catch (err) {
      console.error('[AccountPage] Sign out failed', err)
      toast.error('Impossible de se déconnecter. Réessaie.')
      setSigningOut(false)
    }
  }

  return (
    <div className="lg:mx-auto lg:w-fit">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-foreground">Mon compte</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {display.isGoogle
            ? 'Connecté avec Google'
            : 'Connecté par e-mail'}
        </p>
      </div>

      <AccountPageMobileNav />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(13.5rem,auto)_minmax(0,42rem)] lg:gap-8">
        <AccountPageNav />

        <div className="form-narrow mx-0 min-w-0 max-w-none space-y-6 pb-8">
          <section id="profil" className="scroll-mt-24">
            <Card>
              <CardHeader className="items-center text-center pb-2">
                {display.photoUrl ? (
                  <img
                    src={display.photoUrl}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <User size={32} />
                  </span>
                )}
                <CardTitle className="font-display text-xl pt-2">{display.firstName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {display.canEditName ? (
                  <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value)
                          setError(null)
                        }}
                        autoComplete="given-name"
                        disabled={saving}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    Ton prénom provient de ton compte Google et n’est pas modifiable ici.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <section id="profil-sportif" className="scroll-mt-24">
            <UserOnboardingPreferencesSection />
          </section>

          <section id="materiel" className="scroll-mt-24">
            <UserEquipmentSection />
          </section>

          {user.email && (
            <Card>
              <CardContent className="py-4 text-center space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Connexion
                </p>
                <p className="text-sm text-foreground">{user.email}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="py-4">
              <Link
                to="/legal"
                className="flex items-center justify-center gap-2 text-sm font-medium text-mint transition-colors hover:text-[var(--mint-strong)]"
              >
                <FileText size={16} aria-hidden />
                CGU et mentions légales
              </Link>
            </CardContent>
          </Card>

          <Button
            type="button"
            variant="outline"
            className="w-full text-destructive hover:text-destructive hover:border-destructive"
            disabled={signingOut}
            onClick={() => void handleSignOut()}
          >
            <LogOut size={16} />
            {signingOut ? 'Déconnexion…' : 'Déconnexion'}
          </Button>
        </div>
      </div>
    </div>
  )
}
