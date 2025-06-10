using MyoX.Application.DTO;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.WorkoutSessionLog.Query
{
    public record GetAllUserWorkoutSessionLogQuery(string refreshToken) : IQuery<List<WorkoutSessionEntityDTO>>;
}
