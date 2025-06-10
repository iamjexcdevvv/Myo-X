using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyoX.Domain.Interfaces;
using MyoX.Infrastructure.Context;
using MyoX.Infrastructure.Repository;

namespace MyoX.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services
            .AddDbContext<ApplicationDbContext>(options =>
            {
                string connectionString = config.GetConnectionString("DefaultConnection") ?? throw new Exception("'Default Connection' not found in ConnectionString");
                options.UseSqlServer(connectionString);
            })
            .AddScoped<IUserRepository, UserRepository>()
            .AddScoped<IWorkoutSessionLogRepository, WorkoutSessionLogRepository>();
            return services;
        }
    }
}
