using Domain.Interfaces;
using Infrastructure.Context;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddScoped<IUserRepository, UserRepository>()
                .AddScoped<IWorkoutSessionLogRepository, WorkoutSessionLogRepository>()
                .AddDbContext<ApplicationDbContext>(options =>
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new Exception("Connection string not found");
                options.UseSqlServer(connectionString);
            });
            return services;
        }
    }
}
