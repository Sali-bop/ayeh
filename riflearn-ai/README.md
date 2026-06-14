# Ayeh 🌍

> Plataforma web para el aprendizaje del idioma rifeño (tarifit) mediante lecciones interactivas, gamificación e inteligencia artificial desplegada sobre servicios cloud de Azure.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | ASP.NET Core Web API (.NET 8) |
| Base de datos | Azure SQL Database + Entity Framework Core |
| Cloud | Microsoft Azure (Static Web Apps + App Service) |
| IA | Claude API (Anthropic) |
| Control de versiones | GitHub |

---

## Estructura del repositorio

```
ayeh/
├── frontend/          # React app (Vite + Tailwind)
├── backend/           # ASP.NET Core Web API
└── docs/
    ├── capturas/      # Screenshots para memoria TFM
    ├── diagramas/     # Diagramas de arquitectura
    └── memoria/       # Documentación TFM
```

---

## Requisitos funcionales

| ID | Descripción |
|----|-------------|
| RF-01 | Registro de usuario |
| RF-02 | Inicio de sesión con JWT |
| RF-03 | Visualización de lecciones por categoría |
| RF-04 | Realización de cuestionarios tipo test |
| RF-05 | Seguimiento de progreso del usuario |
| RF-06 | Interacción con asistente IA (tutor de rifeño) |

---

## Cómo ejecutar en local

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
dotnet restore
dotnet run
```

---

## Despliegue en Azure

- **Frontend** → Azure Static Web Apps
- **Backend** → Azure App Service
- **Base de datos** → Azure SQL Database

---

## Autor

Trabajo de Fin de Máster — Desarrollo de plataforma cloud para aprendizaje del idioma rifeño mediante IA generativa, React, ASP.NET Core y Azure.
