// ============================================================
// Dashboard.jsx — Panel principal del usuario
// ============================================================
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStats } from '../hooks/useStats'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'

const ACHIEVEMENTS = [
  { label:'Primera lección',  icon:'📚', key:'firstLesson'  },
  { label:'Primer quiz',      icon:'🎯', key:'firstQuiz'    },
  { label:'50 palabras',      icon:'💬', key:'fifty'        },
  { label:'7 días seguidos',  icon:'🔥', key:'streak'       },
  { label:'Nivel intermedio', icon:'⭐', key:'intermediate' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { lessons, results, loading, stats } = useStats()
  const { completed, inProgress, totalWords, globalPct, bestScore, level } = stats

  // Calcula qué logros están desbloqueados
  const unlocked = {
    firstLesson:  completed >= 1,
    firstQuiz:    results.length >= 1,
    fifty:        totalWords >= 50,
    streak:       false, // requeriría lógica de días — pendiente
    intermediate: completed >= 3,
  }

  return (
    <div style={{ maxWidth:'960px', margin:'0 auto', padding:'3rem 1.5rem' }}>

      {/* Saludo */}
      <div className="fade-up" style={{ marginBottom:'2.5rem' }}>
        <h1 style={{
          fontFamily:'Fraunces,serif', fontSize:'42px', fontWeight:600,
          letterSpacing:'-1.5px', marginBottom:'6px', lineHeight:1.1
        }}>
          Azul,{' '}
          <em style={{ fontStyle:'italic', fontWeight:300, color:'var(--rif-accent)' }}>
            {user?.name ?? 'estudiante'}
          </em>{' '}
          👋
        </h1>
        <p style={{ fontSize:'14px', color:'var(--rif-textMuted)' }}>
          Cada palabra que aprendes es un puente a tus raíces.
        </p>
      </div>

      {/* Progreso global */}
      <div className="card fade-up-delay-1" style={{
        padding:'1.75rem', marginBottom:'1.5rem',
        background:'linear-gradient(135deg, rgba(212,148,58,0.06) 0%, rgba(74,143,168,0.04) 100%)'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
          <div>
            <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
              Nivel actual
            </p>
            <p style={{ fontSize:'18px', fontWeight:500 }}>{loading ? '…' : level}</p>
          </div>
          <span style={{ fontFamily:'Fraunces,serif', fontSize:'42px', fontWeight:600, color:'var(--rif-accent)', lineHeight:1 }}>
            {loading ? '…' : `${globalPct}%`}
          </span>
        </div>
        <ProgressBar
          value={loading ? 0 : globalPct}
          height={10}
          color={globalPct === 100 ? 'var(--rif-accent3)' : 'var(--rif-accent)'}
        />
        {!loading && inProgress > 0 && (
          <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', marginTop:'10px' }}>
            {inProgress} lección{inProgress > 1 ? 'es' : ''} en curso · {completed} completada{completed !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="fade-up-delay-2" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px', marginBottom:'1.5rem' }}>
        <StatCard icon="📚" value={loading ? '…' : completed}    label="Lecciones completadas" accent />
        <StatCard icon="💬" value={loading ? '…' : totalWords}   label="Palabras aprendidas" />
        <StatCard icon="🎯" value={loading ? '…' : results.length} label="Quizzes realizados" />
        <StatCard icon="🏆" value={loading ? '…' : (results.length ? `${bestScore}%` : '—')} label="Mejor puntuación en quiz" accent />
      </div>

      {/* Lecciones + Logros */}
      <div className="fade-up-delay-3" style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'1.5rem', marginBottom:'1.5rem', alignItems:'start' }}>

        {/* Lecciones recientes */}
        <div className="card" style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <h2 style={{ fontSize:'14px', fontWeight:500 }}>Lecciones en curso</h2>
            <Link to="/lecciones" style={{ fontSize:'12px', color:'var(--rif-accent)', textDecoration:'none' }}>
              Ver todas →
            </Link>
          </div>

          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:'42px', borderRadius:'8px' }} />)}
            </div>
          ) : lessons.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem 0' }}>
              <p style={{ fontSize:'13px', color:'var(--rif-textMuted)', marginBottom:'12px' }}>
                Aún no has empezado ninguna lección
              </p>
              <Link to="/lecciones" className="btn-primary" style={{ textDecoration:'none', display:'inline-block', fontSize:'13px' }}>
                Empezar ahora →
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {lessons.slice(0, 6).map(l => (
                <div key={l.id}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ fontSize:'18px' }}>{l.icon}</span>
                      <span style={{ fontSize:'13px', fontWeight:500 }}>{l.title}</span>
                      <span className="badge badge-accent" style={{ fontSize:'10px', padding:'2px 8px' }}>
                        {l.category}
                      </span>
                    </div>
                    <span style={{ fontSize:'12px', color:'var(--rif-textMuted)' }}>{l.progress}%</span>
                  </div>
                  <ProgressBar
                    value={l.progress}
                    height={4}
                    color={l.progress === 100 ? 'var(--rif-accent3)' : 'var(--rif-accent)'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logros */}
        <div className="card" style={{ padding:'1.5rem', minWidth:'210px' }}>
          <h2 style={{ fontSize:'14px', fontWeight:500, marginBottom:'1.25rem' }}>🏆 Logros</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {ACHIEVEMENTS.map(({ label, icon, key }) => {
              const done = unlocked[key]
              return (
                <div key={key} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{
                    width:'32px', height:'32px', borderRadius:'9px', flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px',
                    background: done ? 'rgba(212,148,58,0.15)' : 'var(--rif-bgCard)',
                    border:`1px solid ${done ? 'rgba(212,148,58,0.3)' : 'var(--rif-border)'}`,
                    filter: done ? 'none' : 'grayscale(1) opacity(0.4)'
                  }}>{icon}</div>
                  <span style={{ fontSize:'12px', color: done ? 'var(--rif-text)' : 'var(--rif-textMuted)' }}>
                    {label}
                  </span>
                  {done && <span style={{ marginLeft:'auto', fontSize:'11px', color:'var(--rif-accent)' }}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Historial de quiz */}
      {results.length > 0 && (
        <div className="card" style={{ padding:'1.5rem', marginBottom:'1.5rem' }}>
          <h2 style={{ fontSize:'14px', fontWeight:500, marginBottom:'1.25rem' }}>Últimos quizzes</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {results.slice(0, 4).map((r, i) => {
              const pct = Math.round((r.score / r.totalQuestions) * 100)
              return (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                  borderRadius:'10px', background:'var(--rif-bgCard)', border:'1px solid var(--rif-border)'
                }}>
                  <span style={{ fontSize:'16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '🎯' : '📚'}</span>
                  <span style={{ fontSize:'13px', flex:1 }}>{r.lesson ?? 'Quiz'}</span>
                  <span style={{ fontSize:'13px', fontWeight:500, color: pct >= 70 ? 'var(--rif-accent3)' : 'var(--rif-accent)' }}>
                    {r.score}/{r.totalQuestions}
                  </span>
                  <span className="badge" style={{
                    fontSize:'11px', padding:'3px 10px',
                    background: pct === 100 ? 'rgba(90,138,90,0.12)' : 'rgba(212,148,58,0.12)',
                    color: pct === 100 ? 'var(--rif-accent3)' : 'var(--rif-accent)',
                    border: `1px solid ${pct === 100 ? 'rgba(90,138,90,0.25)' : 'rgba(212,148,58,0.25)'}`
                  }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CTA Tutor IA */}
      <div style={{
        padding:'1.75rem', borderRadius:'16px',
        border:'1px solid rgba(212,148,58,0.2)',
        background:'linear-gradient(135deg, rgba(212,148,58,0.07) 0%, rgba(74,143,168,0.05) 100%)',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap'
      }}>
        <div>
          <p style={{ fontSize:'15px', fontWeight:500, marginBottom:'4px' }}>
            🤖 Practica con tu tutor IA
          </p>
          <p style={{ fontSize:'13px', color:'var(--rif-textMuted)' }}>
            Ejercicios personalizados y conversación en tarifit, disponible 24/7
          </p>
        </div>
        <Link to="/chat" className="btn-primary" style={{ textDecoration:'none', whiteSpace:'nowrap' }}>
          Abrir tutor →
        </Link>
      </div>
    </div>
  )
}
