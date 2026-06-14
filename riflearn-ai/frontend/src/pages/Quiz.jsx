// ============================================================
// Quiz.jsx — Quiz conectado al backend real
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { quizService, lessonService } from '../services/api'

// Preguntas de fallback si no hay backend
const FALLBACK_QUESTIONS = [
  { id:1, questionText:'¿Qué significa "Azul" en rifeño?',    type:'MultipleChoice', options:['Gracias','Hola','Familia','Agua'],          correctAnswer:'Hola'      },
  { id:2, questionText:'¿Cómo se dice "Gracias" en tarifit?', type:'MultipleChoice', options:['Azul','Aman','Tanemmirt','Labas'],           correctAnswer:'Tanemmirt' },
  { id:3, questionText:'_____ significa "Agua" en español.',  type:'FillInTheBlank', options:[], hint:'Empieza por A',                      correctAnswer:'Aman'      },
  { id:4, questionText:'¿Qué significa "Yemma"?',            type:'MultipleChoice', options:['Padre','Hermano','Madre','Hijo'],             correctAnswer:'Madre'     },
  { id:5, questionText:'¿Cómo se dice "Uno" en tarifit?',    type:'MultipleChoice', options:['Sin','Kraḍ','Mraw','Yan'],                   correctAnswer:'Yan'       },
]

