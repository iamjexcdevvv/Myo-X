using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _dbContext;
        public UserRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<UserEntity?> GetUserByEmailAsync(string email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(user => user.Username.ToLower() == email.ToLower());
        }

        public async Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.RefreshToken == refreshToken);
        }

        public async Task RegisterUser(UserEntity user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task SaveUserDataChanges()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
