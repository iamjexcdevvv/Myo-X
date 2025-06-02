using Application.DTO;
using FluentValidation;

namespace Application.Validators
{
    public class LoginDTOValidator : AbstractValidator<LoginDTO>
    {
        public LoginDTOValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username field is required");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password field is required");
        }
    }
}
