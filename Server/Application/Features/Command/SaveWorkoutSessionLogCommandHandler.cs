using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Result.Common;
using Domain.Entities;
using Domain.Service;
using Mapster;
using MapsterMapper;
using Mediator;
using Microsoft.AspNetCore.OutputCaching;

namespace Application.Features.Command
{
    public class SaveWorkoutSessionLogCommandHandler : ICommandHandler<SaveWorkoutSessionLogCommand, ApiResult>
    {
        private readonly IWorkoutSessionLogRepository _workoutSessionLogRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IOutputCacheStore _outputCacheStore;
        public SaveWorkoutSessionLogCommandHandler(IWorkoutSessionLogRepository workoutSessionLogRepository, IMapper mapper, IUserRepository userRepository, IOutputCacheStore outputCacheStore)
        {
            _workoutSessionLogRepository = workoutSessionLogRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _outputCacheStore = outputCacheStore;
        }
        public async ValueTask<ApiResult> Handle(SaveWorkoutSessionLogCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByRefreshTokenAsync(command.HttpContext.Request.Cookies["Myo-X-Refresh-Token"]!);

            if (user == null)
            {
                return new ApiResult
                {
                    Success = false
                };
            }

            var newWorkoutSessionEntity = _mapper.Map<WorkoutSessionEntity>(command.request);

            WorkoutSessionEntity workoutSessionEntity = new WorkoutSessionEntity
            {
                UserId = user.Id,
                WorkoutSessionDate = DateTimeOffset.Now,
                Exercises = newWorkoutSessionEntity.Exercises
            };

            await _workoutSessionLogRepository.SaveWorkoutSessionLogAsync(workoutSessionEntity);
            await _outputCacheStore.EvictByTagAsync("workout-sessions-cache", cancellationToken);

            return new ApiResult
            {
                Success = true
            };
        }
    }
}
