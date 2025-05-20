namespace Domain.Entities
{
    public class WorkoutSessionEntity
    {
        public int Id { get; set; }
        public DateTimeOffset WorkoutSessionDate { get; set; }

        public Guid UserId { get; set; }
        public UserEntity? User { get; set; }

        public List<WorkoutSessionExerciseEntity> Exercises { get; set; } = new();
    }
}
