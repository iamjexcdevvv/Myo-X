using Application.DTO;
using Mediator;

namespace Application.Features.Auth
{
    public record RegisterUserCommand(RegisterDTO request) : ICommand<ResultResponseDTO>;
}
