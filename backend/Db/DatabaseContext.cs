using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Db;

public class DatabaseContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Day> Days { get; set; }

    public DatabaseContext(DbContextOptions options) : base(options)
    { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=lifetracker;Username=postgres;Password=123");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasMany(x => x.Days).WithOne(x => x.User);
    }
}