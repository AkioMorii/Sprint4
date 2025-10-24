using AgendaContatos.Conexao;
using AgendaContatos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly DataBaseConexao _context;

    public UsuarioController(DataBaseConexao context)
    {
        _context = context;
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] string? filtroNome)
    {
        var usuarios = from c in _context.Usuarios select c;

        if (!string.IsNullOrEmpty(filtroNome))
        {
            usuarios = usuarios.Where(c => c.Nome.Contains(filtroNome));
        }
        return Ok(await usuarios.ToListAsync());
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] Usuarios model)
    {
        if (ModelState.IsValid)
        {
            model.Telefone = model.Telefone.Replace("(", "").Replace(")", "").Replace(" ", "").Replace("-", "");

            model.DataCadastro = DateTime.UtcNow;
            model.Status = true;
            _context.Usuarios.Add(model);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                throw new InvalidOperationException("Erro ao salvar alterações no banco de dados.", ex);
            }

            return Ok(model);
        }
        return BadRequest(ModelState);
    }

    [HttpGet("getOne/{id}")]
    public async Task<IActionResult>GetOne(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();
        return Ok(usuario);
    }
    [HttpPost("edit/{id}")]
    public async Task<IActionResult> EditConfirmed(int id, [FromBody] Usuarios model)
    {
        if (id != model.Usuario_id) return BadRequest();

        if (ModelState.IsValid)
        {
            Usuarios usuario = await _context.Usuarios.FindAsync(id);
            if(usuario == null) return NotFound();
            usuario.Nome=model.Nome;
            usuario.Email=model.Email;
            usuario.Login=model.Login;
            usuario.Telefone = model.Telefone.Replace("(", "").Replace(")", "").Replace(" ", "").Replace("-", "");
            usuario.Status=model.Status;
            try
            {
                _context.Update(usuario);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Usuarios.Any(e => e.Usuario_id == usuario.Usuario_id)) return NotFound();
                throw;
            }

            return Ok(usuario);
        }

        return BadRequest(ModelState);
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
        return Ok("Deletado");
    }

    [HttpGet("details/{id}")]
    public async Task<IActionResult> Details(int id)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(m => m.Usuario_id == id);
        if (usuario == null) return NotFound();
        return Ok(usuario);
    }
}
