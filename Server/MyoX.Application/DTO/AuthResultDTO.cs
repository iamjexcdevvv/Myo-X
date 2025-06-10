namespace MyoX.Application.DTO
{
    public record AuthResultDTO
    {
        public string? AccessToken { get; init; }
        public string? RefreshToken { get; init; }
    }
}
