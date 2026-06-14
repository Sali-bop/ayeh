import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

export default function Register() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      const res = await authService.register(form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'calc(100vh - 73px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1.5rem' }}>
      <div style={{ width:'100%', maxWidth:'380px' }}>

        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <span style={{ fontSize:'36px', display:'block', marginBottom:'12px' }}>🌍</span>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'30px', fontWeight:600, letterSpacing:'-0.5px', marginBottom:'6px' }}>
            Empieza a aprender
          </h1>
          <p style={{ fontSize:'14px', color:'var(--rif-textMuted)' }}>
            Crea tu cuenta gratuita en segundos
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

          {[
            { name:'name',     label:'Tu nombre',           type:'text',     placeholder:'Salima' },
            { name:'email',    label:'Correo electrónico',  type:'email',    placeholder:'tu@email.com' },
            { name:'password', label:'Contraseña',          type:'password', placeholder:'Mínimo 6 caracteres' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label style={{ display:'block', fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'6px' }}>
                {label}
              </label>
              <input type={type} name={name} required
                value={form[name]} onChange={handleChange}
                placeholder={placeholder}
                className="input-field"
              />
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop:'4px', padding:'13px' }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:'13px', color:'var(--rif-textMuted)', marginTop:'1.5rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color:'var(--rif-accent)', textDecoration:'none', fontWeight:500 }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
