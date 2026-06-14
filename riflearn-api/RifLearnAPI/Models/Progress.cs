// ============================================================
// Progress.cs — Progreso de un usuario en una lección
// ============================================================
// Registra qué porcentaje ha completado cada usuario
// en cada lección. Una fila por (usuario, lección).
// ============================================================

namespace AyehAPI.Models
{
    public class Progress
    {
        public int Id { get; set; }

        // Porcentaje completado (0-100)
        public int PercentageComplete { get; set; } = 0;

        // ¿Ha completado la lección al 100%?
        public bool IsCompleted { get; set; } = false;

        // Fecha de la última vez que estudió esta lección
        public DateTime LastStudiedAt { get; set; } = DateTime.UtcNow;

        // ── Relaciones ─────────────────────────────────────────
        // A qué usuario pertenece este progreso
        public int UserId { get; set; }
        public virtual User? User { get; set; }

        // A qué lección corresponde
        public int LessonId { get; set; }
        public virtual Lesson? Lesson { get; set; }
    }
}
