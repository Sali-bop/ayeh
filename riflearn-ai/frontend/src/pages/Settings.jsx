// ============================================================
// Settings.jsx — Página de ajustes del usuario
// ============================================================
// Permite cambiar: tema (claro/oscuro), datos de perfil
// ============================================================

import { useState } from 'react'
import { useTheme, themes } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const THEME_OPTIONS = [
  {
    key: 'light',
    label: 'Claro',
    desc: 'Fondo crema, ideal para estudiar de día',
    preview: { bg: '#faf7f2', accent: '#c07d20', text: '#1a1209' },
    emoji: '☀️',
  },
  {
    key: 'dark',
    label: 'Oscuro',
    desc: 'Fondo oscuro, cómodo para la noche',
    preview: { bg: '#0f1117', accent: '#d4943a', text: '#f0ebe0' },
    emoji: '🌙',
  },
]

export default function Settings() {
  const { themeName, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)

  const handleThemeSelect = (key) => {
    if (key !== themeName) toggleTheme()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Cabecera */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontSize: '36px',
          fontWeight: 600, letterSpacing: '-1px', marginBottom: '6px'
        }}>Ajustes</h1>
        <p style={{ fontSize: '14px', color: 'var(--rif-textMuted)' }}>
          Personaliza tu experiencia en Ayeh
        </p>
      </div>

      {/* Sección perfil */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '13px', color: 'var(--rif-textMuted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Perfil
        </h2>
        <div style={{
          background: 'var(--rif-bgCard)', border: '1px solid var(--rif-border)',
          borderRadius: '16px', padding: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          {/* Avatar con inicial */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(212,148,58,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 600, color: 'var(--rif-accent)',
            fontFamily: 'Fraunces, serif', flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p style={{ fontWeight: 500, marginBottom: '2px' }}>{user?.name}</p>
            <p style={{ fontSize: '13px', color: 'var(--rif-textMuted)' }}>{user?.email}</p>
          </div>
        </div>
      </section>

      {/* Sección tema */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '13px', color: 'var(--rif-textMuted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Apariencia
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {THEME_OPTIONS.map(opt => (
            <button key={opt.key} onClick={() => handleThemeSelect(opt.key)}
              style={{
                textAlign: 'left', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer',
                border: `2px solid ${themeName === opt.key ? 'var(--rif-accent)' : 'var(--rif-border)'}`,
                background: themeName === opt.key ? 'rgba(212,148,58,0.06)' : 'var(--rif-bgCard)',
                transition: 'all 0.2s',
              }}>
              {/* Mini preview */}
              <div style={{
                width: '100%', height: '52px', borderRadius: '10px', marginBottom: '12px',
                background: opt.preview.bg, position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  width: '40px', height: '8px', borderRadius: '4px',
                  background: opt.preview.accent, opacity: 0.9
                }} />
                <div style={{
                  position: 'absolute', top: '26px', left: '10px',
                  width: '70px', height: '6px', borderRadius: '3px',
                  background: opt.preview.text, opacity: 0.15
                }} />
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  width: '28px', height: '14px', borderRadius: '7px',
                  background: opt.preview.accent
                }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>{opt.emoji}</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{opt.label}</span>
                {themeName === opt.key && (
                  <span style={{
                    marginLeft: 'auto', fontSize: '11px', padding: '2px 8px',
                    borderRadius: '10px', background: 'rgba(212,148,58,0.15)',
                    color: 'var(--rif-accent)'
                  }}>Activo</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--rif-textMuted)', lineHeight: 1.4 }}>{opt.desc}</p>
            </button>
          ))}
        </div>

        {saved && (
          <p style={{
            marginTop: '12px', fontSize: '13px', color: 'var(--rif-accent3)',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            ✓ Tema guardado correctamente
          </p>
        )}
      </section>

      {/* Sección paleta del Rif */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '13px', color: 'var(--rif-textMuted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Paleta — Colores del Rif
        </h2>
        <div style={{
          background: 'var(--rif-bgCard)', border: '1px solid var(--rif-border)',
          borderRadius: '16px', padding: '1.25rem'
        }}>
          {[
            { name: 'Azafrán',       color: 'var(--rif-accent)',  desc: 'Color principal' },
            { name: 'Mediterráneo',  color: 'var(--rif-accent2)', desc: 'Acento secundario' },
            { name: 'Verde Rif',     color: 'var(--rif-accent3)', desc: 'Éxito y progreso' },
          ].map(({ name, color, desc }) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0', borderBottom: '1px solid var(--rif-border)'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: color, flexShrink: 0
              }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{name}</p>
                <p style={{ fontSize: '12px', color: 'var(--rif-textMuted)' }}>{desc}</p>
              </div>
            </div>
          ))}
          <p style={{ fontSize: '12px', color: 'var(--rif-textMuted)', marginTop: '12px' }}>
            Paleta inspirada en los colores de la naturaleza y cultura del Rif marroquí.
          </p>
        </div>
      </section>

      {/* Sección info de la app */}
      <section>
        <h2 style={{ fontSize: '13px', color: 'var(--rif-textMuted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Acerca de
        </h2>
        <div style={{
          background: 'var(--rif-bgCard)', border: '1px solid var(--rif-border)',
          borderRadius: '16px', padding: '1.25rem'
        }}>
          {[
            ['Aplicación', 'Ayeh'],
            ['Versión',    '1.0.0'],
            ['Stack',      'React + ASP.NET Core + Azure'],
            ['IA',         'Claude (Anthropic)'],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--rif-border)',
              fontSize: '13px'
            }}>
              <span style={{ color: 'var(--rif-textMuted)' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
