using AgendaContato.Models;
using AgendaContatos.Conexao;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgendaContato.Controllers
{
    [ApiController]
    [Route("[controller]")]
   
    public class LoginController : ControllerBase
    {
        private readonly DataBaseConexao _context;
        public LoginController(DataBaseConexao context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> Validate([FromBody] LoginDto model)
        {

            //if (model.Email == "admin@agenda.com" && model.Senha == "1234")
            //    return Ok(new { token = "abc123xyz", usuario = "Administrador" });

            try
            {
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Login == model.Email && u.Senha == model.Senha && u.Status==true);
                if (usuario == null)
                    return Unauthorized(new { mensagem = "Login ou senha inválidos." });

                string strToken = Guid.NewGuid().ToString();//token fake
                return Ok(new { token = strToken, usuario = "Administrador" });
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
            
        }
    }
}
