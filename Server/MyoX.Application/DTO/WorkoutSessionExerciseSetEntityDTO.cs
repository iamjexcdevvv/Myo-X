using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyoX.Application.DTO
{
    public record WorkoutSessionExerciseSetEntityDTO
    {
        public int Set { get; init; }
        public int Reps { get; init; }
        public int Load { get; init; }
        public int RIR { get; init; }
    }
}
