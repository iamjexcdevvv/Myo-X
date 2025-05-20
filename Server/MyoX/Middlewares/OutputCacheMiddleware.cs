namespace MyoX.Middlewares
{
    public static class OutputCacheMiddleware
    {
        public static IServiceCollection AddOutputCacheMiddleware(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOutputCache(options =>
            {
                options.AddPolicy("UserWorkoutSessions", builder =>
                {
                    builder
                    .Expire(TimeSpan.FromMinutes(5))
                    .SetVaryByHeader("Authorization")
                    .Tag("workout-sessions-cache");
                });
            });

            return services;
        }
    }
}
