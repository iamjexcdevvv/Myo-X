using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyoX.Domain.Entities;

namespace MyoX.Domain.Interfaces
{
    public interface IWorkoutSessionLogRepository
    {
        Task SaveWorkoutSessionLog(WorkoutSessionEntity newWorkoutSessionLog);
        Task<List<WorkoutSessionEntity>> GetAllUserWorkoutSessionLog(UserEntity user);
    }
}
