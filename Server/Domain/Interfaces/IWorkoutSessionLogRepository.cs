using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IWorkoutSessionLogRepository
    {
        Task SaveWorkoutSessionLogAsync(WorkoutSessionEntity workoutSessionLog);
        Task<List<WorkoutSessionEntity>> GetAllWorkoutSessionsByUserAsync(UserEntity user);
    }
}
