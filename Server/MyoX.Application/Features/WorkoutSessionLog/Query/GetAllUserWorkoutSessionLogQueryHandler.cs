using MapsterMapper;
using MyoX.Application.DTO;
using MyoX.Application.Result;
using MyoX.Application.Services.CQRS;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.WorkoutSessionLog.Query
{
    public class GetAllUserWorkoutSessionLogQueryHandler : IQueryHandler<GetAllUserWorkoutSessionLogQuery, List<WorkoutSessionEntityDTO>>
    {
        private readonly IWorkoutSessionLogRepository _workoutSessionLogRepo;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;
        public GetAllUserWorkoutSessionLogQueryHandler(IWorkoutSessionLogRepository workoutSessionLogRepo, IUserRepository userRepo, IMapper mapper)
        {
            _workoutSessionLogRepo = workoutSessionLogRepo;
            _userRepo = userRepo;
            _mapper = mapper;
        }
        public async Task<ResultResponse<List<WorkoutSessionEntityDTO>>> Handle(GetAllUserWorkoutSessionLogQuery query, CancellationToken cancellationToken)
        {
            var user = await _userRepo.GetUserByRefreshTokenAsync(query.refreshToken);

            if (user is null)
            {
                return ResultResponse<List<WorkoutSessionEntityDTO>>.Failure(new ErrorResponse());
            }

            var session = await _workoutSessionLogRepo.GetAllUserWorkoutSessionLog(user);
            return ResultResponse<List<WorkoutSessionEntityDTO>>.Success(_mapper.Map<List<WorkoutSessionEntityDTO>>(session));
        }
    }
}
