using System.ComponentModel.DataAnnotations;
using backend.Db;
using backend.Email;
using backend.Entities;
using backend.JWT;

namespace backend.Auth;

public class AuthService
{
    private readonly PostgresContext _postgresContext;
    private readonly RedisContext _redisContext;
    private readonly JwtOrchestrator _jwtOrchestrator;
    private readonly EmailOrchestrator _emailOrchestrator;

    public AuthService(PostgresContext postgresContext, RedisContext redisContext, JwtOrchestrator jwtOrchestrator,
        EmailOrchestrator emailOrchestrator)
    {
        _postgresContext = postgresContext;
        _redisContext = redisContext;
        _jwtOrchestrator = jwtOrchestrator;
        _emailOrchestrator = emailOrchestrator;
    }

    public ApiResult Register(UserCreds userCreds)
    {
        if (!new EmailAddressAttribute().IsValid(userCreds.Email))
            return new ApiResult(406, "Invalid email");

        if (_postgresContext.Users.Any(x => x.Email == userCreds.Email))
            return new ApiResult(409, "There's already a user with that email");

        if (!_emailOrchestrator.Send(userCreds.Email))
            return new ApiResult(400, "An error was intercepted. Consider check your email");

        var user = new User
        {
            Email = userCreds.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(userCreds.Password),
            Role = Roles.User
        };

        _postgresContext.Users.Add(user);
        _postgresContext.SaveChanges();

        return new ApiResult(200, "Registered: " + user.Email);
    }

    public ApiResult Confirm(string JWT)
    {
        var decodeStatus = _jwtOrchestrator.TryDecodeToken(JWT, out var payload, TokenType.ConfirmLink);

        if (decodeStatus == DecodeStatus.Invalid)
            return new ApiResult(400, "Invalid link");

        var email = payload["email"].ToString();

        if (decodeStatus == DecodeStatus.Expired)
        {
            return _emailOrchestrator.Send(email)
                ? new ApiResult(408, "That link is expired. New one is already sent")
                : new ApiResult(520, "Link was expired. We're getting problems with sending new one. Try again later");
        }

        var user = _postgresContext.Users.First(x => x.Email == email);

        if (user.Confirmed)
            return new ApiResult(406, "Already confirmed");

        user.Confirmed = true;
        _postgresContext.Users.Update(user);
        _postgresContext.SaveChanges();

        return new ApiResult(200, "Confirmed");
    }

    public ApiResult Resend(UserCreds userCreds)
    {
        var user = _postgresContext.Users.FirstOrDefault(x => x.Email == userCreds.Email);
        if (user == null || user.Confirmed || !VerifyPass(userCreds.Password, user.Password))
            return new ApiResult(410, "Unable to find unconfirmed email or password is wrong");

        if (userCreds.NewEmail == null)
            return _emailOrchestrator.Send(userCreds.Email)
                ? new ApiResult(200, "New link was sent")
                : new ApiResult(520, "We're getting problems with sending you a new link. Try again later");

        if (!new EmailAddressAttribute().IsValid(userCreds.NewEmail)) return new ApiResult(406, "New email is invalid");

        var sent = _emailOrchestrator.Send(userCreds.NewEmail);

        if (!sent) return new ApiResult(520, "We're getting problems with sending you a new link. Try again later");

        user.Email = userCreds.NewEmail;
        _postgresContext.Users.Update(user);
        _postgresContext.SaveChanges();

        return new ApiResult(200, "Your email was changed and we've sent you new confirmation message");
    }

    public ApiResult Login(UserCreds userCreds, HttpResponse response)
    {
        var user = _postgresContext.Users.FirstOrDefault(x => x.Email == userCreds.Email);
        if (user is not { Confirmed: true } || !VerifyPass(userCreds.Password, user.Password))
            return new ApiResult(401, "Wrong email or password");

        TokenCookieHandler(true, user, response);
        var refreshAppendResult = TokenCookieHandler(false, user, response);

        _redisContext.SetValue(user.Email + ":" + refreshAppendResult.Token, user.Role.ToString(),
            DateTimeOffset.FromUnixTimeSeconds(refreshAppendResult.Expiration).UtcDateTime);

        if (!_redisContext.KeyExist(user.Email)) _redisContext.SetValue(user.Email, user.Role.ToString());

        return new ApiResult(200, "Successful singIn");
    }

    public ApiResult Logout(HttpContext httpContext)
    {
        if (!httpContext.Request.Cookies.ContainsKey("refreshToken"))
            return new ApiResult(410, "Unable to logout, no cookie");

        httpContext.Response.Cookies.Delete("refreshToken");

        return new ApiResult(200, "Successful logout");
    }

    private GenerationResult TokenCookieHandler(bool isAccess, User user, HttpResponse response)
    {
        var claims = new Dictionary<string, object>
        {
            { "email", user.Email }
        };
        if (isAccess) claims["role"] = user.Role;

        var tokenResult = _jwtOrchestrator.GenerateJwtToken(claims, isAccess ? TokenType.Access : TokenType.Refresh);

        var options = new CookieOptions
        {
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.FromUnixTimeSeconds(tokenResult.Expiration),
            HttpOnly = !isAccess
        };
        response.Cookies.Append((isAccess ? "access" : "refresh") + "_token", tokenResult.ToString(), options);

        return tokenResult;
    }

    private bool VerifyPass(string hash, string password) => BCrypt.Net.BCrypt.Verify(hash, password);
}

public class UserCreds
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string? NewEmail { get; set; }
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