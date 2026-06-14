# Estructura final del proyecto — RifLearn AI

## Árbol de archivos completo

```
riflearn-ai/
│
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml     ← CI/CD automático con GitHub Actions
│
├── frontend/                       ← Aplicación React (Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx   ← Captura errores de renderizado
│   │   │   ├── Footer.jsx          ← Pie de página con frase en tarifit
│   │   │   ├── Navbar.jsx          ← Navbar con navegación activa y toggle de tema
│   │   │   ├── PageTransition.jsx  ← Animación fadeUp entre páginas
│   │   │   ├── ProgressBar.jsx     ← Barra de progreso reutilizable
│   │   │   ├── ProtectedRoute.jsx  ← Redirige al login si no hay sesión
│   │   │   ├── StatCard.jsx        ← Tarjeta de estadística
│   │   │   └── Toast.jsx           ← Notificaciones temporales
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     ← Estado global de autenticación (JWT)
│   │   │   └── ThemeContext.jsx    ← Sistema de temas claro/oscuro
│   │   │
│   │   ├── hooks/
│   │   │   └── useStats.js         ← Hook para estadísticas del usuario
│   │   │
│   │   ├── pages/
│   │   │   ├── AIChat.jsx          ← Chat con tutor de tarifit (Claude API)
│   │   │   ├── Dashboard.jsx       ← Panel principal con stats y logros
│   │   │   ├── Home.jsx            ← Landing page pública
│   │   │   ├── Lessons.jsx         ← Lecciones con tarjetas flip y lista
│   │   │   ├── Login.jsx           ← Formulario de login
│   │   │   ├── NotFound.jsx        ← Página 404 con redirección automática
│   │   │   ├── Quiz.jsx            ← Quiz con opción múltiple y rellenar
│   │   │   ├── Register.jsx        ← Formulario de registro
│   │   │   └── Settings.jsx        ← Ajustes de tema y perfil
│   │   │
│   │   ├── services/
│   │   │   └── api.js              ← Axios + interceptores JWT
│   │   │
│   │   ├── App.jsx                 ← Router + providers + layout
│   │   ├── index.css               ← Variables CSS globales + clases utilitarias
│   │   └── main.jsx                ← Punto de entrada React
│   │
│   ├── .env.example                ← Variables de entorno (plantilla)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                        ← ASP.NET Core Web API (C#)
│   └── RifLearnAPI/
│       ├── Controllers/
│       │   ├── AuthController.cs   ← POST /login, /register, GET /me
│       │   ├── LessonsController.cs← GET /lessons, /lessons/{id}, PUT /progress
│       │   ├── QuizController.cs   ← GET /quiz/lesson/{id}, POST /submit
│       │   └── AIController.cs     ← POST /ai/chat → Claude API
│       │
│       ├── Data/
│       │   └── AppDbContext.cs     ← EF Core + seed data de lecciones
│       │
│       ├── DTOs/
│       │   └── DTOs.cs             ← Objetos de transferencia de datos
│       │
│       ├── Migrations/             ← Scripts de base de datos (auto-generados)
│       │
│       ├── Models/
│       │   ├── Category.cs
│       │   ├── Lesson.cs
│       │   ├── Progress.cs
│       │   ├── Question.cs
│       │   ├── User.cs
│       │   └── VocabItem.cs
│       │
│       ├── Program.cs              ← JWT, CORS, Swagger, migraciones auto
│       ├── appsettings.json        ← Configuración (sin secrets)
│       └── appsettings.Development.json ← API keys locales (en .gitignore)
│
└── docs/
    ├── AZURE_DEPLOY.md             ← Guía de despliegue paso a paso
    ├── diagramas/
    │   └── arquitectura.md         ← Diagrama de arquitectura del sistema
    └── README.md
```

## Paleta de colores — Inspirada en el Rif

| Color | Hex | Uso |
|-------|-----|-----|
| Azafrán | `#d4943a` | Color principal, botones, acentos |
| Mediterráneo | `#4a8fa8` | Acento secundario, badges |
| Verde Rif | `#5a8a5a` | Progreso, éxito, logros |
| Crema claro | `#faf7f2` | Fondo tema claro |
| Azul oscuro | `#0f1117` | Fondo tema oscuro |

## Requisitos funcionales implementados

| RF | Descripción | Estado |
|----|-------------|--------|
| RF-01 | Registro de usuario | ✅ |
| RF-02 | Inicio de sesión con JWT | ✅ |
| RF-03 | Visualización de lecciones | ✅ |
| RF-04 | Cuestionarios tipo test | ✅ |
| RF-05 | Seguimiento de progreso | ✅ |
| RF-06 | Asistente IA conversacional | ✅ |
| RF-07 | Modo claro/oscuro | ✅ |
| RF-08 | Gamificación (logros) | ✅ |

## Requisitos no funcionales implementados

| RNF | Descripción | Solución |
|-----|-------------|----------|
| RNF-01 | Interfaz responsive | Tailwind CSS + CSS Grid |
| RNF-02 | Seguridad | JWT Bearer + BCrypt |
| RNF-03 | Persistencia | Azure SQL + EF Core |
| RNF-04 | Disponibilidad cloud | Azure App Service + Static Web Apps |
| RNF-05 | Escalabilidad | Azure PaaS (escala automáticamente) |
| RNF-06 | CI/CD | GitHub Actions |
| RNF-07 | Accesibilidad | Contraste WCAG, navegación por teclado |
