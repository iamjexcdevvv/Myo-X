using Application.DTO;
using Application.Features.Command;
using Application.Features.Query;
using Application.Result.Common;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyoX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkoutSessionLogController : ControllerBase
    {
        private readonly IMediator _mediator;
        public WorkoutSessionLogController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<WorkoutSessionEntityDTO>?>> GetUserLogWorkoutSessions()
        {
            return await _mediator.Send(new GetAllWorkoutSessionsQuery(HttpContext));
        }

        [HttpPost]
        public async Task<ActionResult<ResultResponse>> logWorkoutSession(WorkoutSessionEntityDTO request)
        {
            return await _mediator.Send(new SaveWorkoutSessionLogCommand(request, HttpContext));
        }
    }
}
