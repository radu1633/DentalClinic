namespace api.DataLayer;
using api.DataLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;


public class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Service> Services { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Doctor> Doctors { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Service>(s => s.HasKey(p => new { p.category_id}));
        modelBuilder.Entity<Service>()
            .HasOne(s => s.category)
            .WithMany(c => c.services)
            .HasForeignKey(s => s.category_id)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Service>().HasKey(s => s.service_id);

        modelBuilder.Entity<Appointment>(a => a.HasKey(p => new { p.ServiceId, p.UserId }));
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Service)
            .WithMany(s => s.appointments)
            .HasForeignKey(a => a.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.User)
            .WithMany(s => s.Appointments)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Appointment>().HasKey(a => a.appointment_id);

        modelBuilder.Entity<Category>().HasKey(c => c.category_id);

        modelBuilder.Entity<Doctor>(d => d.HasKey(p => new { p.UserId }));
        modelBuilder.Entity<Doctor>()
            .HasOne(d => d.User)
            .WithOne(u => u.Doctor)
            .HasForeignKey<Doctor>(d => d.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Doctor>().HasKey(d => d.DoctorId);


        List<IdentityRole> roles = new List<IdentityRole>
        {
            new IdentityRole
            {
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Name = "User",
                NormalizedName = "USER"
            }
        };
        modelBuilder.Entity<IdentityRole>().HasData(roles);

        modelBuilder.HasDefaultSchema("identity");
    }
}