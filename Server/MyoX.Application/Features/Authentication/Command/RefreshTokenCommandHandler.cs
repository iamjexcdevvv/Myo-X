using MyoX.Application.DTO;
using MyoX.Application.Result;
using MyoX.Application.Services;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.Authentication
{
    public class RefreshTokenCommandHandler : ICommandHandler<RefreshTokenCommand>
    {
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        public RefreshTokenCommandHandler(IUserRepository userRepo, ITokenService tokenService)
        {
            _userRepo = userRepo;
            _tokenService = tokenService;
        }
        public async Task<ResultResponse> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            UserEntity? user = await _userRepo.GetUserByRefreshTokenAsync(command.refreshToken);

            var errors = new Dictionary<string, List<string>>();

            if (user is null)
            {
                errors.Add("User", new List<string> { "User not found" });
                return ResultResponse.Failure(new ErrorResponse(errors));
            }

            if (DateTime.UtcNow >= user.RefreshTokenExpiry)
            {
                errors.Add("RefreshToken", new List<string> { "Invalid refresh token" });
                return ResultResponse.Failure(new ErrorResponse(errors));
            }

            string accessToken = _tokenService.GenerateAccessToken(user);
            string refreshToken = _tokenService.GenerateRefreshToken();

            await _userRepo.SaveUserRefreshToken(user, refreshToken);

            return ResultResponse.Success(new AuthResultDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });
        }
    }
}
