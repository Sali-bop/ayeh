import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { lessonService } from '../services/api'

const CATEGORIES = ['Todos', 'Básico', 'Intermedio', 'Avanzado']

// Vocabulario completo con variantes de Alhucemas
const FALLBACK_LESSONS = [
  {
    id:1, title:'Saludos', category:'Básico', icon:'🤝', wordCount:10, progress:0,
    description:'Las primeras palabras para comunicarte',
    vocabItems:[
      { id:1,  spanish:'Hola',           tarifit:'Azul',        exampleSentence:'Azul, labas?' },
      { id:2,  spanish:'Adiós',          tarifit:'Akka',        exampleSentence:'Akka, a gma' },
      { id:3,  spanish:'¿Cómo estás?',   tarifit:'Labas darik?',exampleSentence:'Azul! Labas darik?' },
      { id:4,  spanish:'Bien, gracias',  tarifit:'Labas, tanemmirt', exampleSentence:'Labas tanemmirt, hamdullah' },
      { id:5,  spanish:'Gracias',        tarifit:'Tanemmirt',   exampleSentence:'Tanemmirt a gma' },
      { id:6,  spanish:'De nada',        tarifit:'Wakha',       exampleSentence:'Wakha, ur illi walu' },
      { id:7,  spanish:'Por favor',      tarifit:'Rjak',        exampleSentence:'Rjak, ini yas' },
      { id:8,  spanish:'Perdona',        tarifit:'Samḥ iyi',    exampleSentence:'Samḥ iyi, a gma' },
      { id:9,  spanish:'Buenos días',    tarifit:'Sbah lxir',   exampleSentence:'Sbah lxir a yemma' },
      { id:10, spanish:'Buenas noches',  tarifit:'Tidet lxir',  exampleSentence:'Tidet lxir a baba' },
    ]
  },
  {
    id:2, title:'Familia', category:'Básico', icon:'👨‍👩‍👧', wordCount:12, progress:0,
    description:'Los miembros de la familia en tarifit',
    vocabItems:[
      { id:11, spanish:'Padre',          tarifit:'Baba',        exampleSentence:'Baba inu d ameqqran' },
      { id:12, spanish:'Madre',          tarifit:'Yemma',       exampleSentence:'Yemma inu tessen tarifit' },
      { id:13, spanish:'Hermano',        tarifit:'Gma',         exampleSentence:'Gma inu d amzyan' },
      { id:14, spanish:'Hermana',        tarifit:'Ultma',       exampleSentence:'Ultma inu tga tamɣart' },
      { id:15, spanish:'Abuelo',         tarifit:'Jeddi',       exampleSentence:'Jeddi inu d aqchich' },
      { id:16, spanish:'Abuela',         tarifit:'Jeddati',     exampleSentence:'Jeddati tessen tarifit' },
      { id:17, spanish:'Tío',            tarifit:'Xali',        exampleSentence:'Xali inu iga d Alhucemas' },
      { id:18, spanish:'Tía',            tarifit:'Xalti',       exampleSentence:'Xalti tissen arifen' },
      { id:19, spanish:'Primo/a',        tarifit:'Wergaz n gma',exampleSentence:'Wergaz n gma inu' },
      { id:20, spanish:'Hijo',           tarifit:'Arraw',       exampleSentence:'Arraw inu d aqchich' },
      { id:21, spanish:'Familia',        tarifit:'Tawacult',    exampleSentence:'Tawacult inu d tamqqrant' },
      { id:22, spanish:'Esposo/a',       tarifit:'Argaz/Tmeṭṭut', exampleSentence:'Argaz inu d ameqqran' },
    ]
  },
  {
    id:3, title:'Números', category:'Básico', icon:'🔢', wordCount:12, progress:0,
    description:'Contar en tarifit — con variante de Alhucemas',
    vocabItems:[
      { id:23, spanish:'Uno',            tarifit:'Yan (Wahed)',     exampleSentence:'Yan n urgan' },
      { id:24, spanish:'Dos',            tarifit:'Sin (Jooj)',      exampleSentence:'Sin n iseggasen' },
      { id:25, spanish:'Tres',           tarifit:'Kraḍ (Tlata)',    exampleSentence:'Kraḍ n imdanen' },
      { id:26, spanish:'Cuatro',         tarifit:'Kkuẓ (Reb3a)',    exampleSentence:'Kkuẓ n tewwura' },
      { id:27, spanish:'Cinco',          tarifit:'Semmus (Xamsa)',  exampleSentence:'Semmus n iḍebbiren' },
      { id:28, spanish:'Seis',           tarifit:'Sḍis (Setta)',    exampleSentence:'Sḍis n wussan' },
      { id:29, spanish:'Siete',          tarifit:'Sa (Seb3a)',      exampleSentence:'Sa n iḍ' },
      { id:30, spanish:'Ocho',           tarifit:'Ttam (Tmanya)',   exampleSentence:'Ttam n iseggasen' },
      { id:31, spanish:'Nueve',          tarifit:'Tẓa (Tes3ud)',    exampleSentence:'Tẓa n imdanen' },
      { id:32, spanish:'Diez',           tarifit:'Mraw (3achra)',   exampleSentence:'Mraw n wussan' },
      { id:33, spanish:'Veinte',         tarifit:'Ţţamraw (3acrin)',exampleSentence:'Ţţamraw n iseggasen' },
      { id:34, spanish:'Cien',           tarifit:'Timmidi (Mya)',   exampleSentence:'Timmidi n dirham' },
    ]
  },
  {
    id:4, title:'Colores', category:'Básico', icon:'🎨', wordCount:8, progress:0,
    description:'Los colores en tarifit',
    vocabItems:[
      { id:35, spanish:'Blanco',         tarifit:'Amellal',     exampleSentence:'Agelzim amellal' },
      { id:36, spanish:'Negro',          tarifit:'Aberkan',     exampleSentence:'Arrac aberkan' },
      { id:37, spanish:'Rojo',           tarifit:'Azegzaw',     exampleSentence:'Tiziri tazegzawt' },
      { id:38, spanish:'Verde',          tarifit:'Aziru',       exampleSentence:'Igran aziru' },
      { id:39, spanish:'Azul',           tarifit:'Anẓar',       exampleSentence:'Ilel anẓar' },
      { id:40, spanish:'Amarillo',       tarifit:'Awraɣ',       exampleSentence:'Tamurt tawraɣt' },
      { id:41, spanish:'Marrón',         tarifit:'Aḥmiri',      exampleSentence:'Axam aḥmiri' },
      { id:42, spanish:'Gris',           tarifit:'Urɣu',        exampleSentence:'Azru urɣu' },
    ]
  },
  {
    id:5, title:'Cuerpo humano', category:'Intermedio', icon:'🧍', wordCount:12, progress:0,
    description:'Las partes del cuerpo en tarifit',
    vocabItems:[
      { id:43, spanish:'Cabeza',         tarifit:'Ixef',        exampleSentence:'Ixef inu iqqur' },
      { id:44, spanish:'Ojo',            tarifit:'Tiṭ',         exampleSentence:'Tiṭ inu tẓurr' },
      { id:45, spanish:'Oreja',          tarifit:'Amezzuɣ',     exampleSentence:'Amezzuɣ inu isell' },
      { id:46, spanish:'Nariz',          tarifit:'Tinzart',     exampleSentence:'Tinzart inu' },
      { id:47, spanish:'Boca',           tarifit:'Imi',         exampleSentence:'Imi inu itett' },
      { id:48, spanish:'Mano',           tarifit:'Afus',        exampleSentence:'Afus inu d ameqqran' },
      { id:49, spanish:'Pie',            tarifit:'Aḍar',        exampleSentence:'Aḍar inu iɣar' },
      { id:50, spanish:'Corazón',        tarifit:'Ul',          exampleSentence:'Ul inu iteddu' },
      { id:51, spanish:'Espalda',        tarifit:'Adrar',       exampleSentence:'Adrar inu iqqur' },
      { id:52, spanish:'Pelo',           tarifit:'Azaɣar',      exampleSentence:'Azaɣar inu d aberkan' },
      { id:53, spanish:'Diente',         tarifit:'Igenni',      exampleSentence:'Igenni inu d amellal' },
      { id:54, spanish:'Rodilla',        tarifit:'Ageɣmim',     exampleSentence:'Ageɣmim inu iɣar' },
    ]
  },
  {
    id:6, title:'Casa y hogar', category:'Intermedio', icon:'🏠', wordCount:10, progress:0,
    description:'La casa y sus objetos en tarifit',
    vocabItems:[
      { id:55, spanish:'Casa',           tarifit:'Axam',        exampleSentence:'Axam inu d ameqqran' },
      { id:56, spanish:'Puerta',         tarifit:'Tawwurt',     exampleSentence:'Tawwurt n axam' },
      { id:57, spanish:'Ventana',        tarifit:'Taqqurt',     exampleSentence:'Taqqurt n taddart' },
      { id:58, spanish:'Cocina',         tarifit:'Tabwat',      exampleSentence:'Tabwat n yemma' },
      { id:59, spanish:'Cama',           tarifit:'Anebdu',      exampleSentence:'Anebdu inu d azegzaw' },
      { id:60, spanish:'Mesa',           tarifit:'Tawla',       exampleSentence:'Tawla n uxxam' },
      { id:61, spanish:'Agua',           tarifit:'Aman',        exampleSentence:'Aman n tizi' },
      { id:62, spanish:'Pan',            tarifit:'Aɣrum',       exampleSentence:'Aɣrum n yemma' },
      { id:63, spanish:'Fuego',          tarifit:'Timsi',       exampleSentence:'Timsi n txamt' },
      { id:64, spanish:'Llave',          tarifit:'Tasarut',     exampleSentence:'Tasarut n tawwurt' },
    ]
  },
  {
    id:7, title:'Naturaleza del Rif', category:'Intermedio', icon:'🌊', wordCount:10, progress:0,
    description:'El mar, la montaña y la naturaleza de Alhucemas',
    vocabItems:[
      { id:65, spanish:'Mar',            tarifit:'Ilel',        exampleSentence:'Ilel n Alhucemas d azegzaw' },
      { id:66, spanish:'Montaña',        tarifit:'Adrar',       exampleSentence:'Adrar n Rif d ameqqran' },
      { id:67, spanish:'Río',            tarifit:'Asif',        exampleSentence:'Asif n tmazirt' },
      { id:68, spanish:'Sol',            tarifit:'Tafukt',      exampleSentence:'Tafukt tessawed' },
      { id:69, spanish:'Luna',           tarifit:'Ayyur',       exampleSentence:'Ayyur d amellal' },
      { id:70, spanish:'Cielo',          tarifit:'Ignna',       exampleSentence:'Ignna d azegzaw' },
      { id:71, spanish:'Tierra/País',    tarifit:'Tamurt',      exampleSentence:'Tamurt inu d Arrif' },
      { id:72, spanish:'Árbol',          tarifit:'Izeɣzaw',     exampleSentence:'Izeɣzaw d amqqran' },
      { id:73, spanish:'Piedra',         tarifit:'Azru',        exampleSentence:'Azru n adrar' },
      { id:74, spanish:'Viento',         tarifit:'Afud',        exampleSentence:'Afud n ilel' },
    ]
  },
  {
    id:8, title:'Expresiones cotidianas', category:'Avanzado', icon:'💬', wordCount:10, progress:0,
    description:'Frases del día a día en el Rif',
    vocabItems:[
      { id:75, spanish:'¿Qué tal?',      tarifit:'Manic tella?',    exampleSentence:'Manic tella a gma?' },
      { id:76, spanish:'Todo bien',      tarifit:'Kulci labas',     exampleSentence:'Kulci labas hamdullah' },
      { id:77, spanish:'No entiendo',    tarifit:'Ur fhimeɣ',       exampleSentence:'Ur fhimeɣ, ini yas daɣ' },
      { id:78, spanish:'Habla despacio', tarifit:'Ini yas berra',   exampleSentence:'Rjak ini yas berra' },
      { id:79, spanish:'¿Cómo se dice?', tarifit:'Amek ttiniɣ?',    exampleSentence:'Amek ttiniɣ "casa" s tarifit?' },
      { id:80, spanish:'Me llamo...',    tarifit:'Isem inu d...',    exampleSentence:'Isem inu d Salima' },
      { id:81, spanish:'Soy de Alhucemas', tarifit:'Iga d Alhucemas', exampleSentence:'Iga d Alhucemas, Arrif' },
      { id:82, spanish:'Te quiero',      tarifit:'Hamleɣ kem',      exampleSentence:'Hamleɣ kem a yemma' },
      { id:83, spanish:'Inshallah',      tarifit:'Inchallah',       exampleSentence:'Inchallah ɣa nruḥ' },
      { id:84, spanish:'Gracias a Dios', tarifit:'Hamdullah',       exampleSentence:'Hamdullah kulci labas' },
    ]
  },
  {
    id:9, title:'Comida del Rif', category:'Avanzado', icon:'🍲', wordCount:10, progress:0,
    description:'Alimentos y comida típica del Rif',
    vocabItems:[
      { id:85, spanish:'Comer',          tarifit:'Itett',       exampleSentence:'Itett aɣrum' },
      { id:86, spanish:'Beber',          tarifit:'Isew',        exampleSentence:'Isew aman' },
      { id:87, spanish:'Aceite de oliva',tarifit:'Azemmur',     exampleSentence:'Azemmur n Arrif' },
      { id:88, spanish:'Cuscús',         tarifit:'Sekssu',      exampleSentence:'Sekssu n yemma d ameẓẓan' },
      { id:89, spanish:'Leche',          tarifit:'Aɣi',         exampleSentence:'Aɣi n tafunast' },
      { id:90, spanish:'Miel',           tarifit:'Tament',      exampleSentence:'Tament n Arrif d tazizawt' },
      { id:91, spanish:'Higo',           tarifit:'Takuramt',    exampleSentence:'Takuramt n adrar' },
      { id:92, spanish:'Harina',         tarifit:'Adrim',       exampleSentence:'Adrim n aɣrum' },
      { id:93, spanish:'Sal',            tarifit:'Tisnt',       exampleSentence:'Tisnt n aman' },
      { id:94, spanish:'Té',             tarifit:'Atay',        exampleSentence:'Atay n Arrif d azegzaw' },
    ]
  },
]

