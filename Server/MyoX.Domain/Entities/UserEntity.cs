using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyoX.Domain.Entities
{
    public class UserEntity
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string HashedPassword { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        public List<WorkoutSessionEntity>? WorkoutSessionsLog { get; set; }
    }
}
