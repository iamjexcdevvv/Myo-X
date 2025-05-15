using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTO;
using Application.Result.Common;
using Mediator;

namespace Application.Features.Command
{
    public record RegisterUserCommand(RegisterDTO request) : ICommand<ApiResult>;
}
