using Microsoft.EntityFrameworkCore;
using MyoX.Domain.Entities;

namespace MyoX.Infrastructure.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<WorkoutSessionEntity> WorkoutSessions { get; set; }
        public DbSet<WorkoutSessionExerciseEntity> WorkoutExercises { get; set; }
        public DbSet<WorkoutSessionExerciseSetEntity> ExerciseSets { get; set; }
    }
}
