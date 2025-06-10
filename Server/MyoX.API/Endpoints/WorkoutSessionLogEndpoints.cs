using Microsoft.AspNetCore.Mvc;
using MyoX.Application.DTO;
using MyoX.Application.Features.WorkoutSessionLog.Command;
using MyoX.Application.Features.WorkoutSessionLog.Query;
using MyoX.Application.Result;
using MyoX.Application.Services;
using MyoX.Application.Services.CQRS;
using MyoX.Domain.Entities;

namespace MyoX.API.Endpoints
{
    public static class WorkoutSessionLogEndpoints
    {
        public static void MapWorkoutSessionLogEndpoints(this IEndpointRouteBuilder app)
        {
            var workoutSessionLogGroup = app.MapGroup("/api/workout-session-logs");

            workoutSessionLogGroup.MapPost("/", async (
                [FromBody] WorkoutSessionEntityDTO request, 
                HttpContext context,
                IConfiguration config,
                ICommandHandler<SaveWorkoutSessionLogCommand> handler) =>
            {
                string refreshKey = config["jwt:refresh-token"] ?? throw new Exception("'refresh-token' key not found in configuration");
                string? refreshToken = context.Request.Cookies[refreshKey];

                if (refreshToken is null)
                {
                    return Results.BadRequest();
                }

                ResultResponse result = await handler.Handle(new SaveWorkoutSessionLogCommand(request, refreshToken));

                if (!result.IsSuccess)
                {
                    return Results.BadRequest();
                }

                return Results.Ok();
            }).RequireAuthorization();

            workoutSessionLogGroup.MapGet("/", async (
                HttpContext context, 
                IConfiguration config, 
                IQueryHandler<GetAllUserWorkoutSessionLogQuery, 
                List<WorkoutSessionEntityDTO>> handler) =>
            {
                string refreshKey = config["jwt:refresh-token"] ?? throw new Exception("'refresh-token' key not found in configuration");
                string? refreshToken = context.Request.Cookies[refreshKey];

                if (refreshToken is null)
                {
                    return Results.BadRequest();
                }

                ResultResponse result = await handler.Handle(new GetAllUserWorkoutSessionLogQuery(refreshToken));

                if (!result.IsSuccess)
                {
                    return Results.BadRequest();
                }

                return Results.Ok(result);
            }).RequireAuthorization();
        }
    }
}
