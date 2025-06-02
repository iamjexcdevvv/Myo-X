using Application.DTO;
using Mediator;

namespace Application.Features.Auth
{
    public record LoginUserCommand(LoginDTO request) : ICommand<ResultResponseDTO>;
}
