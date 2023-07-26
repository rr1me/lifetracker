using System.ComponentModel.DataAnnotations;
using backend.Db;
using backend.Email;
using backend.Entities;
using backend.JWT;
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
            Password = CryptPass(userCreds.Password)
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
            return !_emailOrchestrator.Send(email)
                ? StatusCode(520, "Link was expired. Intercepting problems with sending new one. Try again later") //todo make some defence mechanism that prevents using old links multiple times
                : StatusCode(408, "That link is expired. New one is already sent");
        }

        var user = _postgresContext.Users.First(x => x.Email == email);

        if (user.Confirmed)
            return StatusCode(406, "Already confirmed");

        user.Confirmed = true;
        _postgresContext.Users.Update(user);
        _postgresContext.SaveChanges();

        return Ok("Confirmed");
    }

    private string CryptPass(string pass) => BCrypt.Net.BCrypt.HashPassword(pass);
}

public class UserCreds
{
    public string Email { get; set; }
    public string Password { get; set; }
}