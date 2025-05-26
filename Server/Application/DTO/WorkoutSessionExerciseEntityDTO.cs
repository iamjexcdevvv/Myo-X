namespace Application.DTO
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
