import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function AccountPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { user, display, loading, saveFirstName } = useUserProfile()
  const [firstName, setFirstName] = useState('')
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

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
    setSaved(false)
    try {
      await saveFirstName(trimmed)
      setSaved(true)
    } catch (err) {
      console.error('[AccountPage] Failed to save profile', err)
      setError('Impossible d’enregistrer. Réessaie.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      console.error('[AccountPage] Sign out failed', err)
      setSigningOut(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-8">
      <div>
        <h1 className="font-display text-2xl text-foreground">Mon compte</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {display.isGoogle
            ? 'Connecté avec Google'
            : 'Connecté par e-mail'}
        </p>
      </div>

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
                    setSaved(false)
                  }}
                  autoComplete="given-name"
                  disabled={saving}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {saved && <p className="text-sm text-mint">Prénom enregistré.</p>}
              <Button type="submit" disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Ton prénom provient de ton compte Google et n’est pas modifiable ici.
            </p>
          )}

          {user.email && (
            <p className="text-sm text-muted-foreground text-center pt-2 border-t border-border">
              {user.email}
            </p>
          )}
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
  )
}
