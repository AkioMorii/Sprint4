using System.ComponentModel.DataAnnotations.Schema;

namespace AgendaContatos.Models
{
    public class Usuarios
    {
        public int Usuario_id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public bool Status    { get; set; }
        public string? Senha { get; set; }
        public string? Telefone { get; set; }
        public string Login { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? DataCadastro { get; set; }
        public DateTime? DataRedefinirSenha { get; set; }
        public Guid? RedefinirSenha_id { get; set; }
        public string? TokenAcesso { get; set; }
    }
}
