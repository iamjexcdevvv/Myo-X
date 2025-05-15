using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Service
{
    public interface ITokenService
    {
        string GenerateJWTAccessToken(UserEntity request);
        string GenerateRefreshToken();
    }
}
