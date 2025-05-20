using Application.DTO;
using Application.Result.Common;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Command
{
    public record SaveWorkoutSessionLogCommand(WorkoutSessionEntityDTO request, HttpContext HttpContext) : ICommand<ResultResponse>;
}
