using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO
{
    public class WorkoutSessionExerciseEntityDTO
    {
        public string ExerciseId { get; set; } = string.Empty;
        public string ExerciseName { get; set; } = string.Empty;
        public int RepRangeStart { get; set; }
        public int RepRangeEnd { get; set; }
        public List<WorkoutSessionExerciseSetEntityDTO>? Sets { get; set; }
    }
}
