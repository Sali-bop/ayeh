// ============================================================
// AppDbContext.cs — Puente entre C# y la base de datos
// ============================================================
// Entity Framework usa esta clase para:
//   1. Saber qué tablas existen (DbSet<T>)
//   2. Configurar relaciones y restricciones
//   3. Generar las migraciones (los scripts SQL)
//   4. Insertar datos iniciales (seed data)
// ============================================================

using Microsoft.EntityFrameworkCore;
using AyehAPI.Models;

namespace AyehAPI.Data
{
    public class AppDbContext : DbContext
    {
        // El constructor recibe la configuración de la BD (cadena de conexión)
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ── DbSets — cada uno = una tabla en la BD ────────────
        public DbSet<User>       Users       { get; set; }
        public DbSet<Category>   Categories  { get; set; }
        public DbSet<Lesson>     Lessons     { get; set; }
        public DbSet<VocabItem>  VocabItems  { get; set; }
        public DbSet<Question>   Questions   { get; set; }
        public DbSet<Progress>   Progresses  { get; set; }
        public DbSet<QuizResult> QuizResults { get; set; }

        // OnModelCreating → configuración avanzada y datos iniciales
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Configuración de User ─────────────────────────
            modelBuilder.Entity<User>(e =>
            {
                // Email único — no puede haber dos usuarios con el mismo email
                e.HasIndex(u => u.Email).IsUnique();
                e.Property(u => u.Name).HasMaxLength(100);
                e.Property(u => u.Email).HasMaxLength(200);
            });

