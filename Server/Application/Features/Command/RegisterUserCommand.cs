using Application.DTO;
using Application.Result.Common;
using Mediator;

namespace Application.Features.Command
{
    public record RegisterUserCommand(RegisterDTO request) : ICommand<ResultResponse>;
}
