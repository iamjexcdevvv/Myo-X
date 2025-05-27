using Application.Result.Common;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Auth
{
    public record RefreshTokenCommand(HttpContext HttpContext) : ICommand<ResultResponse>;
}
