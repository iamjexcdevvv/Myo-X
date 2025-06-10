using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyoX.Application.DTO;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;
using MyoX.Infrastructure.Context;

namespace MyoX.Infrastructure.Repository
{
    public class WorkoutSessionLogRepository : IWorkoutSessionLogRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public WorkoutSessionLogRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<WorkoutSessionEntity>> GetAllUserWorkoutSessionLog(UserEntity user)
        {
            var sessions = await _context.WorkoutSessions
                .AsNoTracking()
                .Where(s => s.UserId == user.Id)
                .Select(s => new WorkoutSessionEntityDTO
                {
                    Id = s.Id,
                    WorkoutSessionDate = s.WorkoutSessionDate,
                    Exercises = s.Exercises.Select(e => new WorkoutSessionExerciseEntityDTO
                    {
                        ExerciseId = e.ExerciseId,
                        ExerciseName = e.ExerciseName,
                        RepRangeStart = e.RepRangeStart,
                        RepRangeEnd = e.RepRangeEnd,
                        Sets = e.Sets.Select(set => new WorkoutSessionExerciseSetEntityDTO
                        {
                            Set = set.Set,
                            Reps = set.Reps,
                            Load = set.Load,
                            RIR = set.RIR
                        }).ToList()
                    }).ToList()
                })
                .AsSplitQuery()
                .ToListAsync();

            return _mapper.Map<List<WorkoutSessionEntity>>(sessions);
        }

        public async Task SaveWorkoutSessionLog(WorkoutSessionEntity newWorkoutSessionLog)
        {
            await _context.WorkoutSessions.AddAsync(newWorkoutSessionLog);
            await _context.SaveChangesAsync();
        }
    }
}
