using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Result;
using Application.Result.Common;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Command
{
    public record RefreshTokenCommand(HttpContext HttpContext) : ICommand<AuthResult>;
}
