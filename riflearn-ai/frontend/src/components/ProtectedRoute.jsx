import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth()

  if (loading) return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'calc(100vh - 73px)', flexDirection:'column', gap:'16px'
    }}>
      <div style={{
        width:'40px', height:'40px', borderRadius:'50%',
        border:'3px solid var(--rif-border)',
        borderTopColor:'var(--rif-accent)',
        animation:'spin 0.8s linear infinite'
      }} />
      <p style={{ fontSize:'13px', color:'var(--rif-textMuted)' }}>Cargando...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return isAuth ? children : <Navigate to="/login" replace />
}
