namespace Application.DTO
{
    public record WorkoutSessionExerciseEntityDTO
    {
        public string ExerciseId { get; set; } = string.Empty;
        public string ExerciseName { get; set; } = string.Empty;
        public int RepRangeStart { get; set; }
        public int RepRangeEnd { get; set; }
        public List<WorkoutSessionExerciseSetEntityDTO> Sets { get; set; } = new List<WorkoutSessionExerciseSetEntityDTO>();
    }
}
