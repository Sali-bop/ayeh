// ============================================================
// ProgressBar.jsx — Barra de progreso reutilizable
// ============================================================
// Props:
//   value    → porcentaje (0-100)
//   height   → altura en px (default 6)
//   color    → color de la barra (default var(--rif-accent))
//   animated → anima la entrada (default true)
//   showLabel → muestra el % a la derecha (default false)
// ============================================================

export default function ProgressBar({
  value = 0,
  height = 6,
  color = 'var(--rif-accent)',
  animated = true,
  showLabel = false,
  style = {}
}) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', ...style }}>
      <div style={{
        flex:1, height:`${height}px`, borderRadius:`${height/2}px`,
        background:'var(--rif-bgCard)', border:'1px solid var(--rif-border)',
        overflow:'hidden'
      }}>
        <div style={{
          height:`${height}px`,
          borderRadius:`${height/2}px`,
          background: color,
          width:`${Math.min(100, Math.max(0, value))}%`,
          transition: animated ? 'width 0.8s ease' : 'none',
        }} />
      </div>
      {showLabel && (
        <span style={{ fontSize:'12px', color:'var(--rif-textMuted)', minWidth:'32px', textAlign:'right' }}>
          {value}%
        </span>
      )}
    </div>
  )
}
