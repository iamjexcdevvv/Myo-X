using Domain.Entities;

namespace Domain.Interfaces
{
    public interface ITokenService
    {
        string GenerateJWTAccessToken(UserEntity request);
        string GenerateRefreshToken();
    }
}
