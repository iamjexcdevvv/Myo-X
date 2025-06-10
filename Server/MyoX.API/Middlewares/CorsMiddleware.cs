namespace MyoX.API.Middlewares
{
    public static class CorsMiddleware
    {
        public static IServiceCollection AddCorsMiddleware(this IServiceCollection services, IConfiguration config, string policyName)
        {
            services.AddCors(options =>
            {
                string[] allowedOrigin = config.GetSection("cors:AllowedCorsOrigins").Get<string[]>() ?? throw new Exception("'cors:AllowedCorsOrigins' does not found in your app configuration");

                options.AddPolicy(policyName, policy =>
                {
                    policy
                    .WithOrigins(allowedOrigin)
                    .AllowCredentials()
                    .WithMethods("POST", "GET")
                    .WithHeaders("Content-Type");
                });
            });
            return services;
        }
    }
}
