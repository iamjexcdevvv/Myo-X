using MyoX.Application.Result;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Services.CQRS
{
    public interface IQueryHandler<in TQuery, TResponse>
    where TQuery : IQuery<TResponse>
    {
        Task<ResultResponse<TResponse>> Handle(TQuery query, CancellationToken cancellationToken = default);
    }
}
