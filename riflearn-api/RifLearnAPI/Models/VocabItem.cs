// ============================================================
// VocabItem.cs — Par de vocabulario (español → tarifit)
// ============================================================
// Cada fila es una palabra dentro de una lección.
// Ejemplo: { Spanish: "Hola", Tarifit: "Azul" }
// ============================================================

namespace AyehAPI.Models
{
    public class VocabItem
    {
        public int Id { get; set; }

        // Palabra en español
        public string Spanish { get; set; } = string.Empty;

        // Traducción en tarifit (transliteración latina)
        public string Tarifit { get; set; } = string.Empty;

        // Ejemplo de uso en una frase (opcional)
        public string? ExampleSentence { get; set; }

        // URL de audio de pronunciación (opcional, para futuras versiones)
        public string? AudioUrl { get; set; }

        // ── Relación con Lesson ───────────────────────────────
        public int LessonId { get; set; }
        public virtual Lesson? Lesson { get; set; }
    }
}
