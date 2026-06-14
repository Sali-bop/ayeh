// ============================================================
// Lessons.jsx — Página de lecciones conectada al backend
// ============================================================
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { lessonService } from '../services/api'

// Datos de fallback si el backend no está disponible
const FALLBACK = [
  { id:1, title:'Saludos básicos', category:'Básico',     icon:'👋', wordCount:8,  progress:0 },
  { id:2, title:'Familia',         category:'Básico',     icon:'👨‍👩‍👧', wordCount:10, progress:0 },
  { id:3, title:'Números 1-20',    category:'Básico',     icon:'🔢', wordCount:20, progress:0 },
  { id:4, title:'Colores',         category:'Intermedio', icon:'🎨', wordCount:8,  progress:0 },
  { id:5, title:'Animales',        category:'Intermedio', icon:'🐾', wordCount:12, progress:0 },
  { id:6, title:'Comida',          category:'Intermedio', icon:'🍲', wordCount:15, progress:0 },
]

const CATEGORIES = ['Todos', 'Básico', 'Intermedio', 'Avanzado']

export default function Lessons() {
  const [lessons,  setLessons]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('Todos')
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    lessonService.getAll()
      .then(res => setLessons(res.data))
      .catch(() => setLessons(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'Todos' ? lessons : lessons.filter(l => l.category === filter)

  if (selected) return (
    <LessonDetail
      lessonId={selected}
      onBack={() => setSelected(null)}
      onQuiz={(id) => navigate(`/quiz?lesson=${id}`)}
    />
  )

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Cabecera */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'40px', fontWeight:600, letterSpacing:'-1px', marginBottom:'6px' }}>
          Lecciones
        </h1>
        <p style={{ fontSize:'14px', color:'var(--rif-textMuted)' }}>
          Aprende tarifit paso a paso, de lo básico a lo avanzado.
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'2rem', flexWrap:'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding:'7px 18px', borderRadius:'20px', fontSize:'13px', cursor:'pointer',
            border: filter === cat ? 'none' : '1px solid var(--rif-border)',
            background: filter === cat ? 'var(--rif-accent)' : 'transparent',
            color: filter === cat ? 'var(--rif-accentText)' : 'var(--rif-textMuted)',
            fontWeight: filter === cat ? 500 : 400, transition:'all 0.2s'
          }}>{cat}</button>
        ))}
        {!loading && (
          <span style={{ marginLeft:'auto', fontSize:'13px', color:'var(--rif-textMuted)', alignSelf:'center' }}>
            {filtered.length} lección{filtered.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'14px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ height:'160px', borderRadius:'16px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'14px' }}>
          {filtered.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onClick={() => setSelected(lesson.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function LessonCard({ lesson, onClick }) {
  const pct = lesson.progress ?? 0
  const statusLabel = pct === 100 ? 'Completada' : pct > 0 ? 'En curso' : 'Sin empezar'
  const statusStyle = pct === 100
    ? { background:'rgba(90,138,90,0.12)', color:'var(--rif-accent3)', border:'1px solid rgba(90,138,90,0.25)' }
    : pct > 0
    ? { background:'rgba(212,148,58,0.12)', color:'var(--rif-accent)', border:'1px solid rgba(212,148,58,0.25)' }
    : { background:'var(--rif-bgCard)', color:'var(--rif-textMuted)', border:'1px solid var(--rif-border)' }

  return (
    <button onClick={onClick} style={{
      textAlign:'left', padding:'1.25rem', borderRadius:'16px', cursor:'pointer',
      background:'var(--rif-bgCard)', border:'1px solid var(--rif-border)',
      transition:'all 0.2s', width:'100%'
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--rif-borderHover)'; e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--rif-border)'; e.currentTarget.style.transform='translateY(0)' }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
        <span style={{ fontSize:'32px' }}>{lesson.icon}</span>
        <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'12px', ...statusStyle }}>
          {pct === 100 ? '✓ ' : ''}{statusLabel}
        </span>
      </div>
      <p style={{ fontSize:'15px', fontWeight:500, marginBottom:'4px' }}>{lesson.title}</p>
      <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'14px' }}>
        {lesson.wordCount} palabras · {lesson.category}
      </p>
      <div style={{ width:'100%', height:'4px', borderRadius:'2px', background:'var(--rif-border)' }}>
        <div style={{
          height:'4px', borderRadius:'2px', transition:'width 0.8s ease',
          background: pct === 100 ? 'var(--rif-accent3)' : 'var(--rif-accent)',
          width:`${pct}%`
        }} />
      </div>
      <p style={{ fontSize:'11px', color:'var(--rif-textMuted)', marginTop:'6px' }}>{pct}% completado</p>
    </button>
  )
}

