using MapsterMapper;
using MyoX.Application.Result;
using MyoX.Application.Services;
using MyoX.Domain.Entities;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Features.WorkoutSessionLog.Command
{
    public sealed class SaveWorkoutSessionLogCommandHandler : ICommandHandler<SaveWorkoutSessionLogCommand>
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepo;
        private readonly IWorkoutSessionLogRepository _workoutSessionLogRepo;
        public SaveWorkoutSessionLogCommandHandler(IWorkoutSessionLogRepository workoutSessionLogRepo, IMapper mapper, IUserRepository userRepo)
        {
            _workoutSessionLogRepo = workoutSessionLogRepo;
            _mapper = mapper;
            _userRepo = userRepo;
        }
        public async Task<ResultResponse> Handle(SaveWorkoutSessionLogCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepo.GetUserByRefreshTokenAsync(command.refreshToken);

            if (user is null)
            {
                return ResultResponse.Failure(new ErrorResponse());
            }

            var newUserWorkoutSessionLog = _mapper.Map<WorkoutSessionEntity>(command.request);

            newUserWorkoutSessionLog.UserId = user.Id;
            newUserWorkoutSessionLog.WorkoutSessionDate = command.request.WorkoutSessionDate ?? DateTimeOffset.UtcNow;

            await _workoutSessionLogRepo.SaveWorkoutSessionLog(newUserWorkoutSessionLog);

            return ResultResponse.Success();
        }
    }
}
