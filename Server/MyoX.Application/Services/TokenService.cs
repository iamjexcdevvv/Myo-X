using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateAccessToken(UserEntity user)
        {
            string secretKey = _config["jwt:key"] ?? throw new Exception("'key' does not found in configuration");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity([
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Name, user.Username)
                ]),
                SigningCredentials = signingCredentials,
                Issuer = _config["jwt:issuer"],
                Audience = _config["jwt:audience"],
                Expires = DateTime.UtcNow.AddMinutes(10)
            };

            var tokenHandler = new JsonWebTokenHandler();

            string accessToken = tokenHandler.CreateToken(tokenDescriptor);

            return accessToken;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
