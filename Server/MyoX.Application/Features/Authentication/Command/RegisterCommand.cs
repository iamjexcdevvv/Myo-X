using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyoX.Application.DTO;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.Authentication
{
    public record RegisterCommand(RegisterDTO request) : ICommand;
}
