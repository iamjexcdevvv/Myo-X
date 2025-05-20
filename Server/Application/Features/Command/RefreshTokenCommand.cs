using Application.Result;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Command
{
    public record RefreshTokenCommand(HttpContext HttpContext) : ICommand<TokenResultResponse>;
}
