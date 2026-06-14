// ============================================================
// LessonsController.cs — Endpoints de lecciones
// ============================================================
// GET /api/lessons          → lista todas las lecciones
// GET /api/lessons/{id}     → detalle de una lección con vocabulario
// PUT /api/lessons/{id}/progress → actualiza el progreso del usuario
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
    [Authorize] // Todos los endpoints requieren login
    public class LessonsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public LessonsController(AppDbContext db) => _db = db;

        // Helper — lee el Id del usuario desde el token JWT
        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ============================================================
        // GET /api/lessons
        // Devuelve todas las lecciones con el progreso del usuario
        // ============================================================
        [HttpGet]
        public async Task<ActionResult<List<LessonSummaryDto>>> GetAll()
        {
            var userId = GetUserId();

            // Cargamos lecciones con su categoría y palabras
            var lessons = await _db.Lessons
                .Include(l => l.Category)
                .Include(l => l.VocabItems)
                .OrderBy(l => l.CategoryId)
                .ThenBy(l => l.SortOrder)
                .ToListAsync();

            // Cargamos el progreso del usuario en todas las lecciones
            var progresses = await _db.Progresses
                .Where(p => p.UserId == userId)
                .ToDictionaryAsync(p => p.LessonId, p => p.PercentageComplete);

            // Mapeamos a DTOs
            var result = lessons.Select(l => new LessonSummaryDto
            {
                Id          = l.Id,
                Title       = l.Title,
                Description = l.Description,
                Icon        = l.Icon,
                Category    = l.Category?.Name ?? "",
                WordCount   = l.VocabItems.Count,
                // Si no hay registro de progreso, el porcentaje es 0
                Progress    = progresses.ContainsKey(l.Id) ? progresses[l.Id] : 0
            }).ToList();

            return Ok(result);
        }

        // ============================================================
        // GET /api/lessons/{id}
        // Devuelve una lección con su vocabulario completo
        // ============================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<LessonDetailDto>> GetById(int id)
        {
            var userId = GetUserId();

            var lesson = await _db.Lessons
                .Include(l => l.Category)
                .Include(l => l.VocabItems)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lesson == null) return NotFound();

            // Buscamos el progreso del usuario en esta lección
            var progress = await _db.Progresses
                .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == id);

            return Ok(new LessonDetailDto
            {
                Id          = lesson.Id,
                Title       = lesson.Title,
                Description = lesson.Description,
                Icon        = lesson.Icon,
                Category    = lesson.Category?.Name ?? "",
                Progress    = progress?.PercentageComplete ?? 0,
                VocabItems  = lesson.VocabItems.Select(v => new VocabItemDto
                {
                    Id              = v.Id,
                    Spanish         = v.Spanish,
                    Tarifit         = v.Tarifit,
                    ExampleSentence = v.ExampleSentence
                }).ToList()
            });
        }

        // ============================================================
        // PUT /api/lessons/{id}/progress
        // Body: { percentage: 80 }
        // Crea o actualiza el registro de progreso del usuario
        // ============================================================
        [HttpPut("{id}/progress")]
        public async Task<IActionResult> UpdateProgress(int id, [FromBody] UpdateProgressDto dto)
        {
            var userId = GetUserId();

            // Buscamos si ya existe un registro de progreso
            var progress = await _db.Progresses
                .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == id);

            if (progress == null)
            {
                // Primera vez que estudia esta lección → creamos el registro
                progress = new Progress
                {
                    UserId    = userId,
                    LessonId  = id,
                    PercentageComplete = dto.Percentage,
                    IsCompleted        = dto.Percentage >= 100
                };
                _db.Progresses.Add(progress);
            }
            else
            {
                // Ya existe → solo actualizamos si el nuevo % es mayor
                // (no queremos que baje el progreso)
                if (dto.Percentage > progress.PercentageComplete)
                {
                    progress.PercentageComplete = dto.Percentage;
                    progress.IsCompleted        = dto.Percentage >= 100;
                    progress.LastStudiedAt       = DateTime.UtcNow;
                }
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Progreso actualizado", percentage = progress.PercentageComplete });
        }
    }

    // DTO para el endpoint de progreso (pequeño, lo definimos aquí)
    public class UpdateProgressDto
    {
        public int Percentage { get; set; }
    }
}
