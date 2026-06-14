// ============================================================
// ThemeContext.jsx — Sistema de temas claro/oscuro
// ============================================================
// Paleta inspirada en el Rif:
//   Tierra (marrón cálido), Azafrán (dorado), 
//   Azul mediterráneo, Verde montaña
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

// Paletas de color para cada tema
export const themes = {
  dark: {
    name: 'dark',
    // Fondos
    bg:         '#0f1117',
    bgSurface:  '#161b27',
    bgCard:     'rgba(255,255,255,0.04)',
    // Texto
    text:       '#f0ebe0',
    textMuted:  'rgba(240,235,224,0.5)',
    // Acento principal — Azafrán del Rif
    accent:     '#d4943a',
    accentText: '#0f1117',
    // Acento secundario — Azul mediterráneo
    accent2:    '#4a8fa8',
    // Acento terciario — Verde Rif
    accent3:    '#5a8a5a',
    // Bordes
    border:     'rgba(240,235,224,0.1)',
    borderHover:'rgba(240,235,224,0.22)',
    // Sombras
    shadow:     '0 4px 24px rgba(0,0,0,0.4)',
  },
  light: {
    name: 'light',
    // Fondos
    bg:         '#faf7f2',
    bgSurface:  '#ffffff',
    bgCard:     'rgba(0,0,0,0.03)',
    // Texto
    text:       '#1a1209',
    textMuted:  'rgba(26,18,9,0.5)',
    // Acento principal — Azafrán del Rif
    accent:     '#c07d20',
    accentText: '#ffffff',
    // Acento secundario — Azul mediterráneo
    accent2:    '#2d6e8a',
    // Acento terciario — Verde Rif
    accent3:    '#3d6b3d',
    // Bordes
    border:     'rgba(26,18,9,0.1)',
    borderHover:'rgba(26,18,9,0.22)',
    // Sombras
    shadow:     '0 4px 24px rgba(0,0,0,0.08)',
  }
}

export function ThemeProvider({ children }) {
  // Lee el tema guardado, por defecto 'dark'
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem('ayeh_theme') || 'dark'
  )

  const theme = themes[themeName]

  // Aplica las variables CSS al :root cuando cambia el tema
  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') root.style.setProperty(`--rif-${key}`, value)
    })
    // Clase en body para estilos globales (scrollbar, etc.)
    document.body.classList.toggle('theme-light', themeName === 'light')
    document.body.classList.toggle('theme-dark',  themeName === 'dark')
    localStorage.setItem('ayeh_theme', themeName)
  }, [themeName, theme])

  const toggleTheme = () =>
    setThemeName(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
