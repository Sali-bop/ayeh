# Arquitectura de RifLearn AI

```
┌─────────────────────────────────────────────────────────┐
│                      USUARIO                            │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│           Azure Static Web Apps                         │
│           React + Vite + Tailwind CSS                   │
│   Home │ Login │ Dashboard │ Lecciones │ Quiz │ IA Chat │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API / JSON
┌──────────────────────▼──────────────────────────────────┐
│              Azure App Service                          │
│           ASP.NET Core Web API (.NET 8)                 │
│  AuthController │ LessonsController │ QuizController    │
│             AIController                                │
└───────────┬──────────────────────┬──────────────────────┘
            │ Entity Framework     │ HttpClient
┌───────────▼──────────┐  ┌────────▼─────────────────────┐
│   Azure SQL Database │  │   Anthropic Claude API       │
│                      │  │   (claude-sonnet-4)          │
│  Users               │  │                              │
│  Lessons             │  │  Tutor de Tarifit            │
│  Questions           │  │  Generador de ejercicios     │
│  Progress            │  │  Corrector de respuestas     │
│  QuizResults         │  └──────────────────────────────┘
└──────────────────────┘
```

## Flujo de autenticación

```
Cliente → POST /api/auth/login → Valida credenciales
       ← JWT Token (24h)
       → Incluye token en cabecera Authorization: Bearer <token>
       → Accede a rutas protegidas
```

## Flujo del Tutor IA

```
Cliente → POST /api/ai/chat (historial de mensajes)
Backend → Anthropic API (con system prompt de tutor de tarifit)
        ← Respuesta con vocabulario + ejemplo + ejercicio
Cliente ← Renderiza respuesta en el chat
```
