using MyoX.Application.Result;
using MyoX.Domain.Interfaces;

namespace MyoX.Application.Services
{
    public interface ICommandHandler<in TCommand> where TCommand : ICommand
    {
        Task<ResultResponse> Handle(TCommand command, CancellationToken cancellationToken = default);
    }

    public interface ICommandHandler<in TCommand, TResponse>
    where TCommand : ICommand<TResponse>
    {
        Task<ResultResponse<TResponse>> Handle(TCommand command, CancellationToken cancellationToken = default);
    }
}
