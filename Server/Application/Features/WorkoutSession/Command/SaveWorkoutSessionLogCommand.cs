using Application.DTO;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.WorkoutSession.Command
{
    public record SaveWorkoutSessionLogCommand(WorkoutSessionEntityDTO request, HttpContext HttpContext) : ICommand<ResultResponseDTO>;
}
