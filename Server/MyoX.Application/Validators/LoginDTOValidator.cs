using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using MyoX.Application.DTO;

namespace MyoX.Application.Validators
{
    public class LoginDTOValidator : AbstractValidator<LoginDTO>
    {
        public LoginDTOValidator()
        {
            RuleFor(o => o.Username)
                .NotEmpty().WithMessage("Username should not be empty");

            RuleFor(o => o.Password)
                    .NotEmpty().WithMessage("Password should not be empty");
        }
    }
}
