using System.ComponentModel.DataAnnotations;
using backend.Db;
using backend.Email;
using backend.Entities;
using backend.JWT;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class AuthController : ControllerBase
{
    private readonly PostgresContext _postgresContext;
    private readonly JwtOrchestrator _jwtOrchestrator;
    private readonly EmailOrchestrator _emailOrchestrator;

    public AuthController(PostgresContext postgresContext, JwtOrchestrator jwtOrchestrator,
        EmailOrchestrator emailOrchestrator)
    {
        _postgresContext = postgresContext;
        _jwtOrchestrator = jwtOrchestrator;
        _emailOrchestrator = emailOrchestrator;
    }

    [HttpPost("/singup")]
    public IActionResult Registration([FromBody] UserCreds userCreds)
    {
        if (!new EmailAddressAttribute().IsValid(userCreds.Email))
            return StatusCode(406, "Invalid email");

        if (_postgresContext.Users.Any(x => x.Email == userCreds.Email))
            return Conflict("There's already a user with that email");

        if (!_emailOrchestrator.Send(userCreds.Email))
            return BadRequest("An error was intercepted. Consider check your email");

        var user = new User
        {
            Email = userCreds.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(userCreds.Password)
        };

        _postgresContext.Users.Add(user);
        _postgresContext.SaveChanges();

        return Ok("Registered: " + user.Email);
    }

    [HttpGet("/confirm/{JWT}")]
    public IActionResult Confirmation(string JWT)
    {
        var decodeStatus = _jwtOrchestrator.TryDecodeToken(JWT, out var payload);

        if (decodeStatus == DecodeStatus.invalid)
            return BadRequest("Invalid link");

        var email = payload["email"].ToString();

        if (decodeStatus == DecodeStatus.expired)
        {
            return _emailOrchestrator.Send(email)
                ? StatusCode(408, "That link is expired. New one is already sent")
                : StatusCode(520, "Link was expired. We're getting problems with sending new one. Try again later");
        }

        var user = _postgresContext.Users.First(x => x.Email == email);

        if (user.Confirmed)
            return StatusCode(406, "Already confirmed");

        user.Confirmed = true;
        _postgresContext.Users.Update(user);
        _postgresContext.SaveChanges();

        return Ok("Confirmed");
    }

    [HttpPost("/resend")]
    public IActionResult Resend([FromBody] string email, string password, string? newEmail)
    {
        var user = _postgresContext.Users.FirstOrDefault(x => x.Email == email);
        if (user == null || user.Confirmed || user.Password != password)
            return StatusCode(410, "Unable to find unconfirmed email or password is wrong");
        
        if (newEmail == null)
            return _emailOrchestrator.Send(email)
                ? Ok("New link was sent")
                : StatusCode(520, "We're getting problems with sending you a new link. Try again later");

        if (!new EmailAddressAttribute().IsValid(newEmail)) return StatusCode(406, "New email is invalid");

        var sent = _emailOrchestrator.Send(newEmail);
            
        if (!sent) return StatusCode(520, "We're getting problems with sending you a new link. Try again later");
            
        user.Email = newEmail;
        _postgresContext.Users.Update(user);
        _postgresContext.SaveChanges();

        return Ok("Your email was changed and we've sent you new confirmation message");
    }
}

public class UserCreds
{
    public string Email { get; set; }
    public string Password { get; set; }
}