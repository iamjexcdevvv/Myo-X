using MyoX.Domain.Entities;

namespace MyoX.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task RegisterUserAsync(UserEntity newUser);
        Task<bool> IsUserAlreadyExistAsync(string username);
        Task<UserEntity?> GetUserByUsernameAsync(string username);
        Task SaveUserRefreshToken(UserEntity user, string refreshToken);
        Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken);
    }
}
