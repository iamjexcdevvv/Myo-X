using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyoX.Application.DTO
{
    public record LoginDTO
    {
        public required string Username { get; init; }
        public required string Password { get; init; }
    }
}
