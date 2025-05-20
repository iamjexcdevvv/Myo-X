using Application.Result;
using Domain.Service;
using Mediator;

namespace Application.Features.Command
{
    public class RefreshTokenCommandHandler : ICommandHandler<RefreshTokenCommand, TokenResultResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        public RefreshTokenCommandHandler(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }
        public async ValueTask<TokenResultResponse> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            var refreshToken = command.HttpContext.Request.Cookies["Myo-X-Refresh-Token"];
            
            if (refreshToken == null)
            {
                return new TokenResultResponse
                {
                    Success = false,
                };
            }

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow)
            {
                return new TokenResultResponse
                {
                    Success = false,
                };
            }

            string accessToken = _tokenService.GenerateJWTAccessToken(user);

            return new TokenResultResponse
            {
                Success = true,
                AccessToken = accessToken
            };
        }
    }
}
