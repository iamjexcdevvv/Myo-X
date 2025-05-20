using Domain.Entities;

namespace Domain.Service
{
    public interface IWorkoutSessionLogRepository
    {
        Task SaveWorkoutSessionLogAsync(WorkoutSessionEntity workoutSessionLog);
        Task<List<WorkoutSessionEntity>> GetAllWorkoutSessionsByUserAsync(UserEntity user);
    }
}
