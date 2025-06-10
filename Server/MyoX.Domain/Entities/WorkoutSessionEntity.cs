using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyoX.Domain.Entities
{
    public class WorkoutSessionEntity
    {
        public int Id { get; set; }
        public DateTimeOffset WorkoutSessionDate { get; set; }

        public Guid UserId { get; set; }
        public UserEntity? User { get; set; }

        public List<WorkoutSessionExerciseEntity> Exercises { get; set; } = new();
    }
}
