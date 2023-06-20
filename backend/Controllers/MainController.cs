using backend.Entities;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class MainController : ControllerBase
{
    [HttpGet("/month")]
    public IActionResult GetMonth(string m)
    {
        var day = new Day(m, new List<Event>
        {
            new Event(638223881710000000, 638223881710000001, "ffs go do some math")
        });

        return Ok(day);


//         return Ok($@"{{
//     ""month"": ""{m}"",
//     ""events"": [
//         {{
//             ""start"": 638223881710000000,
//             ""end"": 638223881710000001,
//             ""description"": ""ffs go do some math""
//         }}
//     ]
// }}");
    }
}