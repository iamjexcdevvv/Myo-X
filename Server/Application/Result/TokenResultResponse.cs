using Application.Result.Common;

namespace Application.Result
{
    public class TokenResultResponse : ResultResponse
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
