// ============================================================
// api.js — Capa de comunicación con el backend
// ============================================================
// Centraliza TODAS las llamadas HTTP en un solo lugar.
// Ventaja: si cambia la URL del servidor, solo cambias aquí.
// ============================================================

import axios from 'axios'
// axios → librería para hacer peticiones HTTP (GET, POST, etc.)
// Es más cómoda que el fetch nativo del navegador

// ============================================================
// Instancia configurada de axios
// Todos los servicios usarán esta instancia, no axios directamente
// ============================================================
const api = axios.create({
  baseURL: '/api',  // todas las peticiones van a /api/...
                    // el proxy en vite.config.js lo redirige a http://localhost:5000
  headers: { 'Content-Type': 'application/json' }
})

// ============================================================
// INTERCEPTOR DE PETICIONES (request interceptor)
// Se ejecuta ANTES de cada petición HTTP que hagamos
// Su función: añadir el token JWT automáticamente
// ============================================================
api.interceptors.request.use(config => {
  // Leemos el token guardado en localStorage
  const token = localStorage.getItem('ayeh_token')

  if (token) {
    // Añadimos la cabecera Authorization con el token
    // El backend lo leerá para verificar que estamos autenticados
    // Formato estándar: "Bearer eyJhbGciOiJIUzI1NiIs..."
    config.headers.Authorization = `Bearer ${token}`
  }

  return config // devolvemos la config modificada
})

// ============================================================
// INTERCEPTOR DE RESPUESTAS (response interceptor)
// Se ejecuta cuando el servidor responde con un error
// ============================================================
api.interceptors.response.use(
  res => res, // si todo va bien, devuelve la respuesta sin tocarla

  err => {
    // Si el servidor responde 401 (no autorizado)
    // significa que el token expiró o es inválido
    if (err.response?.status === 401) {
      // Borramos los datos de sesión guardados
      localStorage.removeItem('ayeh_token')
      localStorage.removeItem('ayeh_user')
      // Redirigimos al login para que vuelva a autenticarse
      window.location.href = '/login'
    }
    // Propagamos el error para que cada llamada pueda manejarlo
    return Promise.reject(err)
  }
)

// ============================================================
// SERVICIOS — Funciones que hacen las llamadas HTTP
// Cada sección agrupa las llamadas de un recurso
// ============================================================

// AUTH — Registro e inicio de sesión
export const authService = {
  // POST /api/auth/login   → { email, password } → { user, token }
  login: (data) => api.post('/auth/login', data),

  // POST /api/auth/register → { name, email, password } → { user, token }
  register: (data) => api.post('/auth/register', data),

  // GET /api/auth/me → devuelve los datos del usuario actual
  me: () => api.get('/auth/me'),
}

// LECCIONES
export const lessonService = {
  // GET /api/lessons → devuelve todas las lecciones
  getAll: () => api.get('/lessons'),

  // GET /api/lessons/5 → devuelve la lección con id=5
  getById: (id) => api.get(`/lessons/${id}`),

  // GET /api/lessons/progress → progreso del usuario en lecciones
  getProgress: () => api.get('/lessons/progress'),
}

// QUIZ
export const quizService = {
  // GET /api/quiz/lesson/3 → preguntas de la lección 3
  getByLesson: (lessonId) => api.get(`/quiz/lesson/${lessonId}`),

  // POST /api/quiz/submit → envía las respuestas y recibe puntuación
  submit: (data) => api.post('/quiz/submit', data),

  // GET /api/quiz/results → historial de resultados del usuario
  getResults: () => api.get('/quiz/results'),
}

// IA
export const aiService = {
  // POST /api/ai/chat → envía el historial de mensajes, recibe respuesta del tutor
  chat: (messages) => api.post('/ai/chat', { messages }),
}

export default api
