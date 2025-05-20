namespace Domain.Entities
{
    public class WorkoutSessionExerciseEntity
    {
        public int Id { get; set; }
        public string ExerciseId { get; set; } = string.Empty;
        public string ExerciseName { get; set; } = string.Empty;
        public int RepRangeStart { get; set; }
        public int RepRangeEnd { get; set; }

        public int WorkoutSessionId { get; set; }
        public WorkoutSessionEntity? WorkoutSession { get; set; }

        public List<WorkoutSessionExerciseSetEntity> Sets { get; set; } = new();
    }
}
