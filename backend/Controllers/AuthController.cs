using System.Collections.ObjectModel;
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

    [HttpPost("/singin")]
    public IActionResult Login([FromBody] UserCreds userCreds)
    {
        var user = _postgresContext.Users.FirstOrDefault(x => x.Email == userCreds.Email);
        if (user == null || user.Confirmed || user.Password != userCreds.Password)
            return Unauthorized("Wrong email or password");

        TokenCookieHandler(true, user, out var accessExpiration);
        var refreshToken = TokenCookieHandler(false, user, out var refreshExpiration);
        
        _redisContext.SetValue(user.Email + ":" + refreshToken, user.Role.ToString(), refreshExpiration);
        
        if (!_redisContext.KeyExist(user.Email)) _redisContext.SetValue(user.Email, user.Role.ToString());
        
        return Ok("Successful singIn");
    }

    private string TokenCookieHandler(bool isAccess, User user, out DateTime expiration)
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
    public IActionResult GetKeys()
    {
        _jwtOrchestrator.GetCustomESToken(out var pub, out var priv);

        return Ok(pub + " | " + priv);
    }
}

public class UserCreds
{
    public string Email { get; set; }
    public string Password { get; set; }
}