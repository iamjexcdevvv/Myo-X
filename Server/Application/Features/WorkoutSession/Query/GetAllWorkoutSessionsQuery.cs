using Application.DTO;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.WorkoutSession.Query
{
    public record GetAllWorkoutSessionsQuery(HttpContext HttpContext) : IQuery<List<WorkoutSessionEntityDTO>>;
}
