import { Routes, Route } from 'react-router-dom'
import AuthBootstrap from './components/AuthBootstrap'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/ui/Layout'
import ExercisesPage from './pages/ExercisesPage'
import ExerciseDetailPage from './pages/ExerciseDetailPage'
import AddExercisePage from './pages/AddExercisePage'
import BlocksPage from './pages/BlocksPage'
import BlockEditorPage from './pages/BlockEditorPage'
import SessionsPage from './pages/SessionsPage'
import SessionEditorPage from './pages/SessionEditorPage'
import PlayerPage from './pages/PlayerPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AccountPage from './pages/AccountPage'
import { Toaster } from './components/ui/toaster'

export default function App() {
  return (
    <AuthBootstrap>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/play/:sessionId"
          element={
            <ProtectedRoute>
              <PlayerPage />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/new" element={<SessionEditorPage />} />
          <Route path="/sessions/:id/edit" element={<SessionEditorPage />} />
          <Route path="/blocks" element={<BlocksPage />} />
          <Route path="/blocks/new" element={<BlockEditorPage />} />
          <Route path="/blocks/:id/edit" element={<BlockEditorPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/new" element={<AddExercisePage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </AuthBootstrap>
  )
}
