namespace Application.Result.Common
{
    public class ResultResponse
    {
        public bool Success { get; set; }
        public Dictionary<string, List<string>>? Errors { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
