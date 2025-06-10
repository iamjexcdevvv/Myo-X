using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using MyoX.Application.DTO;
using MyoX.Application.Result;
using MyoX.Application.Services;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.Authentication
{
    public sealed class RegisterCommandHandler : ICommandHandler<RegisterCommand>
    {
        private readonly IValidator<RegisterDTO> _validator;
        private readonly IUserRepository _userRepo;
        public RegisterCommandHandler(IValidator<RegisterDTO> validator, IUserRepository userRepo)
        {
            _validator = validator;
            _userRepo = userRepo;
        }

        public async Task<ResultResponse> Handle(RegisterCommand command, CancellationToken cancellationToken)
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

            if (await _userRepo.IsUserAlreadyExistAsync(command.request.Username))
            {
                var errors = new Dictionary<string, List<string>>
                {
                    ["Username"] = new List<string> { "Username is already taken" }
                };
                return ResultResponse.Failure(new ErrorResponse(errors));
            }

            await _userRepo.RegisterUserAsync(new UserEntity
            {
                Username = command.request.Username,
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(command.request.Password)
            });

            return ResultResponse.Success();
        }
    }
}
