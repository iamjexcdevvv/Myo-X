using Domain.Entities;

namespace Domain.Service
{
    public interface ITokenService
    {
        string GenerateJWTAccessToken(UserEntity request);
        string GenerateRefreshToken();
    }
}