export default function Quiz() {
  const [searchParams]  = useSearchParams()
  const lessonId        = searchParams.get('lesson') ? parseInt(searchParams.get('lesson')) : null

  const [questions, setQuestions] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [fillInput, setFillInput] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [answers,   setAnswers]   = useState([])
  const [score,     setScore]     = useState(0)
  const [finished,  setFinished]  = useState(false)
  const [submitting,setSubmitting]= useState(false)
  const [lessons,   setLessons]   = useState([])
  const [selLesson, setSelLesson] = useState(lessonId)

  // Carga lista de lecciones para el selector
  useEffect(() => {
    lessonService.getAll()
      .then(res => setLessons(res.data))
      .catch(() => {})
  }, [])

  // Carga preguntas cuando se selecciona una lección
  const loadQuestions = useCallback((lid) => {
    setLoading(true)
    setAnswers([]); setScore(0); setCurrent(0)
    setSelected(null); setFillInput(''); setConfirmed(false); setFinished(false)

    quizService.getByLesson(lid)
      .then(res => setQuestions(res.data))
      .catch(() => setQuestions(FALLBACK_QUESTIONS))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selLesson) loadQuestions(selLesson)
    else { setQuestions(FALLBACK_QUESTIONS); setLoading(false) }
  }, [selLesson, loadQuestions])

  const q           = questions[current]
  const isLast      = current === questions.length - 1
  const getUserAns  = () => q?.type === 'FillInTheBlank' ? fillInput.trim() : selected
  const isCorrect   = (ans) => ans?.trim().toLowerCase() === q?.correctAnswer?.trim().toLowerCase()

  const handleConfirm = () => {
    const ans     = getUserAns()
    const correct = isCorrect(ans)
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, {
      questionId:    q.id,
      question:      q.questionText,
      userAnswer:    ans ?? '',
      correctAnswer: q.correctAnswer,
      correct,
    }])
    setConfirmed(true)
  }

  const handleNext = async () => {
    if (isLast) {
      setFinished(true)
      // Envía resultados al backend
      if (selLesson) {
        setSubmitting(true)
        try {
          await quizService.submit({
            lessonId: selLesson,
            answers: answers.concat([{
              questionId: q.id,
              userAnswer: getUserAns() ?? ''
            }])
          })
        } catch {}
        setSubmitting(false)
      }
      return
    }
    setCurrent(c => c + 1)
    setSelected(null); setFillInput(''); setConfirmed(false)
  }

  const handleReset = () => {
    setCurrent(0); setSelected(null); setFillInput('')
    setConfirmed(false); setScore(0); setFinished(false); setAnswers([])
    if (selLesson) loadQuestions(selLesson)
  }

  // ── Selector de lección ────────────────────────────────────
  if (!selLesson && !loading) return (
    <div style={{ maxWidth:'600px', margin:'0 auto', padding:'4rem 1.5rem' }}>
      <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'36px', fontWeight:600, letterSpacing:'-1px', marginBottom:'8px' }}>
        Quiz
      </h1>
      <p style={{ fontSize:'14px', color:'var(--rif-textMuted)', marginBottom:'2.5rem' }}>
        Elige una lección para empezar a practicar
      </p>

      {lessons.length > 0 ? (
        <div style={{ display:'grid', gap:'10px' }}>
          {lessons.map(l => (
            <button key={l.id} onClick={() => setSelLesson(l.id)} style={{
              textAlign:'left', padding:'1rem 1.25rem', borderRadius:'14px', cursor:'pointer',
              border:'1px solid var(--rif-border)', background:'var(--rif-bgCard)',
              display:'flex', alignItems:'center', gap:'12px', transition:'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--rif-accent)'; e.currentTarget.style.background='rgba(212,148,58,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--rif-border)'; e.currentTarget.style.background='var(--rif-bgCard)' }}
            >
              <span style={{ fontSize:'26px' }}>{l.icon}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'14px', fontWeight:500 }}>{l.title}</p>
                <p style={{ fontSize:'12px', color:'var(--rif-textMuted)' }}>{l.wordCount} palabras · {l.category}</p>
              </div>
              {l.progress > 0 && (
                <span style={{ fontSize:'12px', color:'var(--rif-accent)' }}>{l.progress}%</span>
              )}
              <span style={{ color:'var(--rif-textMuted)', fontSize:'16px' }}>→</span>
            </button>
          ))}
        </div>
      ) : (
        // Sin backend — quiz con preguntas generales
        <button onClick={() => { setSelLesson(null); setQuestions(FALLBACK_QUESTIONS); setLoading(false) }}
          className="btn-primary">
          Quiz general →
        </button>
      )}
    </div>
  )

  // ── Loading ────────────────────────────────────────────────
  if (loading) return (
    <div style={{ maxWidth:'640px', margin:'4rem auto', padding:'0 1.5rem' }}>
      <div className="skeleton" style={{ height:'32px', width:'60%', marginBottom:'2rem' }} />
      <div style={{ display:'grid', gap:'10px' }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:'56px', borderRadius:'14px' }} />)}
      </div>
    </div>
  )

  // ── Resultados ─────────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎯' : '📚'

    return (
      <div style={{ maxWidth:'560px', margin:'0 auto', padding:'4rem 1.5rem', textAlign:'center' }}>
        <span style={{ fontSize:'56px', display:'block', marginBottom:'1rem' }}>{emoji}</span>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:'36px', fontWeight:600, letterSpacing:'-1px', marginBottom:'8px' }}>
          {score} de {questions.length} correctas
        </h2>
        <p style={{ fontSize:'14px', color:'var(--rif-textMuted)', marginBottom:'2rem' }}>
          {pct === 100
            ? '¡Perfecto! Dominas esta lección.'
            : pct >= 70
            ? 'Muy bien, sigue practicando.'
            : 'Repasa el vocabulario y vuelve a intentarlo.'}
        </p>

        {/* Barra de resultado */}
        <div style={{
          height:'10px', borderRadius:'5px', background:'var(--rif-bgCard)',
          border:'1px solid var(--rif-border)', marginBottom:'2rem', overflow:'hidden'
        }}>
          <div style={{
            height:'10px', borderRadius:'5px', width:`${pct}%`, transition:'width 1s ease',
            background: pct === 100 ? 'var(--rif-accent3)' : 'var(--rif-accent)'
          }} />
        </div>

        {/* Detalle de respuestas */}
        <div style={{ textAlign:'left', marginBottom:'2.5rem', display:'flex', flexDirection:'column', gap:'8px' }}>
          {answers.map((a, i) => (
            <div key={i} style={{
              padding:'12px 16px', borderRadius:'12px', fontSize:'13px',
              border: `1px solid ${a.correct ? 'rgba(90,138,90,0.25)' : 'rgba(200,80,80,0.25)'}`,
              background: a.correct ? 'rgba(90,138,90,0.06)' : 'rgba(200,80,80,0.06)'
            }}>
              <p style={{ color:'var(--rif-textMuted)', fontSize:'12px', marginBottom:'4px' }}>{a.question}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color: a.correct ? 'var(--rif-accent3)' : '#e05555', fontWeight:500 }}>
                  {a.correct ? '✓' : '✗'} {a.userAnswer || '(sin respuesta)'}
                </span>
                {!a.correct && (
                  <span style={{ fontSize:'12px', color:'var(--rif-textMuted)' }}>
                    Correcto: <strong style={{ color:'var(--rif-text)' }}>{a.correctAnswer}</strong>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={handleReset} className="btn-primary">Intentar de nuevo</button>
          <Link to="/lecciones" className="btn-ghost" style={{ textDecoration:'none', display:'inline-block' }}>
            Ver lecciones
          </Link>
          <Link to="/chat" className="btn-ghost" style={{ textDecoration:'none', display:'inline-block' }}>
            Practicar con IA
          </Link>
        </div>
      </div>
    )
  }

  // ── Pregunta activa ────────────────────────────────────────
  const answerGiven = getUserAns()

  return (
    <div style={{ maxWidth:'640px', margin:'0 auto', padding:'3rem 1.5rem' }}>

      {/* Barra de progreso */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
        <button onClick={() => setSelLesson(null)} style={{
          background:'none', border:'none', cursor:'pointer',
          fontSize:'12px', color:'var(--rif-textMuted)'
        }}>← Cambiar lección</button>
        <span style={{ fontSize:'12px', color:'var(--rif-textMuted)' }}>
          {current + 1} / {questions.length}
        </span>
        <span style={{ fontSize:'12px', color:'var(--rif-accent)' }}>✓ {score} correctas</span>
      </div>
      <div style={{ height:'6px', borderRadius:'3px', background:'var(--rif-bgCard)', border:'1px solid var(--rif-border)', marginBottom:'2.5rem' }}>
        <div style={{
          height:'6px', borderRadius:'3px', background:'var(--rif-accent)',
          width:`${(current / questions.length) * 100}%`, transition:'width 0.4s ease'
        }} />
      </div>

      {/* Tipo de pregunta */}
      <span className="badge badge-accent" style={{ fontSize:'11px', marginBottom:'1.25rem', display:'inline-flex' }}>
        {q?.type === 'FillInTheBlank' ? '✍️ Completar' : '🎯 Opción múltiple'}
      </span>

      <h2 style={{
        fontFamily:'Fraunces,serif', fontSize:'26px', fontWeight:600,
        letterSpacing:'-0.5px', marginBottom:'2rem', lineHeight:1.2
      }}>{q?.questionText}</h2>

      {/* Opción múltiple */}
      {q?.type === 'MultipleChoice' && (
        <div style={{ display:'grid', gap:'10px', marginBottom:'2rem' }}>
          {q.options?.map(opt => {
            let borderColor = 'var(--rif-border)'
            let bg         = 'var(--rif-bgCard)'
            let color      = 'var(--rif-text)'
            if (confirmed) {
              if (opt === q.correctAnswer)  { borderColor='rgba(90,138,90,0.5)'; bg='rgba(90,138,90,0.08)'; color='var(--rif-accent3)' }
              else if (opt === selected)    { borderColor='rgba(200,80,80,0.5)'; bg='rgba(200,80,80,0.08)'; color='#e05555' }
            } else if (opt === selected) {
              borderColor='var(--rif-accent)'; bg='rgba(212,148,58,0.08)'
            }
            return (
              <button key={opt} disabled={confirmed} onClick={() => setSelected(opt)} style={{
                width:'100%', padding:'14px 18px', borderRadius:'14px', cursor: confirmed ? 'default' : 'pointer',
                border:`1px solid ${borderColor}`, background:bg, color,
                textAlign:'left', fontSize:'14px', fontWeight: opt === selected ? 500 : 400,
                transition:'all 0.2s', fontFamily:'DM Sans, sans-serif'
              }}>
                {confirmed && opt === q.correctAnswer && '✓ '}
                {confirmed && opt === selected && opt !== q.correctAnswer && '✗ '}
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {/* Completar frase */}
      {q?.type === 'FillInTheBlank' && (
        <div style={{ marginBottom:'2rem' }}>
          <input
            type="text" value={fillInput} disabled={confirmed}
            onChange={e => setFillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && fillInput && !confirmed) handleConfirm() }}
            placeholder="Escribe tu respuesta..."
            autoFocus
            className="input-field"
            style={{
              borderColor: confirmed
                ? isCorrect(fillInput) ? 'rgba(90,138,90,0.5)' : 'rgba(200,80,80,0.5)'
                : undefined
            }}
          />
          {q.hint && !confirmed && (
            <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', marginTop:'8px' }}>
              💡 Pista: {q.hint}
            </p>
          )}
          {confirmed && !isCorrect(fillInput) && (
            <p style={{ fontSize:'13px', color:'var(--rif-accent3)', marginTop:'10px' }}>
              Respuesta correcta: <strong>{q.correctAnswer}</strong>
            </p>
          )}
        </div>
      )}

      {/* Acciones */}
      {!confirmed ? (
        <button
          disabled={!answerGiven}
          onClick={handleConfirm}
          className="btn-primary"
          style={{ opacity: answerGiven ? 1 : 0.4 }}
        >
          Confirmar respuesta
        </button>
      ) : (
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{
            fontSize:'14px', fontWeight:500,
            color: isCorrect(getUserAns()) ? 'var(--rif-accent3)' : '#e05555'
          }}>
            {isCorrect(getUserAns()) ? '✓ ¡Correcto!' : `✗ Era: ${q.correctAnswer}`}
          </span>
          <button
            onClick={handleNext}
            disabled={submitting}
            className="btn-primary"
            style={{ marginLeft:'auto' }}
          >
            {submitting ? 'Guardando…' : isLast ? 'Ver resultados' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  )
}
