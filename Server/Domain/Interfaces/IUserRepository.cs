using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IUserRepository
    {
        Task RegisterUser(UserEntity user);
        Task<UserEntity?> GetUserByEmailAsync(string email);
        Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken);
        Task SaveUserDataChanges();
    }
}
