# Día 7 — Despliegue en Azure 🚀

Desplegamos los tres servicios:
- **Azure SQL Database** — base de datos
- **Azure App Service** — backend ASP.NET Core
- **Azure Static Web Apps** — frontend React

---

## Paso 1 — Crear los recursos en Azure Portal

Ve a **portal.azure.com** e inicia sesión.

### 1.1 Crear un Resource Group

> Un Resource Group agrupa todos los recursos del proyecto juntos.

1. Busca **"Resource groups"** en el buscador
2. Clic en **+ Create**
3. Rellena:
   - **Subscription:** tu suscripción
   - **Resource group:** `riflearn-rg`
   - **Region:** `West Europe` (o la más cercana a ti)
4. Clic en **Review + Create → Create**

---

### 1.2 Crear Azure SQL Database

1. Busca **"SQL databases"** → **+ Create**
2. Rellena:
   - **Resource group:** `riflearn-rg`
   - **Database name:** `RifLearnDB`
   - **Server:** Clic en *Create new*
     - **Server name:** `riflearn-server` (debe ser único globalmente)
     - **Authentication:** SQL authentication
     - **Admin login:** `riflearnadmin`
     - **Password:** algo seguro como `RifLearn2024!`
   - **Compute + storage:** Basic (5 DTU) — suficiente para el TFM
3. En **Networking:** pon *Allow Azure services* en **Yes**
4. Clic en **Review + Create → Create**

> ⏳ Tarda 2-3 minutos en crear.

Una vez creado, copia la **connection string**:
- Ve al recurso → **Connection strings → ADO.NET**
- Cópiala y guárdala, la necesitas en el siguiente paso.

---

### 1.3 Crear Azure App Service (backend)

1. Busca **"App Services"** → **+ Create**
2. Rellena:
   - **Resource group:** `riflearn-rg`
   - **Name:** `riflearn-api` (debe ser único)
   - **Publish:** Code
   - **Runtime stack:** .NET 8 (LTS)
   - **OS:** Windows
   - **Region:** West Europe
   - **Plan:** Free F1 (suficiente para TFM)
3. Clic en **Review + Create → Create**

---

### 1.4 Crear Azure Static Web Apps (frontend)

1. Busca **"Static Web Apps"** → **+ Create**
2. Rellena:
   - **Resource group:** `riflearn-rg`
   - **Name:** `riflearn-frontend`
   - **Plan type:** Free
   - **Region:** West Europe 2
   - **Source:** GitHub (conecta tu cuenta)
   - **Repository:** riflearn-ai
   - **Branch:** main
   - **Build Presets:** React
   - **App location:** `/frontend`
   - **Output location:** `dist`
3. Clic en **Review + Create → Create**

> Esto crea automáticamente un **GitHub Action** que despliega el frontend en cada push a `main`.

---

## Paso 2 — Configurar el backend en App Service

Ve al recurso `riflearn-api` → **Configuration → Application settings**.

Añade estas variables (clic en **+ New application setting** para cada una):

| Name | Value |
|------|-------|
| `ConnectionStrings__DefaultConnection` | La connection string de Azure SQL (cambia `{your_password}` por tu contraseña) |
| `Jwt__Secret` | `RifLearnAI-SuperSecretKey-2024-Produccion!` |
| `Jwt__Issuer` | `RifLearnAPI` |
| `Jwt__Audience` | `RifLearnFrontend` |
| `Anthropic__ApiKey` | Tu API key de Anthropic (`sk-ant-...`) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

Clic en **Save**.

---

## Paso 3 — Desplegar el backend desde Visual Studio

1. En Visual Studio, clic derecho sobre el proyecto `RifLearnAPI`
2. **Publish...**
3. **Target:** Azure → **Azure App Service (Windows)**
4. Selecciona tu suscripción y el App Service `riflearn-api`
5. Clic en **Finish → Publish**

> Visual Studio compila, empaqueta y sube el backend automáticamente.

---

## Paso 4 — Configurar la URL del backend en el frontend

En tu repo, crea el archivo `frontend/.env.production`:

```
VITE_API_URL=https://riflearn-api.azurewebsites.net
```

Haz commit y push a `main`. El GitHub Action desplegará automáticamente el frontend actualizado.

---

## Paso 5 — Configurar CORS en el backend

Abre `Program.cs` y actualiza la política CORS con la URL real del frontend:

```csharp
policy.WithOrigins(
    "http://localhost:5173",
    "https://riflearn-frontend.azurestaticapps.net"  // ← tu URL real
)
```

Vuelve a publicar desde Visual Studio.

---

## Paso 6 — Verificar que todo funciona

### Base de datos
- Ve a tu App Service → **Console**
- La primera petición al backend aplica las migraciones automáticamente

### Backend
Accede a: `https://riflearn-api.azurewebsites.net/swagger`

Prueba:
```
POST /api/auth/register
{ "name": "Test", "email": "test@test.com", "password": "123456" }
```

### Frontend
Accede a: `https://riflearn-frontend.azurestaticapps.net`

Prueba el registro, login, lecciones y quiz.

---

## Resumen de URLs finales

| Servicio | URL |
|----------|-----|
| Frontend | `https://riflearn-frontend.azurestaticapps.net` |
| Backend API | `https://riflearn-api.azurewebsites.net` |
| Swagger | `https://riflearn-api.azurewebsites.net/swagger` |
| Base de datos | Azure SQL (privada, solo acceso desde App Service) |

---

## Para la defensa — Demo en 6 minutos

1. **Abre el frontend** → muestra la Home (diseño, paleta, modo claro/oscuro)
2. **Regístrate** → muestra que se crea el usuario en Azure SQL
3. **Dashboard** → muestra el progreso, stats y logros
4. **Lección "Saludos"** → flip de tarjetas, modo lista
5. **Quiz** → responde preguntas, muestra resultado y puntuación guardada
6. **Tutor IA** → escribe "Quiero aprender a presentarme" → respuesta en tiempo real

> Tip: Ten todo abierto y precargado antes de la defensa. No cierres pestañas.
