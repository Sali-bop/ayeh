// ============================================================
// ErrorBoundary.jsx — Captura errores de renderizado de React
// ============================================================
// Si un componente falla, muestra un mensaje amigable
// en lugar de romper toda la app.
// ============================================================

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // En producción enviarías esto a un servicio de logging
    console.error('ErrorBoundary capturó:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: 'calc(100vh - 64px)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', textAlign: 'center',
        }}>
          <span style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</span>
          <h2 style={{
            fontFamily: 'Fraunces, serif', fontSize: '26px', fontWeight: 600,
            marginBottom: '8px', letterSpacing: '-0.5px',
          }}>
            Algo salió mal
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--rif-textMuted)', marginBottom: '1.5rem', maxWidth: '360px' }}>
            Ha ocurrido un error inesperado. Recarga la página o vuelve al inicio.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary">
              Recargar página
            </button>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
              className="btn-ghost">
              Ir al inicio
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: '2rem', padding: '1rem', borderRadius: '10px',
              background: 'rgba(200,80,80,0.08)', border: '1px solid rgba(200,80,80,0.2)',
              fontSize: '11px', color: '#e05555', textAlign: 'left',
              maxWidth: '600px', overflow: 'auto',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
