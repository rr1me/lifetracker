using System.Text;
using backend.JWT;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;

namespace backend.Email;

public class EmailOrchestrator
{
    private readonly ILogger<EmailOrchestrator> _logger;
    private readonly IConfiguration _config;
    private readonly JwtOrchestrator _jwtOrchestrator;

    public EmailOrchestrator(IConfiguration config, JwtOrchestrator jwtOrchestrator, ILogger<EmailOrchestrator> logger)
    {
        _config = config;
        _jwtOrchestrator = jwtOrchestrator;
        _logger = logger;
    }

    public bool Send(string to)
    {
        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = Authorize(),
            ApplicationName = "Web client 1"
        });

        var message = "Use this link to confirm your email: http://localhost:7121/confirm/" + _jwtOrchestrator.GenerateJwtForConfirmationLink(to);

        try
        {
            service.Users.Messages.Send(MakeMessage(to, "LifeTracker registration confirm", message), "me").Execute();
        }
        catch (Exception e)
        {
            _logger.LogWarning("Sending email error: " + e.Message);
            return false;
        }

        return true;
    }

    private Message MakeMessage(string to, string subject, string body)
    {
        var raw =
            $"To: {to}\r\nSubject: {subject}\r\nContent-Type: text/html;charset=utf-8\r\n\r\n{body}";
        return new Message { Raw = Base64UrlEncode(raw) };
    }

    private UserCredential Authorize()
    {
        var secrets = GoogleClientSecrets.FromFile(_config.GetSection("Client_Secret").Value).Secrets;
        return GoogleWebAuthorizationBroker.AuthorizeAsync(secrets, new[] { GmailService.Scope.GmailSend },
            "rime",
            CancellationToken.None).Result;
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