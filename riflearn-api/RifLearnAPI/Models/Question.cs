// ============================================================
// Question.cs — Pregunta de quiz
// ============================================================

namespace AyehAPI.Models
{
    // Tipos de pregunta posibles
    public enum QuestionType
    {
        MultipleChoice, // Opción múltiple (A, B, C, D)
        FillInTheBlank, // Completar el hueco
        Matching        // Emparejar (para versiones futuras)
    }

    public class Question
    {
        public int Id { get; set; }

        // Texto de la pregunta ("¿Qué significa 'Azul'?")
        public string QuestionText { get; set; } = string.Empty;

        // Respuesta correcta
        public string CorrectAnswer { get; set; } = string.Empty;

        // Opciones incorrectas separadas por | ("Gracias|Familia|Agua")
        // Solo se usa en MultipleChoice
        public string? WrongOptions { get; set; }

        // Tipo de pregunta
        public QuestionType Type { get; set; } = QuestionType.MultipleChoice;

        // Pista para FillInTheBlank ("Empieza por A")
        public string? Hint { get; set; }

        // ── Relación con Lesson ───────────────────────────────
        public int LessonId { get; set; }
        public virtual Lesson? Lesson { get; set; }
    }
}

// ============================================================
// QuizResult.cs — Resultado de un quiz completado
// ============================================================
// Guardamos cada vez que un usuario completa un quiz
// con su puntuación y fecha

namespace AyehAPI.Models
{
    public class QuizResult
    {
        public int Id { get; set; }

        // Puntuación obtenida (ej: 4)
        public int Score { get; set; }

        // Total de preguntas (ej: 5)
        public int TotalQuestions { get; set; }

        // Fecha en que completó el quiz
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

        // ── Relaciones ─────────────────────────────────────────
        public int UserId { get; set; }
        public virtual User? User { get; set; }

        public int LessonId { get; set; }
        public virtual Lesson? Lesson { get; set; }
    }
}
