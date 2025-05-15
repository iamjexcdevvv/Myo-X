using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Result;
using Application.Result.Common;
using Domain.Service;
using Mediator;

namespace Application.Features.Command
{
    public class RefreshTokenCommandHandler : ICommandHandler<RefreshTokenCommand, AuthResult>
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        public RefreshTokenCommandHandler(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }
        public async ValueTask<AuthResult> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            var refreshToken = command.HttpContext.Request.Cookies["Myo-X-Refresh-Token"];
            
            if (refreshToken == null)
            {
                return new AuthResult
                {
                    Success = false,
                };
            }

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow)
            {
                return new AuthResult
                {
                    Success = false,
                };
            }

            string accessToken = _tokenService.GenerateJWTAccessToken(user);

            return new AuthResult
            {
                Success = true,
                AccessToken = accessToken
            };
        }
    }
}
