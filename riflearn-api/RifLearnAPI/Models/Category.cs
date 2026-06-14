// ============================================================
// Category.cs — Categorías de lecciones
// ============================================================
// Ejemplos: "Básico", "Intermedio", "Avanzado"
// Una categoría agrupa varias lecciones
// ============================================================

namespace AyehAPI.Models
{
    public class Category
    {
        public int Id { get; set; }

        // Nombre de la categoría (Básico, Intermedio, Avanzado)
        public string Name { get; set; } = string.Empty;

        // Descripción opcional de la categoría
        public string Description { get; set; } = string.Empty;

        // Orden de aparición en la UI (1 = primero)
        public int SortOrder { get; set; }

        // Relación 1:N — una categoría tiene muchas lecciones
        public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    }
}
