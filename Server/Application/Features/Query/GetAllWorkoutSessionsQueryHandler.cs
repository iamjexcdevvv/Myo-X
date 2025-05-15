using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTO;
using Domain.Service;
using MapsterMapper;
using Mediator;

namespace Application.Features.Query
{
    public class GetAllWorkoutSessionsQueryHandler : IQueryHandler<GetAllWorkoutSessionsQuery, List<WorkoutSessionEntityDTO>?>
    {
        private readonly IWorkoutSessionLogRepository _workoutSessionLogRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public GetAllWorkoutSessionsQueryHandler(IWorkoutSessionLogRepository workoutSessionLogRepository, IUserRepository userRepository, IMapper mapper)
        {
            _workoutSessionLogRepository = workoutSessionLogRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }
        public async ValueTask<List<WorkoutSessionEntityDTO>?> Handle(GetAllWorkoutSessionsQuery query, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByRefreshTokenAsync(query.HttpContext.Request.Cookies["Myo-X-Refresh-Token"]!);

            if (user == null)
            {
                return null;
            }

            var userWorkoutSessions = await _workoutSessionLogRepository.GetAllWorkoutSessionsByUserAsync(user);

            return _mapper.Map<List<WorkoutSessionEntityDTO>>(userWorkoutSessions);
        }
    }
}
