using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyoX.Application.DTO
{
    public record WorkoutSessionEntityDTO
    {
        public int Id { get; init; }
        public DateTimeOffset? WorkoutSessionDate { get; init; }

        public List<WorkoutSessionExerciseEntityDTO
            > Exercises
        { get; init; } = new List<WorkoutSessionExerciseEntityDTO>();
    }
}
