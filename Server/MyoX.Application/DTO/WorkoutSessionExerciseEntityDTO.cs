using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyoX.Application.DTO
{
    public record WorkoutSessionExerciseEntityDTO
    {
        public string ExerciseId { get; init; } = string.Empty;
        public string ExerciseName { get; init; } = string.Empty;
        public int RepRangeStart { get; init; }
        public int RepRangeEnd { get; init; }
        public List<WorkoutSessionExerciseSetEntityDTO> Sets { get; init; } = new List<WorkoutSessionExerciseSetEntityDTO>();
    }
}
