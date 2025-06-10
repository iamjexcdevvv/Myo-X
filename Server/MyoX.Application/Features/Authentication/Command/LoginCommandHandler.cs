using FluentValidation;
using FluentValidation.Results;
using MyoX.Application.DTO;
using MyoX.Application.Result;
using MyoX.Application.Services;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.Authentication
{
    public sealed class LoginCommandHandler : ICommandHandler<LoginCommand>
    {
        private readonly IValidator<LoginDTO> _validator;
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        public LoginCommandHandler(IValidator<LoginDTO> validator, IUserRepository userRepo, ITokenService tokenService)
        {
            _validator = validator;
            _userRepo = userRepo;
            _tokenService = tokenService;
        }
        public async Task<ResultResponse> Handle(LoginCommand command, CancellationToken cancellationToken)
        {
            ValidationResult validationResult = await _validator.ValidateAsync(command.request);

            if (!validationResult.IsValid)
            {
                var failures = validationResult.Errors
                    .GroupBy(x => x.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(x => x.ErrorMessage)
                    .ToList());

                return ResultResponse.Failure(new ErrorResponse(failures));
            }

            UserEntity? user = await _userRepo.GetUserByUsernameAsync(command.request.Username);

            var errors = new Dictionary<string, List<string>>();

            if (user is null)
            {
                errors.Add("Username", new List<string> { "Invalid username" });
                errors.Add("Password", new List<string> { "Invalid password" });

                return ResultResponse.Failure(new ErrorResponse(errors));
            }

            if (!BCrypt.Net.BCrypt.Verify(command.request.Password, user.HashedPassword))
            {
                errors.Add("Password", new List<string> { "Invalid password" });
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
