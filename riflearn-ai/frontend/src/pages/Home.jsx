import { Link } from 'react-router-dom'

const VOCABULARY = [
  { es:'Hola',      rif:'Azul' },
  { es:'Gracias',   rif:'Tanemmirt' },
  { es:'Familia',   rif:'Tawacult' },
  { es:'Mar',       rif:'Ilel' },
  { es:'Montaña',   rif:'Adrar' },
]

const FEATURES = [
  { icon:'📚', title:'9 lecciones', desc:'Saludos, familia, números, colores, cuerpo, casa, naturaleza del Rif, expresiones y comida.', tag:'Básico → Avanzado' },
  { icon:'🎯', title:'Quiz interactivo', desc:'Preguntas tipo test con retroalimentación inmediata y seguimiento de progreso real.', tag:'Opción múltiple' },
  { icon:'🤖', title:'Tutor IA', desc:'Conversa en tarifit, recibe correcciones y genera ejercicios personalizados 24/7.', tag:'Claude AI' },
]

const TIFINAGH = [
  { char:'ⴰ', name:'A' }, { char:'ⴱ', name:'B' }, { char:'ⵜ', name:'T' },
  { char:'ⵉ', name:'I' }, { char:'ⵣ', name:'Z' }, { char:'ⵔ', name:'R' },
  { char:'ⵎ', name:'M' }, { char:'ⵏ', name:'N' }, { char:'ⴼ', name:'F' },
]

