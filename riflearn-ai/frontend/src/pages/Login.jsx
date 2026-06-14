import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'calc(100vh - 73px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem' }}>
      <div style={{ width:'100%', maxWidth:'380px' }}>

        {/* Cabecera */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <span style={{ fontSize:'36px', display:'block', marginBottom:'12px' }}>🔐</span>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'30px', fontWeight:600, letterSpacing:'-0.5px', marginBottom:'6px' }}>
            Bienvenido de nuevo
          </h1>
          <p style={{ fontSize:'14px', color:'var(--rif-textMuted)' }}>
            Inicia sesión para continuar aprendiendo
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {error && (
            <div style={{
              padding:'12px 16px', borderRadius:'12px',
              background:'rgba(200,80,80,0.08)', border:'1px solid rgba(200,80,80,0.2)',
              color:'#e05555', fontSize:'13px'
            }}>{error}</div>
          )}

          <div>
            <label style={{ display:'block', fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'6px' }}>
              Correo electrónico
            </label>
            <input type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="tu@email.com"
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'6px' }}>
              Contraseña
            </label>
            <input type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop:'4px', padding:'13px' }}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:'13px', color:'var(--rif-textMuted)', marginTop:'1.5rem' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color:'var(--rif-accent)', textDecoration:'none', fontWeight:500 }}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
