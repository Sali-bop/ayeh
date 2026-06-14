// ============================================================
// App.jsx — Punto de entrada principal de la aplicación
// ============================================================
// Este archivo define:
//   1. El proveedor de autenticación (quién está logueado)
//   2. El sistema de rutas (qué página se muestra según la URL)
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom'
// BrowserRouter → envuelve toda la app y habilita la navegación
// Routes       → contenedor de todas las rutas
// Route        → asocia una URL con una página concreta

import { AuthProvider } from './context/AuthContext'
// AuthProvider → componente que guarda el estado del usuario logueado
// Cualquier componente dentro puede saber si hay sesión iniciada

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
// ProtectedRoute → si el usuario NO está logueado, redirige al login

// Importamos todas las páginas
import Home      from './pages/Home'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Lessons   from './pages/Lessons'
import Quiz      from './pages/Quiz'
import AIChat    from './pages/AIChat'

export default function App() {
  return (
    // AuthProvider envuelve TODO para que cualquier página
    // pueda acceder al estado de autenticación
    <AuthProvider>

      {/* BrowserRouter habilita la navegación entre páginas
          sin recargar el navegador (Single Page Application) */}
      <BrowserRouter>

        <div className="min-h-screen bg-[var(--rif-dark)] text-[var(--rif-text)]">

          {/* Navbar siempre visible en todas las páginas */}
          <Navbar />

          <Routes>
            {/* Rutas públicas — cualquiera puede entrar */}
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas — solo si estás logueado
                Si no hay sesión, ProtectedRoute redirige a /login */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/lecciones" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
            <Route path="/quiz"      element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/chat"      element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
          </Routes>

        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