// ── Detalle de lección ────────────────────────────────────────
const FALLBACK_DETAIL = {
  1: {
    id:1, title:'Saludos básicos', icon:'👋', category:'Básico', progress:0,
    vocabItems:[
      { id:1, spanish:'Hola',         tarifit:'Azul',      exampleSentence:'Azul, labas?' },
      { id:2, spanish:'Adiós',        tarifit:'Akka',      exampleSentence:'Akka, a zin!' },
      { id:3, spanish:'¿Cómo estás?', tarifit:'Labas?',    exampleSentence:'Azul! Labas?' },
      { id:4, spanish:'Bien',         tarifit:'Labas',     exampleSentence:'Labas, tanemmirt' },
      { id:5, spanish:'Gracias',      tarifit:'Tanemmirt', exampleSentence:'Tanemmirt, a gma' },
      { id:6, spanish:'De nada',      tarifit:'Wakha',     exampleSentence:'Wakha, ur illi walu' },
      { id:7, spanish:'Por favor',    tarifit:'Rjak',      exampleSentence:'Rjak, ini yas' },
      { id:8, spanish:'Perdona',      tarifit:'Samḥ',      exampleSentence:'Samḥ iyi, a gma' },
    ]
  },
  2: {
    id:2, title:'Familia', icon:'👨‍👩‍👧', category:'Básico', progress:0,
    vocabItems:[
      { id:9,  spanish:'Padre',   tarifit:'Baba',     exampleSentence:'Baba inu d ameqqran' },
      { id:10, spanish:'Madre',   tarifit:'Yemma',    exampleSentence:'Yemma inu tessen arifen' },
      { id:11, spanish:'Hermano', tarifit:'Gma',      exampleSentence:'Gma inu d amzyan' },
      { id:12, spanish:'Hermana', tarifit:'Ultma',    exampleSentence:'Ultma inu tga tamɣart' },
      { id:13, spanish:'Familia', tarifit:'Tawacult', exampleSentence:'Tawacult inu d tamqqrant' },
    ]
  },
  3: {
    id:3, title:'Números 1-20', icon:'🔢', category:'Básico', progress:0,
    vocabItems:[
      { id:14, spanish:'Uno',    tarifit:'Yan'     },
      { id:15, spanish:'Dos',    tarifit:'Sin'     },
      { id:16, spanish:'Tres',   tarifit:'Kraḍ'    },
      { id:17, spanish:'Cuatro', tarifit:'Kkuẓ'    },
      { id:18, spanish:'Cinco',  tarifit:'Semmus'  },
      { id:19, spanish:'Diez',   tarifit:'Mraw'    },
      { id:20, spanish:'Veinte', tarifit:'Ţţamraw' },
    ]
  },
}

