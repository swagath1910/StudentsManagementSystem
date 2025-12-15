using StudentsApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace StudentsApi.Data
{
    public class StudentDbContext : IdentityDbContext<ApplicationUser>
    {
        public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options)
        {
        }
        public DbSet<Student> Students { get; set; }
    }
}
