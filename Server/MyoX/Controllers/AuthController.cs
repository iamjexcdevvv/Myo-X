using Application.DTO;
using Application.Features.Command;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace MyoX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginDTO request)
        {
            var result = await _mediator.Send(new LoginUserCommand(request));

            if (!result.Success)
            {
                return BadRequest(new { result.Success, result.Errors });
            }

            Response.Cookies.Append("Myo-X-Access-Token", result.AccessToken!, new CookieOptions()
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(10)
            });

            Response.Cookies.Append("Myo-X-Refresh-Token", result.RefreshToken!, new CookieOptions()
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { result.Success, result.AccessToken });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDTO request)
        {
            var result = await _mediator.Send(new RegisterUserCommand(request));

            if (!result.Success)
            {
                return BadRequest(new
                {
                    result.Success,
                    result.Errors
                });
            }

            return Ok(new
            {
                result.Success
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult LogoutUser()
        {
            Response.Cookies.Delete("Myo-X-Access-Token");
            Response.Cookies.Delete("Myo-X-Refresh-Token");
            return Ok();
        }

        [Authorize]
        [HttpGet("check")]
        public IActionResult AuthenticateUser()
        {
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshUserToken()
        {
            var result = await _mediator.Send(new RefreshTokenCommand(HttpContext));

            if (!result.Success)
            {
                return Unauthorized("Invalid refresh token");
            }

            Response.Cookies.Append("Myo-X-Access-Token", result.AccessToken!, new CookieOptions()
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(10)
            });

            return Ok();
        }
    }
}
