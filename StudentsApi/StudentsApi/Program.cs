using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudentsApi.Data;
using StudentsApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddDbContext<StudentDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<StudentDbContext>()
    .AddDefaultTokenProviders();


builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});


var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]);


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        p => p.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();


app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.MapFallbackToFile("index.html");

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var ctx = scope.ServiceProvider.GetRequiredService<StudentDbContext>();


    if (!ctx.Students.Any())
    {
        ctx.Students.AddRange(
             new Student { Name = "Swagath", Class = 9, Section = "A" },
             new Student { Name = "Ganesh", Class = 7, Section = "B" }
        );
        ctx.SaveChanges();
    }
}

app.Run();