using Application.DTO;
using Domain.Entities;
using Domain.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using MapsterMapper;
using Mediator;

namespace Application.Features.Auth
{
    public class RegisterUserCommandHandler : ICommandHandler<RegisterUserCommand, ResultResponseDTO>
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        private readonly IValidator<RegisterDTO> _validator;
        public RegisterUserCommandHandler(IUserRepository userRepo, IMapper mapper, IValidator<RegisterDTO> validator)
        {
            _userRepo = userRepo;
            _mapper = mapper;
            _validator = validator;
        }
        public async ValueTask<ResultResponseDTO> Handle(RegisterUserCommand command, CancellationToken cancellationToken)
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

            var isUserFound = await _userRepo.GetUserByEmailAsync(command.request.Username);

            if (isUserFound is not null)
            {
                return new ResultResponseDTO
                {
                    Success = false,
                    Errors = new Dictionary<string, List<string>>
                    {
                        { "Username", new List<string> { "This username is already been taken" } }
                    }
                };
            }

            var newUser = _mapper.Map<UserEntity>(command.request);
            newUser.HashedPassword = BCrypt.Net.BCrypt.HashPassword(command.request.Password);

            await _userRepo.RegisterUser(newUser);

            return new ResultResponseDTO
            {
                Success = true
            };
        }
    }
}
