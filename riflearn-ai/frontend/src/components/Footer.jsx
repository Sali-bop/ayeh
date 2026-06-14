import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--rif-border)',
      padding: '2rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '960px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>ⴰ</span>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 600 }}>
            Ay<em style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--rif-accent)' }}>eh</em>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[['Lecciones','/lecciones'],['Quiz','/quiz'],['Tutor IA','/chat'],['Ajustes','/ajustes']].map(([label, to]) => (
            <Link key={to} to={to} style={{
              fontSize: '12px', color: 'var(--rif-textMuted)', textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: 'var(--rif-textMuted)' }}>
          TFM · React + ASP.NET Core + Azure · 2024
        </p>
      </div>

      <div style={{ maxWidth: '960px', margin: '1rem auto 0', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--rif-textMuted)', fontStyle: 'italic' }}>
          "Tanemmirt i ufus-ik" — Gracias por tu ayuda · Preservando el tarifit para las nuevas generaciones
        </p>
      </div>
    </footer>
  )
}
