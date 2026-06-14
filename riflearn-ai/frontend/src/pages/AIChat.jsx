import { useState, useRef, useEffect } from 'react'
import { aiService } from '../services/api'

const SYSTEM_PROMPT = `Eres un tutor experto en el idioma rifeño (tarifit), una variante del amazigh hablada en el norte de Marruecos.
Tu misión es ayudar a estudiantes hispanohablantes a aprender tarifit de forma natural y progresiva.

Reglas:
- Responde siempre en español, pero incluye ejemplos y palabras en tarifit
- Usa transliteración latina clara para las palabras en tarifit
- Adapta el nivel al del estudiante (empieza en básico)
- Incluye siempre: traducción, ejemplo de uso y un mini ejercicio al final
- Sé cercano, motivador y breve (máximo 150 palabras por respuesta)
- Si el estudiante escribe una palabra en tarifit, corrígela si está mal y felicítale si está bien`

const SUGGESTIONS = [
  'Quiero aprender a presentarme',
  'Enséñame los saludos básicos',
  'Genera un ejercicio de nivel principiante',
  '¿Cómo se dice "te quiero" en rifeño?',
  'Corrige esto: "Azul, labas dik?"',
]

export default function AIChat() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '¡Azul! 👋 Soy tu tutor de tarifit. Puedo enseñarte vocabulario, generar ejercicios y corregir tu escritura.\n\n¿Por dónde quieres empezar?'
  }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    const userMsg    = { role: 'user', content: userText }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')
    setLoading(true)

    try {
      // Intenta con el backend primero, si falla va directo a la API
      let reply
      try {
        const res = await aiService.chat(
          newHistory.map(m => ({ role: m.role, content: m.content }))
        )
        reply = res.data.reply
      } catch {
        // Fallback directo a Anthropic (para desarrollo sin backend)
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: newHistory.map(m => ({ role: m.role, content: m.content }))
          })
        })
        const data = await res.json()
        reply = data.content?.[0]?.text || 'No pude generar una respuesta.'
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Error de conexión. Comprueba que el backend está corriendo o que tienes acceso a internet.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '720px', margin: '0 auto', padding: '1.5rem',
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 73px)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexShrink: 0 }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(212,148,58,0.12)', border: '1px solid rgba(212,148,58,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
        }}>🤖</div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>Tutor IA de Tarifit</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5a8a5a', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: 'var(--rif-textMuted)' }}>Disponible ahora · Claude AI</span>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '78%', padding: '12px 16px', borderRadius: '16px',
                fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                ...(msg.role === 'user' ? {
                  background: 'var(--rif-accent)', color: 'var(--rif-accentText)',
                  borderBottomRightRadius: '4px'
                } : {
                  background: 'var(--rif-bgCard)', border: '1px solid var(--rif-border)',
                  borderBottomLeftRadius: '4px'
                })
              }}>{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px',
                background: 'var(--rif-bgCard)', border: '1px solid var(--rif-border)',
                display: 'flex', gap: '4px', alignItems: 'center'
              }}>
                {[0, 150, 300].map(delay => (
                  <span key={delay} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--rif-textMuted)', display: 'inline-block',
                    animation: 'bounce 1s infinite', animationDelay: `${delay}ms`
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Sugerencias */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', flexShrink: 0 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{
              fontSize: '12px', padding: '6px 14px', borderRadius: '20px',
              border: '1px solid var(--rif-border)', background: 'var(--rif-bgCard)',
              color: 'var(--rif-textMuted)', cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--rif-accent)'; e.target.style.color = 'var(--rif-text)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--rif-border)'; e.target.style.color = 'var(--rif-textMuted)' }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Escribe tu pregunta o practica una frase..."
          className="input-field" style={{ flex: 1 }}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
          className="btn-primary" style={{ borderRadius: '12px', padding: '12px 20px' }}>
          →
        </button>
      </div>
    </div>
  )
}
