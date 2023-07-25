using System.Net.Mail;
using System.Text;
using System.Text.Unicode;
using backend.Entities;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
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

            // month.Add(
            //     new Day(dateMark, new User(), i, new List<Event>
            //     {
            //         new(0, 120, "ffs go do some math"),
            //         new(120, 360, "?"),
            //         new(420, 500, "st"),
            //         new(1020, 1440, "fu")
            //     })
            // );
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

    [HttpGet("/send")]
    public IActionResult Send()
    {
        var credFile =
            "C:\\Users\\nmc\\Desktop\\client_secret_137555693847-2hbd6v42tcn8gv90228cjm6pem7qnkpd.apps.googleusercontent.com.json";

        var secrets = GoogleClientSecrets.FromFile(credFile).Secrets;
        var credential = GoogleWebAuthorizationBroker.AuthorizeAsync(secrets, new[] { GmailService.Scope.GmailSend },
            "rime",
            CancellationToken.None).Result;

        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "Web client 1"
        });

        var message =
            $"To: superemail1@yandex.ru\r\nSubject: what to fuck?\r\nContent-Type: text/html;charset=utf-8\r\n\r\nhello there dumbass";
        var msg = new Message { Raw = Base64UrlEncode(message) };

        var r = service.Users.Messages.Send(msg, "me");
        r.Execute();

        return Ok("?");
    }

    private string Base64UrlEncode(string input)
    {
        var inputBytes = Encoding.UTF8.GetBytes(input);
        return Convert.ToBase64String(inputBytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .Replace("=", "");
    }
}