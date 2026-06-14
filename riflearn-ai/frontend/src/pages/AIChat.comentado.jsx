// ============================================================
// AIChat.jsx — Tutor de Tarifit con IA
// ============================================================
// Qué hace:
//   1. Muestra un chat con mensajes del usuario y del tutor IA
//   2. Al enviar un mensaje, llama a la API de Anthropic (Claude)
//   3. El modelo responde como profesor de rifeño/tarifit
//   4. Muestra sugerencias rápidas al principio
// ============================================================

import { useState, useRef, useEffect } from 'react'
// useState  → guardar mensajes, input, estado de carga
// useRef    → referencia al final de la lista (para hacer scroll)
// useEffect → hacer scroll automático cuando llegan mensajes nuevos

// ============================================================
// SYSTEM PROMPT — Las instrucciones que le damos a la IA
// Define cómo debe comportarse el modelo en cada respuesta
// ============================================================
const SYSTEM_PROMPT = `Eres un tutor experto en el idioma rifeño (tarifit), una variante del amazigh hablada en el norte de Marruecos.
Tu misión es ayudar a estudiantes hispanohablantes a aprender tarifit de forma natural y progresiva.

Reglas:
- Responde siempre en español, pero incluye ejemplos y palabras en tarifit
- Usa transliteración latina clara para las palabras en tarifit
- Adapta el nivel al del estudiante (empieza en básico)
- Incluye siempre: traducción, ejemplo de uso y un mini ejercicio al final
- Sé cercano, motivador y breve (máximo 150 palabras por respuesta)
- Si el estudiante escribe una palabra en tarifit, corrígela si está mal y felicítale si está bien`

// Sugerencias que aparecen al inicio para guiar al usuario
const SUGGESTIONS = [
  'Quiero aprender a presentarme',
  'Enséñame los saludos básicos',
  'Genera un ejercicio de vocabulario',
  '¿Cómo se dice "te quiero" en rifeño?',
]

export default function AIChat() {

  // messages → array de objetos { role: 'user'|'assistant', content: 'texto' }
  // Empieza con un mensaje de bienvenida del asistente
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Azul! 👋 Soy tu tutor de tarifit. Puedo enseñarte vocabulario, generar ejercicios y corregir tu escritura. ¿Por dónde quieres empezar?'
    }
  ])

  const [input, setInput]     = useState('')    // texto del input
  const [loading, setLoading] = useState(false) // esperando respuesta de la IA

  // useRef → nos da acceso directo al elemento DOM del final del chat
  const bottomRef = useRef(null)

  // useEffect → cada vez que messages cambia (nuevo mensaje),
  // hace scroll hasta el final para mostrar el último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]) // se ejecuta cada vez que messages cambia

  // ============================================================
  // sendMessage → envía un mensaje al tutor IA
  // Acepta texto como parámetro (sugerencias) o usa el input
  // ============================================================
  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return // no enviamos si está vacío o cargando

    // Construimos el mensaje del usuario
    const userMsg = { role: 'user', content: userText }

    // Añadimos el mensaje a la conversación
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')       // limpiamos el input
    setLoading(true)   // activamos el indicador de carga

    try {
      // ============================================================
      // Llamada a la API de Anthropic (Claude)
      // Le pasamos TODO el historial de mensajes para que tenga
      // contexto de la conversación completa
      // ============================================================
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', // modelo que usamos
          max_tokens: 1000,                  // máximo de palabras en la respuesta
          system: SYSTEM_PROMPT,             // instrucciones del tutor
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await response.json()

      // data.content es un array, tomamos el primer bloque de texto
      const reply = data.content?.[0]?.text || 'Lo siento, no pude procesar tu mensaje.'

      // Añadimos la respuesta del asistente al chat
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

    } catch {
      // Si hay error de red u otro problema, mostramos mensaje de error
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hubo un error de conexión. Asegúrate de que el backend esté corriendo.'
      }])
    } finally {
      setLoading(false) // desactivamos carga siempre
    }
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    // flex flex-col con altura fija para que el input quede abajo
    <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col" style={{ height: 'calc(100vh - 73px)' }}>

      {/* Cabecera del chat */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[rgba(232,200,122,0.15)] flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <h1 className="text-sm font-medium">Tutor IA de Tarifit</h1>
          {/* Punto verde de "disponible" */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-[var(--rif-muted)]">Disponible ahora</span>
          </div>
        </div>
      </div>

      {/* Lista de mensajes — flex-1 ocupa todo el espacio disponible */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, i) => (
          // Mensajes del usuario a la derecha, del asistente a la izquierda
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
              ${msg.role === 'user'
                ? 'bg-[var(--rif-gold)] text-[var(--rif-dark)] rounded-br-sm'   // burbuja dorada para usuario
                : 'bg-[rgba(232,226,213,0.06)] border border-[var(--rif-border)] rounded-bl-sm'}` // oscura para IA
            }>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Indicador de "escribiendo..." mientras la IA responde */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[rgba(232,226,213,0.06)] border border-[var(--rif-border)]">
              <div className="flex gap-1 items-center">
                {/* Tres puntos animados con diferentes delays */}
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--rif-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--rif-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--rif-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Elemento invisible al final — hacemos scroll hasta aquí */}
        <div ref={bottomRef} />
      </div>

      {/* Sugerencias rápidas — solo aparecen al principio (1 mensaje = bienvenida) */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4 shrink-0">
          {SUGGESTIONS.map(s => (
            // Al hacer click, enviamos la sugerencia directamente
            <button key={s} onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--rif-border)] text-[var(--rif-muted)]
                hover:border-[var(--rif-gold)] hover:text-[var(--rif-text)] transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input de texto + botón enviar */}
      <div className="shrink-0 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          // Enter envía el mensaje (sin Shift para no interferir con saltos de línea)
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Escribe tu pregunta o practica una palabra..."
          className="flex-1 px-4 py-3 rounded-xl bg-[rgba(232,226,213,0.05)] border border-[var(--rif-border)]
            text-[var(--rif-text)] text-sm placeholder-[var(--rif-muted)]
            focus:outline-none focus:border-[var(--rif-gold)] transition-colors"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading} // deshabilitado si input vacío o cargando
          className="px-5 py-3 rounded-xl bg-[var(--rif-gold)] text-[var(--rif-dark)] text-sm font-medium
            hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0">
          →
        </button>
      </div>
    </div>
  )
}
