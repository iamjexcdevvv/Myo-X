using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using MyoX.Application.DTO;

namespace MyoX.Application.Validators
{
    public class RegisterDTOValidator : AbstractValidator<RegisterDTO>
    {
        public RegisterDTOValidator()
        {
            RuleFor(o => o.Username)
                .NotEmpty().WithMessage("Username should not be empty");

            RuleFor(o => o.Password)
                .NotEmpty().WithMessage("Password should not be empty")
                .MinimumLength(8).WithMessage("Password should at least consist of 8 characters");

            RuleFor(o => o.ConfirmPassword)
                .NotEmpty().WithMessage("Confirm Password should not be empty")
                .Equal(o => o.Password).WithMessage("Confirm password and password should match");
        }
    }
}
