using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTO;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Query
{
    public record GetAllWorkoutSessionsQuery(HttpContext HttpContext) : IQuery<List<WorkoutSessionEntityDTO>?>;
}
