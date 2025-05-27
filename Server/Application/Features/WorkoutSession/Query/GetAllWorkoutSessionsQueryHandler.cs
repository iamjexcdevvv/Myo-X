using Application.DTO;
using Domain.Service;
using MapsterMapper;
using Mediator;
using Microsoft.Extensions.Caching.Memory;

namespace Application.Features.WorkoutSession.Query
{
    public class GetAllWorkoutSessionsQueryHandler : IQueryHandler<GetAllWorkoutSessionsQuery, List<WorkoutSessionEntityDTO>>
    {
        private readonly IWorkoutSessionLogRepository _workoutSessionLogRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        public GetAllWorkoutSessionsQueryHandler(IWorkoutSessionLogRepository workoutSessionLogRepository, IUserRepository userRepository, IMapper mapper, IMemoryCache memoryCache)
        {
            _workoutSessionLogRepository = workoutSessionLogRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _memoryCache = memoryCache;
        }
        public async ValueTask<List<WorkoutSessionEntityDTO>> Handle(GetAllWorkoutSessionsQuery query, CancellationToken cancellationToken)
        {
            string? refreshToken = query.HttpContext.Request.Cookies["Myo-X-Refresh-Token"];

            if (refreshToken is null)
            {
                return [];
            }

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user is null)
            {
                return [];
            }

            if (!_memoryCache.TryGetValue(user.Id, out List<WorkoutSessionEntityDTO>? userWorkoutSessions))
            {
                var workoutSessions = await _workoutSessionLogRepository.GetAllWorkoutSessionsByUserAsync(user);
                userWorkoutSessions = _mapper.Map<List<WorkoutSessionEntityDTO>>(workoutSessions);

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(30))
                    .SetSlidingExpiration(TimeSpan.FromMinutes(2));

                _memoryCache.Set(user.Id, userWorkoutSessions, cacheEntryOptions);
            }

            return userWorkoutSessions ?? [];
        }
    }   
}
