import { Routes, Route, Navigate } from 'react-router-dom'
import AuthBootstrap from './components/AuthBootstrap'
import ProtectedRoute from './components/ProtectedRoute'
import AdminGuard from './components/admin/AdminGuard'
import AdminLayout from './components/admin/AdminLayout'
import Layout from './components/ui/Layout'
import ExercisesPage from './pages/ExercisesPage'
import ExerciseDetailPage from './pages/ExerciseDetailPage'
import BlocksPage from './pages/BlocksPage'
import BlockEditorPage from './pages/BlockEditorPage'
import SessionsPage from './pages/SessionsPage'
import SessionEditorPage from './pages/SessionEditorPage'
import PlayerPage from './pages/PlayerPage'
import LandingPage from './pages/LandingPage'
import LegalPage from './pages/LegalPage'
import LoginPage from './pages/LoginPage'
import AccountPage from './pages/AccountPage'
import SportProfileStepEditPage from './pages/SportProfileStepEditPage'
import OnboardingPage from './pages/OnboardingPage'
import OnboardingGate from './components/OnboardingGate'
import OnboardingRedirectIfDone from './components/OnboardingRedirectIfDone'
import { Toaster } from './components/ui/toaster'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminExercisesPage from './pages/admin/AdminExercisesPage'

export default function App() {
  return (
    <AuthBootstrap>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminGuard />
            </ProtectedRoute>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="exercises" element={<AdminExercisesPage />} />
          </Route>
        </Route>

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingRedirectIfDone />
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/play/:sessionId"
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <PlayerPage />
              </OnboardingGate>
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <OnboardingGate>
                <Layout />
              </OnboardingGate>
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
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/sport-profile/:stepId" element={<SportProfileStepEditPage />} />
        </Route>
      </Routes>
    </AuthBootstrap>
  )
}
