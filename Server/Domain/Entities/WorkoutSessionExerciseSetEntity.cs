namespace Domain.Entities
{
    public class WorkoutSessionExerciseSetEntity
    {
        public int Id { get; set; }
        public int Set { get; set; }
        public int Reps { get; set; }
        public int Load { get; set; }
        public int RIR { get; set; }

        public int WorkoutSessionExerciseId { get; set; }
        public WorkoutSessionExerciseEntity? WorkoutSessionExercise { get; set; }
    }
}