export default function Home() {
  return (
    <div style={{ position:'relative', overflow:'hidden' }}>

      {/* Orbs */}
      <div style={{
        position:'absolute', top:'-120px', right:'-100px',
        width:'500px', height:'500px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle, rgba(212,148,58,0.10) 0%, transparent 70%)'
      }} />
      <div style={{
        position:'absolute', bottom:'-50px', left:'-80px',
        width:'350px', height:'350px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle, rgba(74,143,168,0.08) 0%, transparent 70%)'
      }} />

      {/* HERO */}
      <section style={{ maxWidth:'1100px', margin:'0 auto', padding:'5rem 2rem 3rem', position:'relative' }}>

        <div className="fade-up" style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.5rem' }}>
          <span style={{ fontSize:'22px', fontFamily:'serif' }}>ⵣ</span>
          <span className="badge badge-accent">Tarifit · Idioma amazigh del norte de Marruecos</span>
        </div>

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'3rem', flexWrap:'wrap' }}>
          <div style={{ maxWidth:'520px' }}>
            <h1 className="fade-up-delay-1" style={{
              fontFamily:'Fraunces,serif', fontSize:'52px', lineHeight:1.08,
              fontWeight:600, letterSpacing:'-1.5px', marginBottom:'1rem'
            }}>
              Aprende tarifit<br />
              con <em style={{ fontStyle:'italic', fontWeight:300, color:'var(--rif-accent)' }}>inteligencia</em><br />
              artificial
            </h1>
            <p className="fade-up-delay-2" style={{
              fontSize:'16px', color:'var(--rif-textMuted)', lineHeight:1.7, marginBottom:'2rem'
            }}>
              La primera plataforma digital de aprendizaje del tarifit con IA generativa.
              Vocabulario auténtico del Rif, con variantes dialectales de Alhucemas.
            </p>
            <div className="fade-up-delay-3" style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ textDecoration:'none', display:'inline-block' }}>
                Comenzar gratis →
              </Link>
              <Link to="/lecciones" className="btn-ghost" style={{ textDecoration:'none', display:'inline-block' }}>
                Ver lecciones
              </Link>
            </div>
          </div>

          {/* Tarjeta vocabulario */}
          <div className="fade-up-delay-2 card" style={{ width:'210px', padding:'1.25rem', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
              <span style={{ fontFamily:'serif', fontSize:'16px', color:'var(--rif-accent)' }}>ⵣ</span>
              <p style={{ fontSize:'11px', color:'var(--rif-textMuted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                Vocabulario del día
              </p>
            </div>
            {VOCABULARY.map(({ es, rif }) => (
              <div key={es} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'8px 0', borderBottom:'1px solid var(--rif-border)'
              }}>
                <span style={{ fontSize:'13px', color:'var(--rif-textMuted)' }}>{es}</span>
                <span style={{ fontSize:'13px', fontWeight:500, color:'var(--rif-accent)' }}>{rif}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIFINAGH */}
      <section style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 2rem 3rem' }}>
        <div className="card" style={{
          padding:'1.75rem',
          background:'linear-gradient(135deg, rgba(212,148,58,0.05) 0%, rgba(74,143,168,0.04) 100%)'
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1rem' }}>
            <span style={{ fontSize:'20px' }}>ⵣ</span>
            <div>
              <h3 style={{ fontSize:'14px', fontWeight:500 }}>Alfabeto Tifinagh</h3>
              <p style={{ fontSize:'12px', color:'var(--rif-textMuted)' }}>
                El sistema de escritura ancestral amazigh, usado desde hace más de 3.000 años
              </p>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {TIFINAGH.map(({ char, name }) => (
              <div key={char} style={{
                width:'52px', height:'52px', borderRadius:'10px',
                background:'var(--rif-bgCard)', border:'1px solid var(--rif-border)',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:'2px'
              }}>
                <span style={{ fontSize:'20px', color:'var(--rif-accent)', fontFamily:'serif' }}>{char}</span>
                <span style={{ fontSize:'9px', color:'var(--rif-textMuted)' }}>{name}</span>
              </div>
            ))}
            <div style={{
              width:'52px', height:'52px', borderRadius:'10px',
              background:'var(--rif-bgCard)', border:'1px solid var(--rif-border)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'18px', color:'var(--rif-textMuted)'
            }}>···</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 2rem 3rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px' }}>
          {FEATURES.map(({ icon, title, desc, tag }) => (
            <div key={title} className="card" style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
                <span style={{ fontSize:'26px' }}>{icon}</span>
                <span className="badge badge-accent" style={{ fontSize:'11px' }}>{tag}</span>
              </div>
              <h3 style={{ fontSize:'15px', fontWeight:500, marginBottom:'8px' }}>{title}</h3>
              <p style={{ fontSize:'13px', color:'var(--rif-textMuted)', lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE EL TARIFIT */}
      <section style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 2rem 4rem' }}>
        <div className="card" style={{ padding:'2.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.25rem' }}>
            <span style={{ fontFamily:'serif', fontSize:'24px', color:'var(--rif-accent)' }}>ⵣ</span>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:'24px', fontWeight:600, letterSpacing:'-0.5px' }}>
              Sobre el tarifit
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.5rem', marginBottom:'1.5rem' }}>
            {[
              { value:'4-5M', label:'hablantes en el mundo' },
              { value:'3000+', label:'años de historia escrita' },
              { value:'Rif', label:'región del norte de Marruecos' },
              { value:'Amazigh', label:'familia lingüística' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p style={{ fontFamily:'Fraunces,serif', fontSize:'28px', fontWeight:600, color:'var(--rif-accent)', marginBottom:'4px' }}>{value}</p>
                <p style={{ fontSize:'12px', color:'var(--rif-textMuted)' }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize:'14px', color:'var(--rif-textMuted)', lineHeight:1.7, maxWidth:'600px' }}>
            El tarifit es una lengua amazigh hablada principalmente en el Rif marroquí.
            A pesar de su riqueza cultural, cuenta con muy pocas herramientas digitales
            para su aprendizaje y preservación. Ayeh nació para cambiar eso.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 2rem 6rem' }}>
        <div className="card" style={{
          padding:'3rem', textAlign:'center',
          background:'linear-gradient(135deg, rgba(212,148,58,0.08) 0%, rgba(74,143,168,0.05) 100%)'
        }}>
          <span style={{ fontFamily:'serif', fontSize:'32px', display:'block', marginBottom:'12px', color:'var(--rif-accent)' }}>ⵣ</span>
          <h2 style={{ fontFamily:'Fraunces,serif', fontSize:'32px', fontWeight:600, letterSpacing:'-0.5px', marginBottom:'12px' }}>
            Conecta con tus raíces
          </h2>
          <p style={{ fontSize:'14px', color:'var(--rif-textMuted)', marginBottom:'2rem', maxWidth:'400px', margin:'0 auto 2rem' }}>
            Únete a la plataforma que está preservando y digitalizando el tarifit para las nuevas generaciones de la diáspora.
          </p>
          <Link to="/register" className="btn-primary" style={{ textDecoration:'none', display:'inline-block' }}>
            Crear cuenta gratuita →
          </Link>
        </div>
      </section>
    </div>
  )
}
