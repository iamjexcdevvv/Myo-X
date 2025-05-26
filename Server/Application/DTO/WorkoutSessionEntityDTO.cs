namespace Application.DTO
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
