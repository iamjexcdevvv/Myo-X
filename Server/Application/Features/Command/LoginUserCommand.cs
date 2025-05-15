using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTO;
using Application.Result;
using Mediator;

namespace Application.Features.Command
{
    public record LoginUserCommand(LoginDTO request) : ICommand<AuthResult>;
}
