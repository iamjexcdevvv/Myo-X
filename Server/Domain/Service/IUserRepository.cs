using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Service
{
    public interface IUserRepository
    {
        Task RegisterUser(UserEntity user);
        Task<UserEntity?> GetUserByEmailAsync(string email);
        Task<UserEntity?> GetUserByRefreshTokenAsync(string refreshToken);
        Task SaveUserDataChanges();
    }
}
