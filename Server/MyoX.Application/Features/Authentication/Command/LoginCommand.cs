using Microsoft.AspNetCore.Http;
using MyoX.Application.DTO;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.Authentication
{
    public record LoginCommand(LoginDTO request) : ICommand;
}
