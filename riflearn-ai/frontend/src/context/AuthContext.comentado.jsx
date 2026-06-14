// ============================================================
// AuthContext.jsx — Estado global de autenticación
// ============================================================
// El problema que resuelve:
//   Varias páginas necesitan saber si el usuario está logueado
//   (Navbar, Dashboard, ProtectedRoute...).
//   En lugar de pasar esa info de componente en componente,
//   la guardamos en un "contexto" accesible desde cualquier sitio.
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
// createContext → crea el "almacén" global
// useContext    → permite leer ese almacén desde cualquier componente
// useState      → guarda valores que pueden cambiar (user, token)
// useEffect     → ejecuta código al montar el componente (al arrancar)

// Creamos el contexto vacío (null por defecto)
const AuthContext = createContext(null)

// ============================================================
// AuthProvider — Componente que envuelve la app entera
// Todos sus "hijos" podrán leer y modificar el estado de auth
// ============================================================
export function AuthProvider({ children }) {

  // user  → objeto con los datos del usuario logueado (o null)
  // token → string JWT que prueba que estás autenticado (o null)
  const [user,  setUser]  = useState(null)
  const [token, setToken] = useState(null)

  // loading → true mientras comprobamos si hay sesión guardada
  // Evita un parpadeo de "no logueado" al recargar la página
  const [loading, setLoading] = useState(true)

  // useEffect con [] → se ejecuta UNA sola vez al arrancar la app
  // Comprueba si el usuario ya había iniciado sesión antes
  useEffect(() => {
    // localStorage guarda datos en el navegador entre sesiones
    const savedToken = localStorage.getItem('ayeh_token')
    const savedUser  = localStorage.getItem('ayeh_user')

    if (savedToken && savedUser) {
      // Si encontramos datos guardados, restauramos la sesión
      setToken(savedToken)
      setUser(JSON.parse(savedUser)) // JSON.parse convierte texto → objeto
    }

    setLoading(false) // Ya terminamos de comprobar
  }, []) // El [] significa "solo al montar, no repetir"

  // ============================================================
  // login → se llama cuando el usuario inicia sesión con éxito
  // Guarda los datos en el estado Y en localStorage (persistente)
  // ============================================================
  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('ayeh_token', authToken)
    localStorage.setItem('ayeh_user', JSON.stringify(userData)) // objeto → texto
  }

  // ============================================================
  // logout → borra todo al cerrar sesión
  // ============================================================
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ayeh_token')
    localStorage.removeItem('ayeh_user')
  }

  // Lo que "exportamos" al resto de la app a través del contexto:
  return (
    <AuthContext.Provider value={{
      user,           // objeto del usuario (name, email, id...)
      token,          // JWT string
      login,          // función para iniciar sesión
      logout,         // función para cerrar sesión
      loading,        // boolean: ¿estamos cargando?
      isAuth: !!user  // boolean: ¿hay usuario? (!! convierte a true/false)
    }}>
      {children} {/* Renderiza todo lo que esté dentro del Provider */}
    </AuthContext.Provider>
  )
}

// ============================================================
// useAuth — Hook personalizado para usar el contexto fácilmente
// En cualquier componente puedes hacer:
//   const { user, isAuth, login, logout } = useAuth()
// ============================================================
export const useAuth = () => useContext(AuthContext)
