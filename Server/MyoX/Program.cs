using Infrastructure;
using Application;
using Scalar.AspNetCore;
using MyoX.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCorsMiddleware(builder.Configuration);

builder.Services.AddAuthenticationMiddleware(builder.Configuration);

builder.Services.AddMemoryCache();

builder.Services.AddAuthorization();

builder.Services.AddControllersMiddleware(builder.Configuration);
    
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
