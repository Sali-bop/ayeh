// ============================================================
// User.cs — Modelo de usuario
// ============================================================
// Representa la tabla "Users" en la base de datos.
// Cada propiedad = una columna en la tabla.
// ============================================================

namespace AyehAPI.Models
{
    public class User
    {
        // Clave primaria — EF la auto-incrementa (1, 2, 3...)
        public int Id { get; set; }

        // Nombre del usuario (máx 100 caracteres en la BD)
        public string Name { get; set; } = string.Empty;

        // Email único — lo usaremos para el login
        public string Email { get; set; } = string.Empty;

        // Contraseña encriptada con BCrypt (NUNCA guardamos texto plano)
        public string PasswordHash { get; set; } = string.Empty;

        // Fecha de registro — se asigna automáticamente al crear
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relación 1:N — un usuario tiene muchos registros de progreso
        // "virtual" permite a EF cargar esta lista bajo demanda (lazy loading)
        public virtual ICollection<Progress> Progresses { get; set; } = new List<Progress>();

        // Relación 1:N — un usuario tiene muchos resultados de quiz
        public virtual ICollection<QuizResult> QuizResults { get; set; } = new List<QuizResult>();
    }
}
