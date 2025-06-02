namespace Application.DTO
{
    public class ResultResponseDTO
    {
        public bool Success { get; set; }
        public Dictionary<string, List<string>>? Errors { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
