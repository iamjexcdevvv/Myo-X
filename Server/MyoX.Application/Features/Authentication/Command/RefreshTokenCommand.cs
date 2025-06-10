using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.Authentication
{
    public record RefreshTokenCommand(string refreshToken) : ICommand;
}
