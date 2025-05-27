using Application.DTO;
using Application.Result.Common;
using Domain.Entities;
using Domain.Service;
using FluentValidation;
using FluentValidation.Results;
using MapsterMapper;
using Mediator;

namespace Application.Features.Auth
{
    public class RegisterUserCommandHandler : ICommandHandler<RegisterUserCommand, ResultResponse>
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
        public async ValueTask<ResultResponse> Handle(RegisterUserCommand command, CancellationToken cancellationToken)
        {
            ValidationResult result = await _validator.ValidateAsync(command.request);

            if (!result.IsValid)
            {
                var failures = result.Errors
                    .GroupBy(x => x.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(x => x.ErrorMessage)
                    .ToList());

                return new ResultResponse
                {
                    Success = false,
                    Errors = failures
                };
            }

            var isUserFound = await _userRepo.GetUserByEmailAsync(command.request.Email);

            if (isUserFound is not null)
            {
                return new ResultResponse
                {
                    Success = false,
                    Errors = new Dictionary<string, List<string>>
                    {
                        { "Email", new List<string> { "This email is already been taken" } }
                    }
                };
            }

            var newUser = _mapper.Map<UserEntity>(command.request);
            newUser.HashedPassword = BCrypt.Net.BCrypt.HashPassword(command.request.Password);

            await _userRepo.RegisterUser(newUser);

            return new ResultResponse
            {
                Success = true
            };
        }
    }
}
