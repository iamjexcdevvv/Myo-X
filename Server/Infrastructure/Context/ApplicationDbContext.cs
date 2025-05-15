using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context
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
