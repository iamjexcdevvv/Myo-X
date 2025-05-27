using Application.DTO;
using Application.Result.Common;
using Mediator;

namespace Application.Features.Auth
{
    public record RegisterUserCommand(RegisterDTO request) : ICommand<ResultResponse>;
}
