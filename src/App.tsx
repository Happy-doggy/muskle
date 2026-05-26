import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store'
import Layout from './components/ui/Layout'
import ExercisesPage from './pages/ExercisesPage'
import AddExercisePage from './pages/AddExercisePage'
import BlocksPage from './pages/BlocksPage'
import BlockEditorPage from './pages/BlockEditorPage'
import SessionsPage from './pages/SessionsPage'
import SessionEditorPage from './pages/SessionEditorPage'
import PlayerPage from './pages/PlayerPage'

export default function App() {
  const loadAll = useAppStore((s) => s.loadAll)

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return (
    <Routes>
      <Route path="/play/:sessionId" element={<PlayerPage />} />

      <Route element={<Layout />}>
        <Route index element={<Navigate to="/sessions" replace />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/sessions/new" element={<SessionEditorPage />} />
        <Route path="/sessions/:id/edit" element={<SessionEditorPage />} />
        <Route path="/blocks" element={<BlocksPage />} />
        <Route path="/blocks/new" element={<BlockEditorPage />} />
        <Route path="/blocks/:id/edit" element={<BlockEditorPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/exercises/new" element={<AddExercisePage />} />
      </Route>
    </Routes>
  )
}
