using AgendaContatos.Models;
using Microsoft.EntityFrameworkCore;

namespace AgendaContatos.Conexao
{
    public class DataBaseConexao : DbContext
    {
        public DataBaseConexao(DbContextOptions<DataBaseConexao> options) : base(options) { }

        public DbSet<Contatos> Contatos { get; set; }
        public DbSet<Usuarios> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Contatos>().ToTable("contatos");
            modelBuilder.Entity<Usuarios>().ToTable("usuarios");
            modelBuilder.Entity<Usuarios>().HasKey(u => u.Usuario_id);
            modelBuilder.Entity<Usuarios>()
                .Property(u => u.DataCadastro)
                .ValueGeneratedOnAdd() 
                .Metadata.SetAfterSaveBehavior(
                    Microsoft.EntityFrameworkCore.Metadata.PropertySaveBehavior.Ignore
            );
        }
    }
}
