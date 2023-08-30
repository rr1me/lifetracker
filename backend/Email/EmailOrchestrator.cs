using System.Net;
using System.Net.Mail;
using backend.JWT;

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

    public bool SendConfirmation(string to)
    {
        var message = "Use this link to confirm your email: https://localhost:7121/confirm/" + _jwtOrchestrator.GenerateJwtForConfirmationLink(to).Token;

        try
        {
            SendEmail(to, message);
        }
        catch (Exception e)
        {
            _logger.LogWarning("Sending email error: " + e.Message);
            return false;
        }

        return true;
    }

    private void SendEmail(string to, string message)
    {
        var gmail = _config.GetSection("Gmail").Value;
        var appPassword = _config.GetSection("AppPassword").Value;

        using var smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(gmail, appPassword),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            To = { to },
            From = new MailAddress(gmail),
            Subject = "LifeTracker registration confirm",
            Body = message
        };
        
        smtpClient.Send(mailMessage);
    }
}