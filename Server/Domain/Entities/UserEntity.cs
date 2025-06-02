namespace Domain.Entities
{
    public class UserEntity
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string HashedPassword { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        public List<WorkoutSessionEntity>? WorkoutSessionsLog { get; set; }
    }
}
