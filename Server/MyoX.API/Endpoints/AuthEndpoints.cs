using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using MyoX.Application.DTO;
using MyoX.Application.Features.Authentication;
using MyoX.Application.Result;
using MyoX.Application.Services;

namespace MyoX.API.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
        {
            var authGroup = app.MapGroup("/api/auth");

            authGroup.MapGet("/check", () =>
            {
                return Results.Ok();
            }).RequireAuthorization();

            authGroup.MapPost("/register", async (
                [FromBody] RegisterDTO request,
                IMapper mapper,
                ICommandHandler <RegisterCommand> handler) =>
            {
                ResultResponse result = await handler.Handle(new RegisterCommand(request));
                ResultResponseDTO resultDTO = mapper.Map<ResultResponseDTO>(result);

                if (!result.IsSuccess)
                {
                    return Results.BadRequest(resultDTO);
                }

                return Results.Ok(resultDTO);
            });

            authGroup.MapPost("/login", async (
                [FromBody] LoginDTO request,
                ICommandHandler<LoginCommand> handler,
                IConfiguration config,
                IMapper mapper,
                HttpContext context
                ) =>
            {
                ResultResponse result = await handler.Handle(new LoginCommand(request));

                ResultResponseDTO resultDTO = mapper.Map<ResultResponseDTO>(result);

                if (!result.IsSuccess)
                {
                    return Results.BadRequest(resultDTO);
                }

                string accessKey = config["jwt:access-token"] ?? throw new Exception("No 'access-token' key found on your configuration");
                string refreshKey = config["jwt:refresh-token"] ?? throw new Exception("No 'refresh-token' key found on your configuration");

                context.Response.Cookies.Append(accessKey, result.AccessToken!, new CookieOptions
                {
                    Secure = true,
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(10)
                });

                context.Response.Cookies.Append(refreshKey, result.RefreshToken!, new CookieOptions
                {
                    Secure = true,
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

                return Results.Ok(resultDTO);
            });

            authGroup.MapPost("/token/refresh", async (
                HttpContext context, 
                ICommandHandler<RefreshTokenCommand> handler,
                IConfiguration config) =>
            {
                string accessKey = config["jwt:access-token"] ?? throw new Exception("No 'access-token' key found on your configuration");
                string refreshKey = config["jwt:refresh-token"] ?? throw new Exception("No 'refresh-token' key found on your configuration");

                string? refreshToken = context.Request.Cookies[refreshKey];

                if (refreshToken is null)
                {
                    return Results.Unauthorized();
                }

                ResultResponse result = await handler.Handle(new RefreshTokenCommand(refreshToken));

                if (!result.IsSuccess)
                {
                    return Results.Unauthorized();
                }

                context.Response.Cookies.Append(accessKey, result.AccessToken!, new CookieOptions
                {
                    Secure = true,
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(10)
                });

                context.Response.Cookies.Append(refreshKey, result.RefreshToken!, new CookieOptions
                {
                    Secure = true,
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });

                return Results.Ok();
            });

            authGroup.MapPost("/logout", (HttpContext context, IConfiguration config) =>
            {
                context.Response.Cookies.Delete(config["jwt:access-token"] ?? throw new Exception("'access-token' key not found in your app configuration"));
                context.Response.Cookies.Delete(config["jwt:refresh-token"] ?? throw new Exception("'refresh-token' key not found in your app configuration"));
            }).RequireAuthorization();
        }
    }
}
