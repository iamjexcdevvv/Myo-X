using System.Text.Json.Serialization;
using System.Text.Json;

namespace MyoX.Middlewares
{
    public static class ControllersMiddleware
    {
        public static IServiceCollection AddControllersMiddleware(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers()
                    .AddJsonOptions(options =>
                    {
                        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    });

            return services;
        }
    }
}
