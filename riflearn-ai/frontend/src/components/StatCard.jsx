// ============================================================
// StatCard.jsx — Tarjeta de estadística reutilizable
// ============================================================

export default function StatCard({ icon, value, label, accent = false }) {
  return (
    <div className="card" style={{ padding:'1.25rem' }}>
      <span style={{ fontSize:'22px' }}>{icon}</span>
      <p style={{
        fontFamily:'Fraunces,serif', fontSize:'30px', fontWeight:600,
        margin:'8px 0 4px',
        color: accent ? 'var(--rif-accent)' : 'var(--rif-text)'
      }}>
        {value}
      </p>
      <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', lineHeight:1.4 }}>{label}</p>
    </div>
  )
}
