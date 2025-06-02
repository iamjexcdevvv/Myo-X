using Application.DTO;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Auth
{
    public record RefreshTokenCommand(HttpContext HttpContext) : ICommand<ResultResponseDTO>;
}
