using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Result.Common
{
    public class ApiResult
    {
        public bool Success { get; set; }
        public Dictionary<string, List<string>>? Errors { get; set; }
    }
}