export default function Lessons() {
  const [lessons,  setLessons]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('Todos')
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    lessonService.getAll()
      .then(res => setLessons(res.data))
      .catch(() => setLessons(FALLBACK_LESSONS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'Todos' ? lessons : lessons.filter(l => l.category === filter)

  if (selected) return (
    <LessonDetail
      lessonId={selected}
      allLessons={FALLBACK_LESSONS}
      onBack={() => setSelected(null)}
      onQuiz={(id) => navigate(`/quiz?lesson=${id}`)}
    />
  )

  return (
    <div style={{ maxWidth:'960px', margin:'0 auto', padding:'3rem 1.5rem' }}>

      {/* Cabecera */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
          <span style={{ fontFamily:'serif', fontSize:'24px' }}>ⵣ</span>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'40px', fontWeight:600, letterSpacing:'-1px' }}>
            Lecciones
          </h1>
        </div>
        <p style={{ fontSize:'14px', color:'var(--rif-textMuted)' }}>
          Aprende tarifit del Rif — vocabulario auténtico con variantes de Alhucemas
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'2rem', flexWrap:'wrap', alignItems:'center' }}>
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
          <span style={{ marginLeft:'auto', fontSize:'13px', color:'var(--rif-textMuted)' }}>
            {filtered.length} lecciones · {filtered.reduce((a,l) => a + (l.wordCount ?? 0), 0)} palabras
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
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
        <span style={{ fontSize:'28px' }}>{lesson.icon}</span>
        <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'12px', ...statusStyle }}>
          {pct === 100 ? '✓ ' : ''}{statusLabel}
        </span>
      </div>
      <p style={{ fontSize:'15px', fontWeight:500, marginBottom:'3px' }}>{lesson.title}</p>
      <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'12px' }}>
        {lesson.description}
      </p>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--rif-textMuted)', marginBottom:'8px' }}>
        <span>{lesson.wordCount} palabras</span>
        <span>{lesson.category}</span>
      </div>
      <div style={{ width:'100%', height:'3px', borderRadius:'2px', background:'var(--rif-border)' }}>
        <div style={{
          height:'3px', borderRadius:'2px', transition:'width 0.8s ease',
          background: pct === 100 ? 'var(--rif-accent3)' : 'var(--rif-accent)',
          width:`${pct}%`
        }} />
      </div>
    </button>
  )
}

