namespace Application.DTO
{
    public record WorkoutSessionExerciseSetEntityDTO
    {
        public int Set { get; init; }
        public int Reps { get; init; }
        public int Load { get; init; }
        public int RIR { get; init; }
    }
}
