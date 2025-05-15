using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.DTO
{
    public class WorkoutSessionEntityDTO
    {
        public int Id { get; set; }
        public DateTimeOffset WorkoutSessionDate { get; set; }

        public List<WorkoutSessionExerciseEntityDTO
            >? Exercises { get; set; }
    }
}
