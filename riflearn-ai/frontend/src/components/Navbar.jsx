import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { to: '/lecciones', label: 'Lecciones' },
  { to: '/quiz',      label: 'Quiz'      },
  { to: '/chat',      label: 'Tutor IA'  },
]

export default function Navbar() {
  const { isAuth, user, logout } = useAuth()
  const { themeName, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => pathname === path || pathname.startsWith(path)

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: '64px',
      borderBottom: '1px solid var(--rif-border)',
      background: 'var(--rif-bg)',
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(16px)',
    }}>

      {/* Logo Ayeh */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px',
          background: 'var(--rif-accent)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '15px', flexShrink: 0
        }}>ⴰ</div>
        <span style={{
          fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600,
          color: 'var(--rif-text)', letterSpacing: '-0.5px'
        }}>
          Ay<em style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--rif-accent)' }}>eh</em>
        </span>
      </Link>

      {/* Links centrales */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {NAV_LINKS.map(({ to, label }) => {
          const active = isActive(to)
          return (
            <Link key={to} to={to} style={{
              textDecoration: 'none', padding: '6px 14px', borderRadius: '8px',
              fontSize: '13px', fontWeight: active ? 500 : 400,
              color: active ? 'var(--rif-text)' : 'var(--rif-textMuted)',
              background: active ? 'var(--rif-bgCard)' : 'transparent',
              border: active ? '1px solid var(--rif-border)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            }}>{label}</Link>
          )
        })}
      </div>

      {/* Derecha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={toggleTheme} title={themeName === 'dark' ? 'Modo claro' : 'Modo oscuro'} style={{
          width: '34px', height: '34px', borderRadius: '8px',
          background: 'var(--rif-bgCard)', border: '1px solid var(--rif-border)',
          cursor: 'pointer', fontSize: '15px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--rif-text)',
        }}>
          {themeName === 'dark' ? '☀️' : '🌙'}
        </button>

        {isAuth ? (
          <>
            <Link to="/dashboard" style={{
              textDecoration: 'none', padding: '6px 14px', borderRadius: '8px',
              fontSize: '13px', color: 'var(--rif-textMuted)',
              background: isActive('/dashboard') ? 'var(--rif-bgCard)' : 'transparent',
              border: isActive('/dashboard') ? '1px solid var(--rif-border)' : '1px solid transparent',
            }}>Dashboard</Link>
            <Link to="/ajustes" title="Ajustes" style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: 'rgba(212,148,58,0.15)', border: '1px solid rgba(212,148,58,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 600,
              color: 'var(--rif-accent)', textDecoration: 'none',
            }}>
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </Link>
            <button onClick={handleLogout} style={{
              background: 'none', border: '1px solid var(--rif-border)',
              borderRadius: '8px', padding: '6px 14px',
              color: 'var(--rif-textMuted)', cursor: 'pointer', fontSize: '13px',
            }}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              fontSize: '13px', color: 'var(--rif-textMuted)', textDecoration: 'none',
              padding: '6px 14px', borderRadius: '8px',
            }}>Iniciar sesión</Link>
            <Link to="/register" style={{
              fontSize: '13px', padding: '7px 18px', borderRadius: '8px',
              background: 'var(--rif-accent)', color: 'var(--rif-accentText)',
              textDecoration: 'none', fontWeight: 500,
            }}>Empezar gratis</Link>
          </>
        )}
      </div>
    </nav>
  )
}
