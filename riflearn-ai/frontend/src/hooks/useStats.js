// ============================================================
// useStats.js — Hook para cargar estadísticas del usuario
// ============================================================
// Centraliza la carga de datos del dashboard en un solo lugar.
// Cualquier componente que necesite estas stats las puede usar.
// ============================================================

import { useState, useEffect } from 'react'
import { lessonService, quizService } from '../services/api'

export function useStats() {
  const [lessons,  setLessons]  = useState([])
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [lRes, qRes] = await Promise.all([
          lessonService.getAll(),
          quizService.getResults(),
        ])
        if (!cancelled) {
          setLessons(lRes.data)
          setResults(qRes.data)
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // Estadísticas derivadas
  const completed    = lessons.filter(l => l.progress === 100).length
  const inProgress   = lessons.filter(l => l.progress > 0 && l.progress < 100).length
  const totalWords   = lessons.reduce((a, l) => a + Math.round((l.progress / 100) * (l.wordCount ?? 0)), 0)
  const globalPct    = lessons.length
    ? Math.round(lessons.reduce((a, l) => a + l.progress, 0) / lessons.length)
    : 0
  const bestScore    = results.length
    ? Math.max(...results.map(r => Math.round((r.score / r.totalQuestions) * 100)))
    : 0
  const level = completed === 0 ? 'Principiante' : completed < 3 ? 'Aprendiz' : completed < 6 ? 'Intermedio' : 'Avanzado'

  return {
    lessons, results, loading, error,
    stats: { completed, inProgress, totalWords, globalPct, bestScore, level }
  }
}