function LessonDetail({ lessonId, allLessons, onBack, onQuiz }) {
  const [lesson,  setLesson]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [flipped, setFlipped] = useState(null)
  const [mode,    setMode]    = useState('cards')

  useEffect(() => {
    lessonService.getById(lessonId)
      .then(res => setLesson(res.data))
      .catch(() => {
        const found = allLessons.find(l => l.id === lessonId)
        setLesson(found ?? null)
      })
      .finally(() => setLoading(false))
  }, [lessonId, allLessons])

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

      <button onClick={onBack} style={{
        background:'none', border:'none', cursor:'pointer', fontSize:'13px',
        color:'var(--rif-textMuted)', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'6px'
      }}>← Volver a lecciones</button>

      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
        <span style={{ fontSize:'36px' }}>{lesson.icon}</span>
        <div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'28px', fontWeight:600, letterSpacing:'-0.5px' }}>
            {lesson.title}
          </h1>
          <p style={{ fontSize:'13px', color:'var(--rif-textMuted)' }}>
            {lesson.vocabItems?.length ?? lesson.wordCount} palabras · {lesson.category}
          </p>
        </div>
      </div>

      {/* Nota variantes */}
      {lesson.id === 3 && (
        <div style={{
          padding:'12px 16px', borderRadius:'12px', marginBottom:'1.5rem',
          background:'rgba(212,148,58,0.08)', border:'1px solid rgba(212,148,58,0.2)',
          fontSize:'13px', color:'var(--rif-textMuted)'
        }}>
          <strong style={{ color:'var(--rif-accent)' }}>ⵣ Nota dialectal</strong> — Los números muestran primero la forma tarifit clásica y entre paréntesis la variante usada en Alhucemas, más arabizada.
        </div>
      )}

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

      {/* Tarjetas */}
      {mode === 'cards' && (
        <>
          <p style={{ fontSize:'12px', color:'var(--rif-textMuted)', marginBottom:'1rem' }}>
            Toca una tarjeta para ver la traducción en tarifit
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'10px', marginBottom:'2rem' }}>
            {(lesson.vocabItems ?? []).map(v => (
              <button key={v.id} onClick={() => setFlipped(f => f===v.id ? null : v.id)}
                style={{
                  padding:'1rem', borderRadius:'14px', cursor:'pointer', textAlign:'center',
                  border: flipped===v.id ? '2px solid var(--rif-accent)' : '1px solid var(--rif-border)',
                  background: flipped===v.id ? 'rgba(212,148,58,0.08)' : 'var(--rif-bgCard)',
                  transition:'all 0.2s', minHeight:'90px',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px'
                }}>
                <p style={{ fontSize:'14px', fontWeight:500, color: flipped===v.id ? 'var(--rif-accent)' : 'var(--rif-text)' }}>
                  {flipped===v.id ? v.tarifit : v.spanish}
                </p>
                <p style={{ fontSize:'10px', color:'var(--rif-textMuted)' }}>
                  {flipped===v.id ? 'tarifit' : 'español · toca'}
                </p>
                {flipped===v.id && v.exampleSentence && (
                  <p style={{ fontSize:'10px', color:'var(--rif-textMuted)', fontStyle:'italic', marginTop:'2px' }}>
                    "{v.exampleSentence}"
                  </p>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Lista */}
      {mode === 'list' && (
        <div style={{ marginBottom:'2rem', borderRadius:'14px', border:'1px solid var(--rif-border)', overflow:'hidden' }}>
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
            padding:'10px 16px', background:'var(--rif-bgCard)',
            fontSize:'11px', color:'var(--rif-textMuted)', textTransform:'uppercase',
            letterSpacing:'0.05em', borderBottom:'1px solid var(--rif-border)'
          }}>
            <span>Español</span><span>Tarifit</span><span>Ejemplo</span>
          </div>
          {(lesson.vocabItems ?? []).map((v, i) => (
            <div key={v.id} style={{
              display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
              padding:'11px 16px', fontSize:'13px',
              borderBottom: i < (lesson.vocabItems.length-1) ? '1px solid var(--rif-border)' : 'none',
              background: i%2===0 ? 'transparent' : 'var(--rif-bgCard)'
            }}>
              <span>{v.spanish}</span>
              <span style={{ color:'var(--rif-accent)', fontWeight:500 }}>{v.tarifit}</span>
              <span style={{ color:'var(--rif-textMuted)', fontStyle:'italic', fontSize:'11px' }}>{v.exampleSentence ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => onQuiz(lessonId)} className="btn-primary">
        Practicar con quiz →
      </button>
    </div>
  )
}
