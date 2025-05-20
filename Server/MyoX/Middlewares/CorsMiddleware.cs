namespace MyoX.Middlewares
{
    public static class CorsMiddleware
    {
        public static IServiceCollection AddCorsMiddleware(this IServiceCollection services, IConfiguration configuration)
        {
            var allowedOrigins = configuration.GetSection("AllowedCorsOrigins").Get<string[]>() ?? throw new Exception("Allowed origins not found");

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                    .WithMethods("POST", "GET")
                    .WithHeaders("Authorization", "Content-Type")
                    .AllowCredentials();
                });
            });

            return services;
        }
    }
}
