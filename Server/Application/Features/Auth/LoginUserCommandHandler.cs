using Application.DTO;
using Domain.Entities;
using Domain.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using MapsterMapper;
using Mediator;

namespace Application.Features.Auth
{
    public class LoginUserCommandHandler : ICommandHandler<LoginUserCommand, ResultResponseDTO>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IValidator<LoginDTO> _validator;
        private readonly ITokenService _tokenService;
        public LoginUserCommandHandler(IUserRepository userRepository, IMapper mapper, IValidator<LoginDTO> validator, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _validator = validator;
            _tokenService = tokenService;
        }
        public async ValueTask<ResultResponseDTO> Handle(LoginUserCommand command, CancellationToken cancellationToken)
        {
            ValidationResult result = await _validator.ValidateAsync(command.request);

            if (!result.IsValid)
            {
                var failures = result.Errors
                    .GroupBy(x => x.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(x => x.ErrorMessage)
                    .ToList());

                return new ResultResponseDTO
                {
                    Success = false,
                    Errors = failures
                };
            }

            var user = await _userRepository.GetUserByEmailAsync(command.request.Username);

            if (user is null)
            {
                return new ResultResponseDTO
                {
                    Success = false,
                    Errors = new Dictionary<string, List<string>>
                    {
                        { "Username", new List<string> { "Invalid username" } },
                        { "Password", new List<string> { "Invalid password" } }
                    }
                };
            }

            if (!BCrypt.Net.BCrypt.Verify(command.request.Password, user.HashedPassword))
            {
                return new ResultResponseDTO
                {
                    Success = false,
                    Errors = new Dictionary<string, List<string>>
                    {
                        { "Password", new List<string> { "Invalid password" } }
                    }
                };
            }

            string accessToken = _tokenService.GenerateJWTAccessToken(_mapper.Map<UserEntity>(command.request));
            string refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userRepository.SaveUserDataChanges();

            return new ResultResponseDTO
            {
                Success = true,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }
    }
}
