using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO
{
    public class WorkoutSessionExerciseSetEntityDTO
    {
        public int Set { get; set; }
        public int Reps { get; set; }
        public int Load { get; set; }
        public int RIR { get; set; }
    }
}