            // ── Configuración de Lesson ───────────────────────
            modelBuilder.Entity<Lesson>(e =>
            {
                // Relación: Lesson pertenece a Category
                // Si se borra la categoría, no se borran las lecciones (Restrict)
                e.HasOne(l => l.Category)
                 .WithMany(c => c.Lessons)
                 .HasForeignKey(l => l.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Configuración de Progress ─────────────────────
            modelBuilder.Entity<Progress>(e =>
            {
                // Un usuario no puede tener dos registros de progreso
                // para la misma lección — índice único compuesto
                e.HasIndex(p => new { p.UserId, p.LessonId }).IsUnique();
            });

            // ── SEED DATA — datos iniciales ───────────────────
            // Se insertan automáticamente con la primera migración

            // Categorías
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Básico",      Description = "Para empezar desde cero", SortOrder = 1 },
                new Category { Id = 2, Name = "Intermedio",  Description = "Amplía tu vocabulario",   SortOrder = 2 },
                new Category { Id = 3, Name = "Avanzado",    Description = "Domina el tarifit",       SortOrder = 3 }
            );

            // Lecciones
            modelBuilder.Entity<Lesson>().HasData(
                new Lesson { Id = 1, Title = "Saludos básicos", Description = "Aprende a saludar en tarifit", Icon = "👋", CategoryId = 1, SortOrder = 1 },
                new Lesson { Id = 2, Title = "Familia",         Description = "Miembros de la familia",       Icon = "👨‍👩‍👧", CategoryId = 1, SortOrder = 2 },
                new Lesson { Id = 3, Title = "Números 1-20",    Description = "Cuenta del 1 al 20",           Icon = "🔢", CategoryId = 1, SortOrder = 3 },
                new Lesson { Id = 4, Title = "Colores",         Description = "Los colores en tarifit",       Icon = "🎨", CategoryId = 2, SortOrder = 1 },
                new Lesson { Id = 5, Title = "Animales",        Description = "Animales comunes",             Icon = "🐾", CategoryId = 2, SortOrder = 2 },
                new Lesson { Id = 6, Title = "Comida",          Description = "Alimentos y bebidas",          Icon = "🍲", CategoryId = 2, SortOrder = 3 }
            );

            // Vocabulario — Lección 1: Saludos
            modelBuilder.Entity<VocabItem>().HasData(
                new VocabItem { Id = 1,  LessonId = 1, Spanish = "Hola",          Tarifit = "Azul",        ExampleSentence = "Azul, labas?" },
                new VocabItem { Id = 2,  LessonId = 1, Spanish = "Adiós",         Tarifit = "Akka",        ExampleSentence = "Akka, a zin!" },
                new VocabItem { Id = 3,  LessonId = 1, Spanish = "¿Cómo estás?",  Tarifit = "Labas?",      ExampleSentence = "Azul! Labas?" },
                new VocabItem { Id = 4,  LessonId = 1, Spanish = "Bien",          Tarifit = "Labas",       ExampleSentence = "Labas, tanemmirt" },
                new VocabItem { Id = 5,  LessonId = 1, Spanish = "Gracias",       Tarifit = "Tanemmirt",   ExampleSentence = "Tanemmirt, a gma" },
                new VocabItem { Id = 6,  LessonId = 1, Spanish = "De nada",       Tarifit = "Wakha",       ExampleSentence = "Wakha, ur illi walu" },
                new VocabItem { Id = 7,  LessonId = 1, Spanish = "Por favor",     Tarifit = "Rjak",        ExampleSentence = "Rjak, ini yas" },
                new VocabItem { Id = 8,  LessonId = 1, Spanish = "Perdona",       Tarifit = "Samḥ",        ExampleSentence = "Samḥ iyi, a gma" }
            );

            // Vocabulario — Lección 2: Familia
            modelBuilder.Entity<VocabItem>().HasData(
                new VocabItem { Id = 9,  LessonId = 2, Spanish = "Padre",    Tarifit = "Baba",     ExampleSentence = "Baba inu d ameqqran" },
                new VocabItem { Id = 10, LessonId = 2, Spanish = "Madre",    Tarifit = "Yemma",    ExampleSentence = "Yemma inu tessen arifen" },
                new VocabItem { Id = 11, LessonId = 2, Spanish = "Hermano",  Tarifit = "Gma",      ExampleSentence = "Gma inu d amzyan" },
                new VocabItem { Id = 12, LessonId = 2, Spanish = "Hermana",  Tarifit = "Ultma",    ExampleSentence = "Ultma inu tga tamɣart" },
                new VocabItem { Id = 13, LessonId = 2, Spanish = "Familia",  Tarifit = "Tawacult", ExampleSentence = "Tawacult inu d tamqqrant" }
            );

            // Vocabulario — Lección 3: Números
            modelBuilder.Entity<VocabItem>().HasData(
                new VocabItem { Id = 14, LessonId = 3, Spanish = "Uno",    Tarifit = "Yan"      },
                new VocabItem { Id = 15, LessonId = 3, Spanish = "Dos",    Tarifit = "Sin"      },
                new VocabItem { Id = 16, LessonId = 3, Spanish = "Tres",   Tarifit = "Kraḍ"     },
                new VocabItem { Id = 17, LessonId = 3, Spanish = "Cuatro", Tarifit = "Kkuẓ"     },
                new VocabItem { Id = 18, LessonId = 3, Spanish = "Cinco",  Tarifit = "Semmus"   },
                new VocabItem { Id = 19, LessonId = 3, Spanish = "Diez",   Tarifit = "Mraw"     },
                new VocabItem { Id = 20, LessonId = 3, Spanish = "Veinte", Tarifit = "Ţţamraw"  }
            );

            // Preguntas de quiz — Lección 1
            modelBuilder.Entity<Question>().HasData(
                new Question { Id = 1, LessonId = 1, QuestionText = "¿Qué significa 'Azul' en rifeño?",    CorrectAnswer = "Hola",    WrongOptions = "Gracias|Familia|Agua",    Type = QuestionType.MultipleChoice },
                new Question { Id = 2, LessonId = 1, QuestionText = "¿Cómo se dice 'Gracias' en tarifit?", CorrectAnswer = "Tanemmirt",WrongOptions = "Azul|Aman|Labas",         Type = QuestionType.MultipleChoice },
                new Question { Id = 3, LessonId = 1, QuestionText = "_____ significa 'Agua' en español.",  CorrectAnswer = "Aman",     Hint = "Empieza por A",                   Type = QuestionType.FillInTheBlank },
                new Question { Id = 4, LessonId = 1, QuestionText = "¿Cómo se dice 'De nada' en tarifit?", CorrectAnswer = "Wakha",    WrongOptions = "Rjak|Samḥ|Labas",         Type = QuestionType.MultipleChoice }
            );
        }
    }
}
