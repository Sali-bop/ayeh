import { Link } from 'react-router-dom'

const VOCABULARY = [
  { es: 'Hola',    rif: 'Azul' },
  { es: 'Gracias', rif: 'Tanemmirt' },
  { es: 'Agua',    rif: 'Aman' },
  { es: 'Familia', rif: 'Tawacult' },
  { es: 'Paz',     rif: 'Lahna' },
]

const FEATURES = [
  { icon: '📚', title: 'Lecciones estructuradas', desc: 'Vocabulario, saludos, familia y números por nivel de dificultad.', tag: 'Básico → Avanzado' },
  { icon: '🎯', title: 'Quiz interactivo',        desc: 'Preguntas tipo test con retroalimentación inmediata y puntuación.', tag: 'Opción múltiple' },
  { icon: '🤖', title: 'Tutor con IA',            desc: 'Conversa en tarifit, recibe correcciones y ejercicios personalizados.', tag: 'Claude AI' },
]

const STATS = [
  { value: '200+', label: 'Palabras en tarifit' },
  { value: '6',    label: 'Lecciones disponibles' },
  { value: '24/7', label: 'Tutor IA activo' },
]

export default function Home() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Orbs decorativos adaptativos al tema */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-100px',
        width: '500px', height: '500px', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(212,148,58,0.10) 0%, transparent 70%)'
      }} />
      <div style={{
        position: 'absolute', bottom: '-50px', left: '-80px',
        width: '350px', height: '350px', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(74,143,168,0.08) 0%, transparent 70%)'
      }} />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 3rem', position: 'relative' }}>

        {/* Badge */}
        <div className="fade-up badge badge-accent" style={{ marginBottom: '1.5rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rif-accent)', display: 'inline-block' }} />
          Tarifit · Idioma amazigh del norte de Marruecos
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '520px' }}>
            <h1 className="fade-up-delay-1" style={{
              fontFamily: 'Fraunces, serif', fontSize: '52px', lineHeight: 1.08,
              fontWeight: 600, letterSpacing: '-1.5px', marginBottom: '1rem'
            }}>
              Aprende rifeño<br />
              con <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--rif-accent)' }}>inteligencia</em><br />
              artificial
            </h1>
            <p className="fade-up-delay-2" style={{
              fontSize: '16px', color: 'var(--rif-textMuted)', lineHeight: 1.7, marginBottom: '2rem'
            }}>
              La primera plataforma de aprendizaje del tarifit con IA generativa.
              Lecciones interactivas, quizzes y un tutor disponible las 24 horas.
            </p>
            <div className="fade-up-delay-3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Comenzar gratis →
              </Link>
              <Link to="/lecciones" className="btn-ghost" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Ver lecciones
              </Link>
            </div>
          </div>

          {/* Tarjeta flotante de vocabulario */}
          <div className="fade-up-delay-2 card" style={{ width: '220px', padding: '1.25rem', flexShrink: 0 }}>
            <p style={{ fontSize: '11px', color: 'var(--rif-textMuted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Vocabulario del día
            </p>
            {VOCABULARY.map(({ es, rif }) => (
              <div key={es} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid var(--rif-border)'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--rif-textMuted)' }}>{es}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--rif-accent)' }}>{rif}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 3rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: 'var(--rif-accent)' }}>
                {value}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--rif-textMuted)', maxWidth: '80px', lineHeight: 1.3 }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {FEATURES.map(({ icon, title, desc, tag }) => (
            <div key={title} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '28px' }}>{icon}</span>
                <span className="badge badge-accent" style={{ fontSize: '11px' }}>{tag}</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--rif-textMuted)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div className="card" style={{
          padding: '3rem', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(212,148,58,0.08) 0%, rgba(74,143,168,0.05) 100%)'
        }}>
          <p style={{ fontSize: '11px', color: 'var(--rif-accent)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Empieza hoy
          </p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '12px' }}>
            Conecta con tus raíces
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--rif-textMuted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            Únete a la plataforma que está preservando y enseñando el tarifit para las nuevas generaciones.
          </p>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Crear cuenta gratuita →
          </Link>
        </div>
      </section>
    </div>
  )
}
