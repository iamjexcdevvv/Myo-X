using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Result.Common;

namespace Application.Result
{
    public class AuthResult : ApiResult
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
