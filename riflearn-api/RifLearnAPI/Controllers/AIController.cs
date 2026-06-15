// ============================================================
// AIController.cs — Endpoint del Tutor IA
// ============================================================
// POST /api/ai/chat → recibe historial de mensajes y devuelve
//                     la respuesta del tutor de tarifit
// ============================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using AyehAPI.DTOs;

namespace AyehAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public AIController(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        // ============================================================
        // POST /api/ai/chat
        // Body: { messages: [{ role: "user", content: "..." }] }
        // ============================================================
        [HttpPost("chat")]
        public async Task<ActionResult<ChatResponseDto>> Chat(ChatRequestDto dto)
        {
            if (dto.Messages == null || !dto.Messages.Any())
                return BadRequest(new { message = "Se requieren mensajes" });

            var apiKey = _config["Anthropic:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, new { message = "API key de Anthropic no configurada" });

            // System prompt del tutor de tarifit
            const string systemPrompt = @"Eres un tutor experto en el idioma rifeño (tarifit), una variante del amazigh hablada en el norte de Marruecos.
Tu misión es ayudar a estudiantes hispanohablantes a aprender tarifit de forma natural y progresiva.

Reglas:
- Responde siempre en español, pero incluye ejemplos y palabras en tarifit
- Usa transliteración latina clara para las palabras en tarifit
- Adapta el nivel al del estudiante (empieza en básico)
- Incluye siempre: traducción, ejemplo de uso y un mini ejercicio al final
- Sé cercano, motivador y breve (máximo 150 palabras por respuesta)
- Si el estudiante escribe una palabra en tarifit, corrígela si está mal y felicítale si está bien";

            try
            {
                // Construimos el cuerpo de la petición a la API de Anthropic
                var requestBody = new
                {
                    model      = "claude-sonnet-4-5",
                    max_tokens = 1000,
                    system     = systemPrompt,
                    messages   = dto.Messages.Select(m => new { role = m.Role, content = m.Content })
                };

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("x-api-key",         apiKey);
                client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");

                var json     = JsonSerializer.Serialize(requestBody);
                var content  = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("https://api.anthropic.com/v1/messages", content);

                if (!response.IsSuccessStatusCode)
                    return StatusCode(500, new { message = "Error al conectar con el tutor IA" });

                var responseJson = await response.Content.ReadAsStringAsync();
                var parsed       = JsonSerializer.Deserialize<JsonElement>(responseJson);

                // Extraemos el texto de la respuesta
                var reply = parsed
                    .GetProperty("content")[0]
                    .GetProperty("text")
                    .GetString() ?? "No pude generar una respuesta.";

                return Ok(new ChatResponseDto { Reply = reply });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno", detail = ex.Message });
            }
        }
    }
}
