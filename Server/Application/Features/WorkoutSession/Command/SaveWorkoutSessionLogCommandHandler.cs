using Application.DTO;
using Domain.Entities;
using Domain.Interfaces;
using MapsterMapper;
using Mediator;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Features.WorkoutSession.Command
{
    public class SaveWorkoutSessionLogCommandHandler : ICommandHandler<SaveWorkoutSessionLogCommand, ResultResponseDTO>
    {
        private readonly IWorkoutSessionLogRepository _workoutSessionLogRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        public SaveWorkoutSessionLogCommandHandler(IWorkoutSessionLogRepository workoutSessionLogRepository, IMapper mapper, IUserRepository userRepository, IMemoryCache memoryCache)
        {
            _workoutSessionLogRepository = workoutSessionLogRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _memoryCache = memoryCache;
        }
        public async ValueTask<ResultResponseDTO> Handle(SaveWorkoutSessionLogCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByRefreshTokenAsync(command.HttpContext.Request.Cookies["Myo-X-Refresh-Token"]!);

            if (user is null)
            {
                return new ResultResponseDTO
                {
                    Success = false
                };
            }

            var newWorkoutSessionEntity = _mapper.Map<WorkoutSessionEntity>(command.request);

            WorkoutSessionEntity workoutSessionEntity = new WorkoutSessionEntity
            {
                UserId = user.Id,
                WorkoutSessionDate = command.request.WorkoutSessionDate ?? DateTimeOffset.Now,
                Exercises = newWorkoutSessionEntity.Exercises
            };

            await _workoutSessionLogRepository.SaveWorkoutSessionLogAsync(workoutSessionEntity);

            _memoryCache.Remove(user.Id);
            //await _outputCacheStore.EvictByTagAsync("workout-sessions-cache", cancellationToken);

            return new ResultResponseDTO
            {
                Success = true
            };
        }
    }
}
