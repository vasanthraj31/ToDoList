var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Allow React frontend (running on port 5173) to talk to this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger (for testing the API in browser)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();

app.Run();
