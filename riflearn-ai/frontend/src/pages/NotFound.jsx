// ============================================================
// NotFound.jsx — Página 404
// ============================================================

import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const navigate  = useNavigate()
  const [count, setCount] = useState(5)

  // Redirige automáticamente al home después de 5 segundos
  useEffect(() => {
    if (count === 0) { navigate('/'); return }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, navigate])

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center'
    }}>
      {/* Número grande */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <p style={{
          fontFamily: 'Fraunces, serif', fontSize: '140px', fontWeight: 600,
          letterSpacing: '-8px', lineHeight: 1,
          color: 'var(--rif-accent)', opacity: 0.15, userSelect: 'none',
        }}>404</p>
        <span style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '64px'
        }}>🗺️</span>
      </div>

      <h1 style={{
        fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 600,
        letterSpacing: '-0.5px', marginBottom: '10px'
      }}>
        Página no encontrada
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--rif-textMuted)', marginBottom: '2rem', maxWidth: '360px', lineHeight: 1.6 }}>
        Esta ruta no existe. Volvemos al inicio en{' '}
        <span style={{ color: 'var(--rif-accent)', fontWeight: 500 }}>{count}</span> segundos.
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          Ir al inicio
        </Link>
        <button onClick={() => navigate(-1)} className="btn-ghost">
          ← Volver atrás
        </button>
      </div>

      {/* Frase en tarifit */}
      <p style={{ marginTop: '3rem', fontSize: '13px', color: 'var(--rif-textMuted)', fontStyle: 'italic' }}>
        "Ur illi walu" — No hay nada aquí en tarifit
      </p>
    </div>
  )
}
