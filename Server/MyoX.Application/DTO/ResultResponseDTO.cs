using MyoX.Application.Result;

namespace MyoX.Application.DTO
{
    public record ResultResponseDTO
    {
        public bool IsSuccess { get; init; }
        public ErrorResponse Errors { get; init; } = new();
        public string? AccessToken { get; init; }
    }
}
