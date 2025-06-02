using Application.DTO;
using Domain.Interfaces;
using Mediator;

namespace Application.Features.Auth
{
    public class RefreshTokenCommandHandler : ICommandHandler<RefreshTokenCommand, ResultResponseDTO>
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        public RefreshTokenCommandHandler(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }
        public async ValueTask<ResultResponseDTO> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            var refreshToken = command.HttpContext.Request.Cookies["Myo-X-Refresh-Token"];
            
            if (refreshToken is null)
            {
                return new ResultResponseDTO
                {
                    Success = false,
                };
            }

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user is null || user.RefreshTokenExpiry <= DateTime.UtcNow)
            {
                return new ResultResponseDTO
                {
                    Success = false,
                };
            }

            string accessToken = _tokenService.GenerateJWTAccessToken(user);

            return new ResultResponseDTO
            {
                Success = true,
                AccessToken = accessToken
            };
        }
    }
}
