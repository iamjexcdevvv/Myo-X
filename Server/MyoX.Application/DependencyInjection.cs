using FluentValidation;
using Mapster;
using Microsoft.Extensions.DependencyInjection;
using MyoX.Application.Services;
using MyoX.Application.Services.CQRS;
using MyoX.Application.Validators;
using MyoX.Domain.Interfaces;

namespace MyoX.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddSingleton<ITokenService, TokenService>();

            services
                .AddValidatorsFromAssemblyContaining<RegisterDTOValidator>()
                .AddMapster();

            services.Scan(scan => scan.FromAssembliesOf(typeof(DependencyInjection))
                    .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)), publicOnly: false)
                        .AsImplementedInterfaces()
                        .WithScopedLifetime()
                    .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>)), publicOnly: false)
                        .AsImplementedInterfaces()
                        .WithScopedLifetime()
                    .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>)), publicOnly: false)
                        .AsImplementedInterfaces()
                        .WithScopedLifetime());
            return services;
        }
    }
}
