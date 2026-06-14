using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RifLearnAPI.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Progresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PercentageComplete = table.Column<int>(type: "int", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    LastStudiedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LessonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Progresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Progresses_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Progresses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorrectAnswer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WrongOptions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Hint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Score = table.Column<int>(type: "int", nullable: false),
                    TotalQuestions = table.Column<int>(type: "int", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LessonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizResults_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizResults_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VocabItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Spanish = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tarifit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExampleSentence = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AudioUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VocabItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VocabItems_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name", "SortOrder" },
                values: new object[,]
                {
                    { 1, "Para empezar desde cero", "Básico", 1 },
                    { 2, "Amplía tu vocabulario", "Intermedio", 2 },
                    { 3, "Domina el tarifit", "Avanzado", 3 }
                });

            migrationBuilder.InsertData(
                table: "Lessons",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "Description", "Icon", "SortOrder", "Title" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 6, 14, 20, 33, 24, 888, DateTimeKind.Utc).AddTicks(6176), "Aprende a saludar en tarifit", "👋", 1, "Saludos básicos" },
                    { 2, 1, new DateTime(2026, 6, 14, 20, 33, 24, 888, DateTimeKind.Utc).AddTicks(6188), "Miembros de la familia", "👨‍👩‍👧", 2, "Familia" },
                    { 3, 1, new DateTime(2026, 6, 14, 20, 33, 24, 888, DateTimeKind.Utc).AddTicks(6191), "Cuenta del 1 al 20", "🔢", 3, "Números 1-20" },
                    { 4, 2, new DateTime(2026, 6, 14, 20, 33, 24, 888, DateTimeKind.Utc).AddTicks(6194), "Los colores en tarifit", "🎨", 1, "Colores" },
                    { 5, 2, new DateTime(2026, 6, 14, 20, 33, 24, 888, DateTimeKind.Utc).AddTicks(6198), "Animales comunes", "🐾", 2, "Animales" },
                    { 6, 2, new DateTime(2026, 6, 14, 20, 33, 24, 888, DateTimeKind.Utc).AddTicks(6202), "Alimentos y bebidas", "🍲", 3, "Comida" }
                });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "CorrectAnswer", "Hint", "LessonId", "QuestionText", "Type", "WrongOptions" },
                values: new object[,]
                {
                    { 1, "Hola", null, 1, "¿Qué significa 'Azul' en rifeño?", 0, "Gracias|Familia|Agua" },
                    { 2, "Tanemmirt", null, 1, "¿Cómo se dice 'Gracias' en tarifit?", 0, "Azul|Aman|Labas" },
                    { 3, "Aman", "Empieza por A", 1, "_____ significa 'Agua' en español.", 1, null },
                    { 4, "Wakha", null, 1, "¿Cómo se dice 'De nada' en tarifit?", 0, "Rjak|Samḥ|Labas" }
                });

            migrationBuilder.InsertData(
                table: "VocabItems",
                columns: new[] { "Id", "AudioUrl", "ExampleSentence", "LessonId", "Spanish", "Tarifit" },
                values: new object[,]
                {
                    { 1, null, "Azul, labas?", 1, "Hola", "Azul" },
                    { 2, null, "Akka, a zin!", 1, "Adiós", "Akka" },
                    { 3, null, "Azul! Labas?", 1, "¿Cómo estás?", "Labas?" },
                    { 4, null, "Labas, tanemmirt", 1, "Bien", "Labas" },
                    { 5, null, "Tanemmirt, a gma", 1, "Gracias", "Tanemmirt" },
                    { 6, null, "Wakha, ur illi walu", 1, "De nada", "Wakha" },
                    { 7, null, "Rjak, ini yas", 1, "Por favor", "Rjak" },
                    { 8, null, "Samḥ iyi, a gma", 1, "Perdona", "Samḥ" },
                    { 9, null, "Baba inu d ameqqran", 2, "Padre", "Baba" },
                    { 10, null, "Yemma inu tessen arifen", 2, "Madre", "Yemma" },
                    { 11, null, "Gma inu d amzyan", 2, "Hermano", "Gma" },
                    { 12, null, "Ultma inu tga tamɣart", 2, "Hermana", "Ultma" },
                    { 13, null, "Tawacult inu d tamqqrant", 2, "Familia", "Tawacult" },
                    { 14, null, null, 3, "Uno", "Yan" },
                    { 15, null, null, 3, "Dos", "Sin" },
                    { 16, null, null, 3, "Tres", "Kraḍ" },
                    { 17, null, null, 3, "Cuatro", "Kkuẓ" },
                    { 18, null, null, 3, "Cinco", "Semmus" },
                    { 19, null, null, 3, "Diez", "Mraw" },
                    { 20, null, null, 3, "Veinte", "Ţţamraw" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_CategoryId",
                table: "Lessons",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Progresses_LessonId",
                table: "Progresses",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_Progresses_UserId_LessonId",
                table: "Progresses",
                columns: new[] { "UserId", "LessonId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Questions_LessonId",
                table: "Questions",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizResults_LessonId",
                table: "QuizResults",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizResults_UserId",
                table: "QuizResults",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VocabItems_LessonId",
                table: "VocabItems",
                column: "LessonId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Progresses");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "QuizResults");

            migrationBuilder.DropTable(
                name: "VocabItems");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
