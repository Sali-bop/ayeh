// ============================================================
// Program.cs — Arranque y configuración de la API
// ============================================================
// Este archivo es el punto de entrada del backend.
// Aquí configuramos todos los servicios: BD, JWT, CORS, Swagger.
// ============================================================

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using AyehAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// ── 1. BASE DE DATOS ──────────────────────────────────────────
// Registramos AppDbContext con la cadena de conexión de appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── 2. AUTENTICACIÓN JWT ──────────────────────────────────────
// Configuramos cómo se validan los tokens JWT en cada petición
var jwtSecret = builder.Configuration["Jwt:Secret"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            // La clave debe coincidir con la que usamos para crear los tokens
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer   = true,
            ValidIssuer      = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience    = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true, // Rechaza tokens expirados
            ClockSkew        = TimeSpan.Zero // Sin margen de tiempo extra
        };
    });

builder.Services.AddAuthorization();

// ── 3. CORS ───────────────────────────────────────────────────
// Permite que el frontend React (localhost:5173) llame a la API
// Sin esto, el navegador bloquearía las peticiones por seguridad
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://ayeh-api-gmgtbfg0edace5d9.francecentral-01.azurewebsites.net",
                "https://ayeh.netlify.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── 4. CONTROLLERS Y SERVICIOS ────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddHttpClient(); // Para llamar a la API de Anthropic

// ── 5. SWAGGER ───────────────────────────────────────────────
// Swagger genera una UI para probar la API en el navegador
// Accesible en: https://localhost:5001/swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "Ayeh API",
        Version     = "v1",
        Description = "API para la plataforma de aprendizaje del idioma rifeño (tarifit)"
    });

    // Configuramos Swagger para que acepte tokens JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Token JWT. Ejemplo: Bearer eyJhbGci...",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

// ── CONSTRUIR LA APP ──────────────────────────────────────────
var app = builder.Build();

// ── MIDDLEWARE (orden importante) ─────────────────────────────

// Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ayeh v1"));
}

app.UseHttpsRedirection(); // Redirige HTTP → HTTPS

app.UseCors("AllowFrontend"); // CORS antes de Auth

app.UseAuthentication(); // Verifica el token JWT
app.UseAuthorization();  // Verifica los permisos

app.MapControllers(); // Registra los endpoints de los controllers

// ── MIGRACIÓN AUTOMÁTICA AL ARRANCAR ─────────────────────────
// Aplica las migraciones pendientes al iniciar la app
// Útil en desarrollo y en Azure para el primer despliegue
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // equivale a "dotnet ef database update"
}

app.Run();
