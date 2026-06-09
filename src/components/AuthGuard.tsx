import { useEffect, useState, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../store'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import MuskleLogo from './ui/MuskleLogo'

type AuthGuardProps = {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, signIn } = useAuth()
  const loadAll = useAppStore((s) => s.loadAll)
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    if (!user) {
      setDataReady(false)
      return
    }
    setDataReady(false)
    void loadAll()
      .then(() => setDataReady(true))
      .catch((err) => {
        console.error('[AuthGuard] Failed to load data', err)
        setDataReady(true)
      })
  }, [user, loadAll])

  if (loading || (user && !dataReady)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-border bg-card shadow-sm">
          <CardHeader className="items-center text-center space-y-4 pb-2">
            <MuskleLogo className="h-8 text-ink" />
            <CardTitle className="font-display text-2xl text-ink">Muskle</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button onClick={() => void signIn()}>Se connecter avec Google</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
