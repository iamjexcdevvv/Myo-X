using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyoX.Application.Result
{
    public sealed class ErrorResponse : Dictionary<string, List<string>>
    {
        public ErrorResponse() : base() { }

        public ErrorResponse(IDictionary<string, List<string>> dictionary) : base(dictionary) { }
        
        public static readonly ErrorResponse None = new();
    }
}
