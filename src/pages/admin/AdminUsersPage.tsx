import { useMemo, useState } from 'react'
import type { Timestamp } from 'firebase/firestore'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminUsers, type AdminUser } from '@/hooks/useAdminUsers'

function toDate(ts: Timestamp | undefined): Date | null {
  if (!ts || typeof ts.toDate !== 'function') return null
  return ts.toDate()
}

function formatDate(ts: Timestamp | undefined): string {
  const date = toDate(ts)
  if (!date) return '—'
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function computeMetrics(users: AdminUser[]) {
  const now = new Date()
  const weekStart = startOfWeek(now)
  const monthAgo = new Date(now)
  monthAgo.setDate(monthAgo.getDate() - 30)

  let newThisWeek = 0
  let activeThisMonth = 0

  for (const user of users) {
    const created = toDate(user.createdAt)
    if (created && created >= weekStart) newThisWeek++

    const lastLogin = toDate(user.lastLoginAt)
    if (lastLogin && lastLogin >= monthAgo) activeThisMonth++
  }

  return {
    total: users.length,
    newThisWeek,
    activeThisMonth,
  }
}

export default function AdminUsersPage() {
  const { users, loading, error } = useAdminUsers()
  const [search, setSearch] = useState('')

  const metrics = useMemo(() => computeMetrics(users), [users])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    const sorted = [...users].sort((a, b) => {
      const aTime = toDate(a.createdAt)?.getTime() ?? 0
      const bTime = toDate(b.createdAt)?.getTime() ?? 0
      return bTime - aTime
    })
    if (!query) return sorted
    return sorted.filter(
      (u) =>
        u.displayName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    )
  }, [users, search])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold">Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">
          Suivi des inscriptions et de l&apos;activité
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{metrics.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nouveaux cette semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{metrics.newThisWeek}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs ce mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{metrics.activeThisMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead className="text-right">Sessions</TableHead>
                <TableHead className="text-right">Séances complétées</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Chargement…
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.displayName || '—'}
                    </TableCell>
                    <TableCell>{user.email || '—'}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {user.sessionCount}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {user.completedWorkouts}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
