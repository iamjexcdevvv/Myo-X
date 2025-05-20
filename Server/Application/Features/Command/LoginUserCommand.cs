using Application.DTO;
using Application.Result;
using Mediator;

namespace Application.Features.Command
{
    public record LoginUserCommand(LoginDTO request) : ICommand<TokenResultResponse>;
}
