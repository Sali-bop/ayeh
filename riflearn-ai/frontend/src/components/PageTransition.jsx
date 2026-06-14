// ============================================================
// PageTransition.jsx — Envuelve cada página con animación fadeUp
// ============================================================
// Uso: <PageTransition><TuPagina /></PageTransition>
// ============================================================

import { useEffect, useState } from 'react'

export default function PageTransition({ children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Pequeño delay para que la animación se vea al navegar
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    }}>
      {children}
    </div>
  )
}
