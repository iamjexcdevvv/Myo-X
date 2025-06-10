using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyoX.Application.DTO;

namespace MyoX.Application.Result
{
    public class ResultResponse
    {
        private protected ResultResponse(bool isSuccess, ErrorResponse error, AuthResultDTO? auth)
        {
            if (isSuccess && error != ErrorResponse.None ||
                !isSuccess && error == ErrorResponse.None)
            {
                throw new ArgumentException("Invalid error", nameof(error));
            }

            if (auth is not null)
            {
                AccessToken = auth.AccessToken;
                RefreshToken = auth.RefreshToken;
            }

            IsSuccess = isSuccess;
            Errors = error;
        }

        public bool IsSuccess { get; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public ErrorResponse Errors { get; set; }

        public static ResultResponse Success(AuthResultDTO? auth = null) => new(true, ErrorResponse.None, auth);

        public static ResultResponse Failure(ErrorResponse error, AuthResultDTO? auth = null) => new(false, error, auth);
    }

    public class ResultResponse<T> : ResultResponse
    {
        private readonly T? _value;

        protected internal ResultResponse(T? value, bool isSuccess, ErrorResponse error, AuthResultDTO? auth)
            : base(isSuccess, error, auth)
        {
            _value = value;
        }

        public T Value => IsSuccess
            ? _value!
            : throw new InvalidOperationException("Cannot access value of failed result");

        public static ResultResponse<T> Success(T value, AuthResultDTO? auth = null) => new(value, true, ErrorResponse.None, auth);
        public static new ResultResponse<T> Failure(ErrorResponse error, AuthResultDTO? auth = null) => new(default, false, error, auth);
    }
}
