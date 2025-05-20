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
