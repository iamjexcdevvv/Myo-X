namespace Application.DTO
{
    public record WorkoutSessionEntityDTO
    {
        public int Id { get; set; }
        public DateTimeOffset WorkoutSessionDate { get; set; }

        public List<WorkoutSessionExerciseEntityDTO
            > Exercises
        { get; set; } = new List<WorkoutSessionExerciseEntityDTO>();
    }
}
