using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class WorkoutSessionLogRepository : IWorkoutSessionLogRepository
    {
        private readonly ApplicationDbContext _dbContext;
        public WorkoutSessionLogRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<WorkoutSessionEntity>> GetAllWorkoutSessionsByUserAsync(UserEntity user)
        {
            return await _dbContext.WorkoutSessions
                .AsNoTracking()
                .Where(s => s.UserId == user.Id)
                .Select(s => new WorkoutSessionEntity
                {
                    Id = s.Id,
                    WorkoutSessionDate = s.WorkoutSessionDate,
                    Exercises = s.Exercises.Select(e => new WorkoutSessionExerciseEntity
                    {
                        ExerciseId = e.ExerciseId,
                        ExerciseName = e.ExerciseName,
                        RepRangeStart = e.RepRangeStart,
                        RepRangeEnd = e.RepRangeEnd,
                        Sets = e.Sets.Select(set => new WorkoutSessionExerciseSetEntity
                        {
                            Set = set.Set,
                            Reps = set.Reps,
                            Load = set.Load,
                            RIR = set.RIR
                        }).ToList()
                    }).ToList()
                })
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task SaveWorkoutSessionLogAsync(WorkoutSessionEntity workoutSessionLog)
        {
            await _dbContext.WorkoutSessions.AddAsync(workoutSessionLog);
            await _dbContext.SaveChangesAsync();
        }
    }
}
