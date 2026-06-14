// ============================================================
// QuizController.cs — Endpoints del quiz
// ============================================================
// GET  /api/quiz/lesson/{id} → preguntas de una lección
// POST /api/quiz/submit      → evalúa las respuestas y guarda resultado
// GET  /api/quiz/results     → historial de resultados del usuario
// ============================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AyehAPI.Data;
using AyehAPI.DTOs;
using AyehAPI.Models;

namespace AyehAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuizController : ControllerBase
    {
        private readonly AppDbContext _db;
        public QuizController(AppDbContext db) => _db = db;

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ============================================================
        // GET /api/quiz/lesson/{lessonId}
        // Devuelve las preguntas mezcladas (sin revelar la respuesta correcta)
        // ============================================================
        [HttpGet("lesson/{lessonId}")]
        public async Task<ActionResult<List<QuestionDto>>> GetByLesson(int lessonId)
        {
            var questions = await _db.Questions
                .Where(q => q.LessonId == lessonId)
                .ToListAsync();

            if (!questions.Any()) return NotFound(new { message = "No hay preguntas para esta lección" });

            var rng = new Random();

            // Mapeamos las preguntas a DTOs, mezclando las opciones
            var dtos = questions.Select(q =>
            {
                var dto = new QuestionDto
                {
                    Id           = q.Id,
                    QuestionText = q.QuestionText,
                    Type         = q.Type.ToString(),
                    Hint         = q.Hint,
                };

                if (q.Type == QuestionType.MultipleChoice && q.WrongOptions != null)
                {
                    // Combinamos correcta + incorrectas y mezclamos el orden
                    var allOptions = q.WrongOptions.Split('|').ToList();
                    allOptions.Add(q.CorrectAnswer);
                    dto.Options = allOptions.OrderBy(_ => rng.Next()).ToList();
                }

                return dto;
            }).ToList();

            return Ok(dtos);
        }

        // ============================================================
        // POST /api/quiz/submit
        // Body: { lessonId, answers: [{ questionId, userAnswer }] }
        // Evalúa cada respuesta y devuelve el resultado detallado
        // ============================================================
        [HttpPost("submit")]
        public async Task<ActionResult<QuizResultDto>> Submit(QuizSubmitDto dto)
        {
            var userId = GetUserId();

            // Cargamos todas las preguntas de las respuestas enviadas
            var questionIds = dto.Answers.Select(a => a.QuestionId).ToList();
            var questions   = await _db.Questions
                .Where(q => questionIds.Contains(q.Id))
                .ToDictionaryAsync(q => q.Id);

            // Evaluamos cada respuesta
            var details = dto.Answers.Select(answer =>
            {
                if (!questions.ContainsKey(answer.QuestionId))
                    return null;

                var q         = questions[answer.QuestionId];
                // Comparamos ignorando mayúsculas y espacios
                var isCorrect = answer.UserAnswer.Trim().Equals(
                    q.CorrectAnswer.Trim(), StringComparison.OrdinalIgnoreCase);

                return new AnswerResultDto
                {
                    Question      = q.QuestionText,
                    UserAnswer    = answer.UserAnswer,
                    CorrectAnswer = q.CorrectAnswer,
                    IsCorrect     = isCorrect
                };
            }).Where(d => d != null).ToList();

            var score = details.Count(d => d!.IsCorrect);

            // Guardamos el resultado en la BD
            _db.QuizResults.Add(new QuizResult
            {
                UserId         = userId,
                LessonId       = dto.LessonId,
                Score          = score,
                TotalQuestions = details.Count,
                CompletedAt    = DateTime.UtcNow
            });

            // Actualizamos el progreso de la lección según la puntuación
            var percentage = (int)((double)score / details.Count * 100);
            var progress   = await _db.Progresses
                .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == dto.LessonId);

            if (progress == null)
            {
                _db.Progresses.Add(new Progress
                {
                    UserId = userId, LessonId = dto.LessonId,
                    PercentageComplete = percentage, IsCompleted = percentage == 100
                });
            }
            else if (percentage > progress.PercentageComplete)
            {
                progress.PercentageComplete = percentage;
                progress.IsCompleted        = percentage == 100;
                progress.LastStudiedAt       = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();

            return Ok(new QuizResultDto
            {
                Score          = score,
                TotalQuestions = details.Count,
                Details        = details!
            });
        }

        // ============================================================
        // GET /api/quiz/results
        // Historial de todos los quizzes completados por el usuario
        // ============================================================
        [HttpGet("results")]
        public async Task<IActionResult> GetResults()
        {
            var userId = GetUserId();

            var results = await _db.QuizResults
                .Include(r => r.Lesson)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CompletedAt)
                .Select(r => new
                {
                    r.Id,
                    Lesson      = r.Lesson!.Title,
                    r.Score,
                    r.TotalQuestions,
                    r.CompletedAt
                })
                .ToListAsync();

            return Ok(results);
        }
    }
}
