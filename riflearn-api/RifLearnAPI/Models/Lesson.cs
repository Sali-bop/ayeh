// ============================================================
// Lesson.cs — Lección de tarifit
// ============================================================
// Representa una lección completa con su vocabulario.
// Ejemplos: "Saludos básicos", "Familia", "Números 1-20"
// ============================================================

namespace AyehAPI.Models
{
    public class Lesson
    {
        public int Id { get; set; }

        // Título de la lección ("Saludos básicos")
        public string Title { get; set; } = string.Empty;

        // Descripción breve de qué se aprende
        public string Description { get; set; } = string.Empty;

        // Emoji que representa la lección ("👋", "👨‍👩‍👧", "🔢")
        public string Icon { get; set; } = string.Empty;

        // Orden dentro de la categoría
        public int SortOrder { get; set; }

        // Fecha de creación
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ── Relación con Category ──────────────────────────────
        // Clave foránea — apunta al Id de la categoría
        public int CategoryId { get; set; }

        // Propiedad de navegación — permite hacer lesson.Category.Name
        public virtual Category? Category { get; set; }

        // ── Relaciones ─────────────────────────────────────────
        // Una lección tiene muchas palabras de vocabulario
        public virtual ICollection<VocabItem> VocabItems { get; set; } = new List<VocabItem>();

        // Una lección tiene muchas preguntas de quiz
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

        // Una lección puede tener muchos registros de progreso (uno por usuario)
        public virtual ICollection<Progress> Progresses { get; set; } = new List<Progress>();
    }
}
