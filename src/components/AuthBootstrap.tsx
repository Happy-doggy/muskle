import { useEffect, type ReactNode } from 'react'
import { completeMagicLink } from '../hooks/useAuth'

type AuthBootstrapProps = {
  children: ReactNode
}

/** Complète la connexion magic link sur toutes les routes (y compris la landing publique). */
export default function AuthBootstrap({ children }: AuthBootstrapProps) {
  useEffect(() => {
    void completeMagicLink().catch((err) => {
      console.error('[AuthBootstrap] Magic link sign-in failed', err)
    })
  }, [])

  return <>{children}</>
}
