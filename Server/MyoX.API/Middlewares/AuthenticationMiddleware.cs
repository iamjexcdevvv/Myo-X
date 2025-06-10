using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace MyoX.API.Middlewares
{
    public static class AuthenticationMiddleware
    {
        public static IServiceCollection AddAuthenticationMiddleware(this IServiceCollection services, IConfiguration config)
        {
            services
            .AddAuthorization()
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["jwt:issuer"],
                    ValidAudience = config["jwt:audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["jwt:key"] ?? throw new Exception("No 'secret key' found on your configuration")))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        string accessKey = config["jwt:access-token"] ?? throw new Exception("'access-token' key not found on your app configuration");
                        if (context.Request.Cookies != null &&
                            context.Request.Cookies.TryGetValue(accessKey, out var token) &&
                            !string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            return services;
        }
    }
}
