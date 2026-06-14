# RifLearn AI — Backend (ASP.NET Core Web API)

## Requisitos
- Visual Studio 2022 con carga de trabajo **ASP.NET and web development**
- SQL Server LocalDB (viene incluido con Visual Studio)

---

## Cómo abrir el proyecto

1. Abre Visual Studio 2022
2. **File → Open → Project/Solution**
3. Selecciona `RifLearnAPI.sln`

---

## Configuración antes de arrancar

### 1. Pon tu API key de Anthropic

Abre `appsettings.Development.json` y reemplaza:

```json
"ApiKey": "TU_API_KEY_REAL_AQUI"
```

Consigue tu API key en: https://console.anthropic.com

### 2. Verifica la cadena de conexión

En `appsettings.json`:

```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=RifLearnDB;Trusted_Connection=True"
```

Si usas SQL Server Express cambia a: `Server=.\\SQLEXPRESS`

---

## Crear la base de datos

En Visual Studio, abre la **Package Manager Console**:

**Tools → NuGet Package Manager → Package Manager Console**

Ejecuta en orden:

```powershell
Add-Migration InitialCreate
Update-Database
```

Esto crea la base de datos `RifLearnDB` con todas las tablas y datos iniciales.

---

## Arrancar la API

Pulsa **F5** o el botón ▶ en Visual Studio.

Se abrirá Swagger en: `https://localhost:5001/swagger`

Desde Swagger puedes probar todos los endpoints sin necesidad de Postman.

---

## Endpoints disponibles

### Auth
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/auth/register` | Crear cuenta |
| POST | `/api/auth/login`    | Iniciar sesión → devuelve JWT |
| GET  | `/api/auth/me`       | Datos del usuario actual |

### Lecciones
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/lessons`              | Todas las lecciones con progreso |
| GET | `/api/lessons/{id}`         | Detalle con vocabulario |
| PUT | `/api/lessons/{id}/progress`| Actualizar progreso |

### Quiz
| Método | URL | Descripción |
|--------|-----|-------------|
| GET  | `/api/quiz/lesson/{id}` | Preguntas de una lección |
| POST | `/api/quiz/submit`      | Enviar respuestas y obtener resultado |
| GET  | `/api/quiz/results`     | Historial de quizzes |

### IA
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/ai/chat` | Chat con el tutor de tarifit |

---

## Estructura del proyecto

```
RifLearnAPI/
├── Controllers/        ← Endpoints de la API
│   ├── AuthController.cs
│   ├── LessonsController.cs
│   ├── QuizController.cs
│   └── AIController.cs
├── Models/             ← Entidades de la base de datos
│   ├── User.cs
│   ├── Lesson.cs
│   ├── Category.cs
│   ├── VocabItem.cs
│   ├── Question.cs
│   └── Progress.cs
├── Data/
│   └── AppDbContext.cs ← Configuración de EF + seed data
├── DTOs/
│   └── DTOs.cs         ← Objetos de transferencia de datos
├── Migrations/         ← Scripts de base de datos (auto-generados)
├── Program.cs          ← Configuración y arranque
└── appsettings.json    ← Configuración (BD, JWT, API keys)
```
