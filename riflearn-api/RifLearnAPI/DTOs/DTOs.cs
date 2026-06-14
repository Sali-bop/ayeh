// ============================================================
// DTOs.cs — Data Transfer Objects
// ============================================================
// Un DTO es un objeto simplificado para enviar/recibir datos.
// En vez de exponer el modelo completo (con PasswordHash, etc.)
// usamos DTOs que solo contienen lo necesario.
// ============================================================

namespace AyehAPI.DTOs
{
    // ── AUTH ──────────────────────────────────────────────────

    // Lo que el cliente envía para registrarse
    public class RegisterDto
    {
        public string Name     { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Lo que el cliente envía para iniciar sesión
    public class LoginDto
    {
        public string Email    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Lo que devolvemos tras login/registro exitoso
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User  { get; set; } = new();
    }

    // Datos públicos del usuario (sin contraseña)
    public class UserDto
    {
        public int    Id    { get; set; }
        public string Name  { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // ── LECCIONES ─────────────────────────────────────────────

    // Lección resumida para la lista
    public class LessonSummaryDto
    {
        public int    Id          { get; set; }
        public string Title       { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon        { get; set; } = string.Empty;
        public string Category    { get; set; } = string.Empty;
        public int    WordCount   { get; set; }
        public int    Progress    { get; set; } // 0-100, del usuario actual
    }

    // Lección completa con vocabulario
    public class LessonDetailDto
    {
        public int    Id          { get; set; }
        public string Title       { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon        { get; set; } = string.Empty;
        public string Category    { get; set; } = string.Empty;
        public int    Progress    { get; set; }
        public List<VocabItemDto> VocabItems { get; set; } = new();
    }

    // Par de vocabulario
    public class VocabItemDto
    {
        public int    Id              { get; set; }
        public string Spanish         { get; set; } = string.Empty;
        public string Tarifit         { get; set; } = string.Empty;
        public string? ExampleSentence { get; set; }
    }

    // ── QUIZ ──────────────────────────────────────────────────

    // Pregunta enviada al cliente (sin revelar la respuesta)
    public class QuestionDto
    {
        public int    Id           { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string Type         { get; set; } = string.Empty; // "MultipleChoice" | "FillInTheBlank"
        public List<string> Options { get; set; } = new(); // opciones mezcladas (correcta + incorrectas)
        public string? Hint        { get; set; }
    }

    // Lo que el cliente envía al terminar el quiz
    public class QuizSubmitDto
    {
        public int LessonId { get; set; }
        // Lista de { QuestionId, UserAnswer }
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        public int    QuestionId { get; set; }
        public string UserAnswer { get; set; } = string.Empty;
    }

    // Resultado devuelto tras evaluar el quiz
    public class QuizResultDto
    {
        public int Score          { get; set; }
        public int TotalQuestions { get; set; }
        public List<AnswerResultDto> Details { get; set; } = new();
    }

    public class AnswerResultDto
    {
        public string Question      { get; set; } = string.Empty;
        public string UserAnswer    { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public bool   IsCorrect     { get; set; }
    }

    // ── IA ────────────────────────────────────────────────────

    // Mensaje del chat IA
    public class ChatMessageDto
    {
        public string Role    { get; set; } = string.Empty; // "user" | "assistant"
        public string Content { get; set; } = string.Empty;
    }

    // Lo que el cliente envía al endpoint de IA
    public class ChatRequestDto
    {
        public List<ChatMessageDto> Messages { get; set; } = new();
    }

    // Lo que devuelve el endpoint de IA
    public class ChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;
    }
}
