// ============================================================
// Toast.jsx — Notificaciones temporales
// ============================================================
// Uso: import { useToast } from '../components/Toast'
//      const { showToast, ToastContainer } = useToast()
//      showToast('¡Guardado!', 'success')
// ============================================================

import { useState, useCallback } from 'react'

const COLORS = {
  success: { bg: 'rgba(90,138,90,0.12)',  border: 'rgba(90,138,90,0.3)',  color: 'var(--rif-accent3)', icon: '✓' },
  error:   { bg: 'rgba(200,80,80,0.10)',  border: 'rgba(200,80,80,0.25)', color: '#e05555',            icon: '✗' },
  info:    { bg: 'rgba(74,143,168,0.10)', border: 'rgba(74,143,168,0.25)',color: 'var(--rif-accent2)', icon: 'ℹ' },
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const ToastContainer = () => (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '8px',
      zIndex: 1000, pointerEvents: 'none',
    }}>
      {toasts.map(({ id, message, type }) => {
        const s = COLORS[type] ?? COLORS.info
        return (
          <div key={id} style={{
            padding: '12px 16px', borderRadius: '12px',
            background: s.bg, border: `1px solid ${s.border}`,
            color: s.color, fontSize: '13px', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: 'var(--rif-shadow)',
            animation: 'fadeUp 0.3s ease forwards',
            pointerEvents: 'auto', minWidth: '200px',
          }}>
            <span>{s.icon}</span>
            <span style={{ color: 'var(--rif-text)' }}>{message}</span>
          </div>
        )
      })}
    </div>
  )

  return { showToast, ToastContainer }
}
