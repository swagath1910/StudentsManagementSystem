using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentsApi.Data;
using StudentsApi.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace StudentsApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly StudentDbContext _ctx;

        public StudentsController(StudentDbContext ctx)
        {
            _ctx = ctx;
            if (!_ctx.Students.Any())
            {
                _ctx.Students.AddRange(
                     new Student { Name = "Swagath", Class = 9, Section = "A" },
                     new Student { Name = "Ganesh", Class = 7, Section = "B" }
                );
                _ctx.SaveChanges();

            }
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _ctx.Students.ToListAsync();
            return Ok(students);
        }
        [HttpPost]
        public async Task<IActionResult> AddStudent(Student student)
        {
            _ctx.Students.Add(student);
            await _ctx.SaveChangesAsync();
            return Ok(student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudetn(int id, Student updated)
        {
            var existing = await _ctx.Students.FindAsync(id);
            if (existing is null) return NotFound();

            existing.Name = updated.Name;
            existing.Class = updated.Class;
            existing.Section = updated.Section;

            await _ctx.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _ctx.Students.FindAsync(id);
            if (student is null) return NotFound();

            _ctx.Students.Remove(student);
            await _ctx.SaveChangesAsync();
            return Ok();
        }

    }
}