function LessonDetail({ lessonId, onBack, onQuiz }) {
  const [lesson,  setLesson]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [flipped, setFlipped] = useState(null)
  const [mode,    setMode]    = useState('cards') // 'cards' | 'list'

  useEffect(() => {
    lessonService.getById(lessonId)
      .then(res => setLesson(res.data))
      .catch(() => setLesson(FALLBACK_DETAIL[lessonId] ?? null))
      .finally(() => setLoading(false))
  }, [lessonId])

  const markProgress = async (pct) => {
    try { await lessonService.updateProgress(lessonId, pct) } catch {}
  }

  if (loading) return (
    <div style={{ maxWidth:'720px', margin:'0 auto', padding:'3rem 1.5rem' }}>
      <div className="skeleton" style={{ height:'40px', width:'200px', marginBottom:'2rem' }} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
        {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:'100px', borderRadius:'12px' }} />)}
      </div>
    </div>
  )

  if (!lesson) return (
    <div style={{ maxWidth:'720px', margin:'4rem auto', padding:'0 1.5rem', textAlign:'center' }}>
      <p style={{ fontSize:'14px', color:'var(--rif-textMuted)' }}>Lección no encontrada.</p>
      <button onClick={onBack} className="btn-ghost" style={{ marginTop:'1rem' }}>← Volver</button>
    </div>
  )

  return (
    <div style={{ maxWidth:'720px', margin:'0 auto', padding:'3rem 1.5rem' }}>

      {/* Nav */}
      <button onClick={onBack} style={{
        background:'none', border:'none', cursor:'pointer', fontSize:'13px',
        color:'var(--rif-textMuted)', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'6px'
      }}>← Volver a lecciones</button>

      {/* Cabecera */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.5rem' }}>
        <span style={{ fontSize:'40px' }}>{lesson.icon}</span>
        <div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'32px', fontWeight:600, letterSpacing:'-0.5px' }}>
            {lesson.title}
          </h1>
          <p style={{ fontSize:'13px', color:'var(--rif-textMuted)' }}>
            {lesson.vocabItems?.length ?? 0} palabras · {lesson.category}
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'6px' }}>
          <span>Progreso</span><span>{lesson.progress ?? 0}%</span>
        </div>
        <div style={{ height:'6px', borderRadius:'3px', background:'var(--rif-bgCard)', border:'1px solid var(--rif-border)' }}>
          <div style={{ height:'6px', borderRadius:'3px', background:'var(--rif-accent)', width:`${lesson.progress ?? 0}%`, transition:'width 0.8s' }} />
        </div>
      </div>

      {/* Toggle modo */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem' }}>
        {[['cards','🃏 Tarjetas'],['list','📋 Lista']].map(([m,label]) => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding:'6px 16px', borderRadius:'20px', fontSize:'13px', cursor:'pointer',
            border: mode===m ? 'none' : '1px solid var(--rif-border)',
            background: mode===m ? 'var(--rif-accent)' : 'transparent',
            color: mode===m ? 'var(--rif-accentText)' : 'var(--rif-textMuted)',
          }}>{label}</button>
        ))}
      </div>

      {/* Modo tarjetas — flip */}
      {mode === 'cards' && (
        <>
          <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'1rem' }}>
            Haz clic en una tarjeta para ver la traducción en tarifit
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'10px', marginBottom:'2rem' }}>
            {lesson.vocabItems?.map(v => (
              <button key={v.id} onClick={() => { setFlipped(f => f===v.id ? null : v.id); markProgress(Math.min(100, (lesson.progress ?? 0) + 10)) }}
                style={{
                  padding:'1.25rem', borderRadius:'14px', cursor:'pointer', textAlign:'center',
                  border: flipped===v.id ? '2px solid var(--rif-accent)' : '1px solid var(--rif-border)',
                  background: flipped===v.id ? 'rgba(212,148,58,0.08)' : 'var(--rif-bgCard)',
                  transition:'all 0.2s', minHeight:'100px',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px'
                }}>
                <p style={{ fontSize:'16px', fontWeight:500, color: flipped===v.id ? 'var(--rif-accent)' : 'var(--rif-text)' }}>
                  {flipped===v.id ? v.tarifit : v.spanish}
                </p>
                <p style={{ fontSize:'11px', color:'var(--rif-textMuted)' }}>
                  {flipped===v.id ? 'en tarifit' : 'en español · toca para ver'}
                </p>
                {flipped===v.id && v.exampleSentence && (
                  <p style={{ fontSize:'11px', color:'var(--rif-textMuted)', fontStyle:'italic', marginTop:'4px' }}>
                    "{v.exampleSentence}"
                  </p>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Modo lista */}
      {mode === 'list' && (
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ borderRadius:'14px', border:'1px solid var(--rif-border)', overflow:'hidden' }}>
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
              padding:'10px 16px', background:'var(--rif-bgCard)',
              fontSize:'11px', color:'var(--rif-textMuted)', textTransform:'uppercase', letterSpacing:'0.05em',
              borderBottom:'1px solid var(--rif-border)'
            }}>
              <span>Español</span><span>Tarifit</span><span>Ejemplo</span>
            </div>
            {lesson.vocabItems?.map((v, i) => (
              <div key={v.id} style={{
                display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                padding:'12px 16px', fontSize:'13px',
                borderBottom: i < lesson.vocabItems.length-1 ? '1px solid var(--rif-border)' : 'none',
                background: i%2===0 ? 'transparent' : 'var(--rif-bgCard)'
              }}>
                <span>{v.spanish}</span>
                <span style={{ color:'var(--rif-accent)', fontWeight:500 }}>{v.tarifit}</span>
                <span style={{ color:'var(--rif-textMuted)', fontStyle:'italic', fontSize:'12px' }}>{v.exampleSentence ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón quiz */}
      <button onClick={() => onQuiz(lessonId)} className="btn-primary">
        Practicar con quiz →
      </button>
    </div>
  )
}
