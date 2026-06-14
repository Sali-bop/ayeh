// ============================================================
// App.jsx — Raíz de la aplicación con todo integrado
// ============================================================

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider }   from './context/AuthContext'
import { ThemeProvider }  from './context/ThemeContext'
import ErrorBoundary      from './components/ErrorBoundary'
import Navbar             from './components/Navbar'
import Footer             from './components/Footer'
import PageTransition     from './components/PageTransition'
import ProtectedRoute     from './components/ProtectedRoute'

import Home      from './pages/Home'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Lessons   from './pages/Lessons'
import Quiz      from './pages/Quiz'
import AIChat    from './pages/AIChat'
import Settings  from './pages/Settings'
import NotFound  from './pages/NotFound'

// Componente interno para acceder al location (para transiciones)
function AppRoutes() {
  const location = useLocation()

  return (
    // key={location.pathname} → remonta el PageTransition en cada cambio de ruta
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        {/* Públicas */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/lecciones" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
        <Route path="/quiz"      element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/chat"      element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
        <Route path="/ajustes"   element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* 404 — cualquier ruta desconocida */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              background: 'var(--rif-bg)', color: 'var(--rif-text)',
            }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
