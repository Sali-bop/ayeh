// ============================================================
// AuthController.cs — Endpoints de autenticación
// ============================================================
// POST /api/auth/register → crea un nuevo usuario
// POST /api/auth/login    → devuelve token JWT
// GET  /api/auth/me       → datos del usuario logueado
// ============================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AyehAPI.Data;
using AyehAPI.DTOs;
using AyehAPI.Models;

namespace AyehAPI.Controllers
{
    // [ApiController]  → habilita validación automática y respuestas 400
    // [Route(...)]     → todos los endpoints empiezan por /api/auth
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        // Inyección de dependencias — .NET nos pasa estos objetos automáticamente
        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db     = db;
            _config = config;
        }

        // ============================================================
        // POST /api/auth/register
        // Body: { name, email, password }
        // ============================================================
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Todos los campos son obligatorios" });

            if (dto.Password.Length < 6)
                return BadRequest(new { message = "La contraseña debe tener al menos 6 caracteres" });

            // Comprobar si el email ya existe
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email.ToLower()))
                return BadRequest(new { message = "Este email ya está registrado" });

            // Crear el usuario con contraseña encriptada
            // BCrypt.HashPassword → transforma "12345" en "$2a$11$..."
            // NUNCA guardamos la contraseña en texto plano
            var user = new User
            {
                Name         = dto.Name.Trim(),
                Email        = dto.Email.ToLower().Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(); // guarda en la BD y asigna el Id

            // Generamos el token JWT y devolvemos la respuesta
            return Ok(BuildAuthResponse(user));
        }

        // ============================================================
        // POST /api/auth/login
        // Body: { email, password }
        // ============================================================
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            // Buscamos al usuario por email
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());

            // BCrypt.Verify → compara la contraseña con el hash guardado
            // Si el usuario no existe o la contraseña no coincide → 401
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Email o contraseña incorrectos" });

            return Ok(BuildAuthResponse(user));
        }

        // ============================================================
        // GET /api/auth/me
        // Requiere token JWT válido en la cabecera Authorization
        // ============================================================
        [HttpGet("me")]
        [Authorize] // Solo accesible si hay token JWT válido
        public async Task<ActionResult<UserDto>> Me()
        {
            // Leemos el Id del usuario desde el token JWT
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user   = await _db.Users.FindAsync(userId);

            if (user == null) return NotFound();

            return Ok(new UserDto { Id = user.Id, Name = user.Name, Email = user.Email });
        }

        // ============================================================
        // Método privado — genera el token JWT y construye la respuesta
        // ============================================================
        private AuthResponseDto BuildAuthResponse(User user)
        {
            var token = GenerateJwtToken(user);
            return new AuthResponseDto
            {
                Token = token,
                User  = new UserDto { Id = user.Id, Name = user.Name, Email = user.Email }
            };
        }

        private string GenerateJwtToken(User user)
        {
            // Claims → datos que van "dentro" del token (como el payload)
            // El token es legible pero no modificable sin la clave secreta
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email,          user.Email),
                new Claim(ClaimTypes.Name,           user.Name),
            };

            // La clave secreta para firmar el token (viene de appsettings.json)
            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Construimos el token con expiración de 7 días
            var token = new JwtSecurityToken(
                issuer:   _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims:   claims,
                expires:  DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            // Serializamos el token a string ("eyJhbGci...")
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
