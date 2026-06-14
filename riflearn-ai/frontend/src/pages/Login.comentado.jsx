// ============================================================
// Login.jsx — Página de inicio de sesión
// ============================================================
// Qué hace:
//   1. Muestra un formulario con email y contraseña
//   2. Al enviar, llama a la API del backend
//   3. Si el backend responde OK → guarda la sesión y redirige
//   4. Si hay error → muestra el mensaje de error
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Link        → enlace entre páginas sin recargar
// useNavigate → para redirigir por código (ej: tras login exitoso)

import { useAuth } from '../context/AuthContext'
// Necesitamos la función login para guardar la sesión

import { authService } from '../services/api'
// authService.login → hace la llamada HTTP al backend

export default function Login() {

  // form → objeto con los valores del formulario
  // Empieza vacío y se actualiza con cada tecla que escribe el usuario
  const [form, setForm] = useState({ email: '', password: '' })

  // error → mensaje de error que se muestra si el login falla
  const [error, setError] = useState('')

  // loading → true mientras esperamos respuesta del servidor
  // Sirve para deshabilitar el botón y evitar doble envío
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()   // función para guardar la sesión
  const navigate  = useNavigate() // función para redirigir

  // ============================================================
  // handleChange → actualiza el formulario cuando el usuario escribe
  // e.target.name  → el nombre del input (email o password)
  // e.target.value → lo que escribió el usuario
  // ============================================================
  const handleChange = e => {
    setForm(f => ({
      ...f,               // copia todos los campos anteriores
      [e.target.name]: e.target.value  // y sobreescribe solo el que cambió
    }))
  }

  // ============================================================
  // handleSubmit → se ejecuta al pulsar "Iniciar sesión"
  // ============================================================
  const handleSubmit = async e => {
    e.preventDefault() // Evita que el formulario recargue la página
    setError('')        // Limpia errores anteriores
    setLoading(true)    // Activa el estado de carga

    try {
      // Llamada al backend: POST /api/auth/login con email y password
      const res = await authService.login(form)

      // Si llegamos aquí, el login fue exitoso
      // res.data contiene: { user: {...}, token: "eyJ..." }
      login(res.data.user, res.data.token)

      // Redirigimos al dashboard
      navigate('/dashboard')

    } catch (err) {
      // Si el backend devuelve error (contraseña incorrecta, etc.)
      // err.response.data.message contiene el mensaje del servidor
      // Si no hay mensaje, usamos uno genérico
      setError(err.response?.data?.message || 'Credenciales incorrectas')

    } finally {
      // finally se ejecuta SIEMPRE (haya error o no)
      setLoading(false) // Desactivamos el estado de carga
    }
  }

  // ============================================================
  // RENDER — Lo que se muestra en pantalla
  // ============================================================
  return (
    // Centra el formulario vertical y horizontalmente
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Cabecera */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-[var(--rif-muted)]">
            Inicia sesión para continuar aprendiendo
          </p>
        </div>

        {/* onSubmit → llama a handleSubmit cuando se envía el form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Mensaje de error — solo se muestra si error no está vacío */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Campo email */}
          <div>
            <label className="block text-xs text-[var(--rif-muted)] mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"       // ← debe coincidir con la clave en el objeto form
              required           // validación nativa del navegador
              value={form.email} // valor controlado por React
              onChange={handleChange} // actualiza el estado en cada tecla
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-[rgba(232,226,213,0.05)] border border-[var(--rif-border)]
                text-[var(--rif-text)] text-sm placeholder-[var(--rif-muted)]
                focus:outline-none focus:border-[var(--rif-gold)] transition-colors"
            />
          </div>

          {/* Campo contraseña — igual que email pero type="password" oculta los caracteres */}
          <div>
            <label className="block text-xs text-[var(--rif-muted)] mb-1.5">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[rgba(232,226,213,0.05)] border border-[var(--rif-border)]
                text-[var(--rif-text)] text-sm placeholder-[var(--rif-muted)]
                focus:outline-none focus:border-[var(--rif-gold)] transition-colors"
            />
          </div>

          {/* Botón de envío
              disabled={loading} → deshabilitado mientras carga para evitar doble envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[var(--rif-gold)] text-[var(--rif-dark)] font-medium text-sm
              hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {/* Texto dinámico según el estado de carga */}
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="text-center text-sm text-[var(--rif-muted)] mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[var(--rif-gold)] hover:underline">
            Regístrate gratis
          </Link>
        </p>

      </div>
    </div>
  )
}
