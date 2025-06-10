using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;
using MyoX.Infrastructure.Context;

namespace MyoX.Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserEntity?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(o => o.Username == username);
        }

        public async Task<bool> IsUserAlreadyExistAsync(string username)
        {
            return await _context.Users.AsNoTracking().AnyAsync(o => o.Username == username);
        }

        public async Task RegisterUserAsync(UserEntity newUser)
        {
            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();
        }

        public async Task SaveUserRefreshToken(UserEntity user, string refreshToken)
        {
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();
        }

        public async Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _context.Users.FirstOrDefaultAsync(o => o.RefreshToken == refreshToken);
        }
    }
}
