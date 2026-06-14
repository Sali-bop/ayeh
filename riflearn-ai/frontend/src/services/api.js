import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001'

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ayeh_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ayeh_token')
      localStorage.removeItem('ayeh_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authService = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
}

export const lessonService = {
  getAll:         ()                 => api.get('/lessons'),
  getById:        (id)               => api.get(`/lessons/${id}`),
  updateProgress: (id, percentage)   => api.put(`/lessons/${id}/progress`, { percentage }),
}

export const quizService = {
  getByLesson: (lessonId) => api.get(`/quiz/lesson/${lessonId}`),
  submit:      (data)     => api.post('/quiz/submit', data),
  getResults:  ()         => api.get('/quiz/results'),
}

export const aiService = {
  chat: (messages) => api.post('/ai/chat', { messages }),
}

export default api
