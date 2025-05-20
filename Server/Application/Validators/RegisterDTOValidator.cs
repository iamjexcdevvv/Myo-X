using Application.DTO;
using FluentValidation;

namespace Application.Validators
{
    public class RegisterDTOValidator : AbstractValidator<RegisterDTO>
    {
        public RegisterDTOValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email field is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password field is required")
                .MinimumLength(8).WithMessage("Password requires at least 8 characters long");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Confirm Password field is required")
                .Equal(user => user.Password).WithMessage("Password and Confirm Password dont match");
        }
    }
}
