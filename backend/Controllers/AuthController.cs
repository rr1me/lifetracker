using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using backend.Db;
using backend.Email;
using backend.Entities;
using backend.JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class AuthController : ControllerBase
{
    private readonly PostgresContext _postgresContext;
    private readonly RedisContext _redisContext;
    private readonly JwtOrchestrator _jwtOrchestrator;
    private readonly EmailOrchestrator _emailOrchestrator;

    public AuthController(PostgresContext postgresContext, JwtOrchestrator jwtOrchestrator,
        EmailOrchestrator emailOrchestrator, RedisContext redisContext)
    {
        _postgresContext = postgresContext;
        _jwtOrchestrator = jwtOrchestrator;
        _emailOrchestrator = emailOrchestrator;
        _redisContext = redisContext;
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
            Password = BCrypt.Net.BCrypt.HashPassword(userCreds.Password),
            Role = Roles.User
        };

        _postgresContext.Users.Add(user);
        _postgresContext.SaveChanges();

        return Ok("Registered: " + user.Email);
    }

    [HttpGet("/confirm/{JWT}")]
    public IActionResult Confirmation(string JWT)
    {
        var decodeStatus = _jwtOrchestrator.TryDecodeToken(JWT, out var payload, TokenType.ConfirmLink);

        if (decodeStatus == DecodeStatus.Invalid)
            return BadRequest("Invalid link");

        var email = payload["email"].ToString();

        if (decodeStatus == DecodeStatus.Expired)
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
    public IActionResult Resend([FromBody] UserCreds userCreds)
    {
        var user = _postgresContext.Users.FirstOrDefault(x => x.Email == userCreds.Email);
        if (user == null || user.Confirmed || !VerifyPass(userCreds.Password, user.Password))
            return StatusCode(410, "Unable to find unconfirmed email or password is wrong");

        if (userCreds.NewEmail == null)
            return _emailOrchestrator.Send(userCreds.Email)
                ? Ok("New link was sent")
                : StatusCode(520, "We're getting problems with sending you a new link. Try again later");

        if (!new EmailAddressAttribute().IsValid(userCreds.NewEmail)) return StatusCode(406, "New email is invalid");

        var sent = _emailOrchestrator.Send(userCreds.NewEmail);

        if (!sent) return StatusCode(520, "We're getting problems with sending you a new link. Try again later");

        user.Email = userCreds.NewEmail;
        _postgresContext.Users.Update(user);
        _postgresContext.SaveChanges();

        return Ok("Your email was changed and we've sent you new confirmation message");
    }

    [HttpPost("/singin")]
    public IActionResult Login([FromBody] UserCreds userCreds)
    {
        var user = _postgresContext.Users.FirstOrDefault(x => x.Email == userCreds.Email);
        if (user is not { Confirmed: true } || !VerifyPass(userCreds.Password, user.Password))
            return Unauthorized("Wrong email or password");

        TokenCookieHandler(true, user, out var accessExpiration);
        var refreshToken = TokenCookieHandler(false, user, out var refreshExpiration);

        _redisContext.SetValue(user.Email + ":" + refreshToken, user.Role.ToString(), refreshExpiration.UtcDateTime);

        if (!_redisContext.KeyExist(user.Email)) _redisContext.SetValue(user.Email, user.Role.ToString());

        return Ok("Successful singIn");
    }

    private string TokenCookieHandler(bool isAccess, User user, out DateTimeOffset expiration)
    {
        var token = _jwtOrchestrator.GenerateAuthToken(isAccess, user, out expiration);

        var options = new CookieOptions
        {
            SameSite = SameSiteMode.Strict,
            Expires = expiration,
            HttpOnly = !isAccess
        };
        HttpContext.Response.Cookies.Append((isAccess ? "access" : "refresh") + "_token", token, options);

        return token;
    }

    public IActionResult Logout()
    {
        if (!HttpContext.Request.Cookies.ContainsKey("refreshToken"))
            return StatusCode(410, "Unable to logout, no cookie");

        HttpContext.Response.Cookies.Delete("refreshToken");

        return Ok("Successful logout");
    }

    // public IActionResult Validation()
    // {
    //     if (!HttpContext.Request.Cookies.TryGetValue("auth", out var jwt))
    //         return StatusCode(410, "Unable to validate, no auth cookie");
    //
    //     if (_jwtOrchestrator.TryDecodeToken(jwt, out var payload) != DecodeStatus.success)
    //         return Unauthorized("Invalid token");
    //
    //     var email = payload["email"].ToString();
    //
    //     var savedJwt = _redisContext.GetValue(email + ":jwt");
    //
    //     if (!jwt.Equals(savedJwt))
    //     {
    //         HttpContext.Response.Cookies.Delete("auth");
    //         return Unauthorized("Invalid token");
    //     }
    //
    //     var expiration = DateTime.Now.AddDays(7);
    //     var options = new CookieOptions
    //     {
    //         HttpOnly = true,
    //         SameSite = SameSiteMode.Strict,
    //         Expires = expiration
    //     };
    //
    //     var newJwt = _jwtOrchestrator.GenerateAccessToken(email);
    //     _redisContext.SetValue(email + ":jwt", newJwt, expiration);
    //     HttpContext.Response.Cookies.Append("auth", newJwt, options);
    //     return Ok("Successful validation");
    // }

    [HttpGet("/token")]
    [Authorize]
    public IActionResult GetKeys()
    {
        _jwtOrchestrator.GetCustomESToken(out var pub, out var priv);

        return Ok(pub + " | " + priv);
    }

    [HttpPost("/role")]
    [Authorize]
    public IActionResult SetRole([FromBody]UserCreds userCreds)
    {
        var value = _redisContext.GetValue(userCreds.Email);
        _redisContext.SetValue(userCreds.Email, value == "Admin" ? "User" : "Admin");
        return Ok("not " + value);
    }

    private bool VerifyPass(string hash, string password) => BCrypt.Net.BCrypt.Verify(hash, password);
}

public class UserCreds
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string? NewEmail { get; set; }
}