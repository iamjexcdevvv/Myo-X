using Mapster;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using Application.Validators;
using Domain.Service;
using Application.Service;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services
                .AddValidatorsFromAssemblyContaining<RegisterDTOValidator>()
                .AddMediator(options => options.ServiceLifetime = ServiceLifetime.Scoped)
                .AddTransient<ITokenService, TokenService>()
                .AddMapster();
            return services;
        }
    }
}
