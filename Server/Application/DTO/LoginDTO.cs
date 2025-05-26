namespace Application.DTO
{
    public record LoginDTO
    {
        public string Email { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
    }
}
