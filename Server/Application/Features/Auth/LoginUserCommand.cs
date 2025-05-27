using Application.DTO;
using Application.Result;
using Application.Result.Common;
using Mediator;

namespace Application.Features.Auth
{
    public record LoginUserCommand(LoginDTO request) : ICommand<ResultResponse>;
}
