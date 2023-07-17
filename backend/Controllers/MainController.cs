using backend.Entities;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class MainController : ControllerBase
{
    [HttpGet("/month")]
    public IActionResult GetMonth(float dateMark)
    {
        var month = new List<Day>();

        for (var i = 0; i < 31; i++)
        {
            if (i == 15 || i == 28)
                continue;

            month.Add(
                new Day(dateMark, 1230, i, new List<Event>
                {
                    new(0, 120, "ffs go do some math"),
                    new(120, 360, "?"),
                    new(420, 500, "st"),
                    new(1020, 1440, "fu")
                })
            );
        }

        return Ok(month);


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