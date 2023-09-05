using System.ComponentModel.DataAnnotations;
using System.Transactions;
using backend.Db;
using backend.Email;
using backend.Entities;
using backend.JWT;

namespace backend.Auth;

public class AuthService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly RedisContext _redisContext;
    private readonly JwtOrchestrator _jwtOrchestrator;
    private readonly EmailOrchestrator _emailOrchestrator;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IServiceProvider serviceProvider, RedisContext redisContext, JwtOrchestrator jwtOrchestrator,
        EmailOrchestrator emailOrchestrator, ILogger<AuthService> logger)
    {
        _serviceProvider = serviceProvider;
        _redisContext = redisContext;
        _jwtOrchestrator = jwtOrchestrator;
        _emailOrchestrator = emailOrchestrator;
        _logger = logger;
    }

    public ApiResult Register(UserCreds userCreds)
    {
        if (!new EmailAddressAttribute().IsValid(userCreds.Email))
            return new ApiResult(406, "Invalid email");

        using var postgresContext = GetPostgresContext();
        try
        {
            using var transaction = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions
            {
                IsolationLevel = IsolationLevel.Serializable
            });

            if (postgresContext.Users.Any(x => x.Email == userCreds.Email))
                return new ApiResult(409, "There's already a user with that email");

            var user = new User
            {
                Email = userCreds.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userCreds.Password),
                Role = Roles.User
            };

            postgresContext.Users.Add(user);
            postgresContext.SaveChanges();

            transaction.Complete();
        }
        catch (Exception e)
        {
            _logger.LogWarning(e.ToString());
            return new ApiResult(500, "Transaction error");
        }
        
        return !_emailOrchestrator.SendConfirmation(userCreds.Email)
            ? new ApiResult(400, "An error was intercepted. Consider check your email")
            : new ApiResult(200, "Registered: " + userCreds.Email);
    }

    public ApiResult Confirm(string JWT)
    {
        var decodeStatus = _jwtOrchestrator.TryDecodeToken(JWT, out var payload, TokenType.ConfirmLink);

        if (decodeStatus == DecodeStatus.Invalid)
            return new ApiResult(400, "Invalid link");

        var email = payload["email"].ToString();

        if (decodeStatus == DecodeStatus.Expired)
        {
            return _emailOrchestrator.SendConfirmation(email)
                ? new ApiResult(408, "That link is expired. New one is already sent")
                : new ApiResult(520, "Link was expired. We're getting problems with sending new one. Try again later");
        }

        using var postgresContext = GetPostgresContext();

        var user = postgresContext.Users.First(x => x.Email == email);

        if (user.Confirmed)
            return new ApiResult(406, "Already confirmed");

        user.Confirmed = true;
        postgresContext.Users.Update(user);
        postgresContext.SaveChanges();

        return new ApiResult(200, "Confirmed");
    }

    public ApiResult Resend(UserCreds userCreds)
    {
        using var postgresContext = GetPostgresContext();

        var user = postgresContext.Users.FirstOrDefault(x => x.Email == userCreds.Email);
        if (user == null || user.Confirmed)
            return new ApiResult(410, "Unable to find unconfirmed email");

        if (userCreds.NewEmail == null)
            return _emailOrchestrator.SendConfirmation(userCreds.Email)
                ? new ApiResult(200, "New link was sent")
                : new ApiResult(520, "We're getting problems with sending you a new link. Try again later");

        if (!new EmailAddressAttribute().IsValid(userCreds.NewEmail) || !VerifyPass(userCreds.Password, user.Password))
            return new ApiResult(406, "New email is invalid or password is wrong");

        var sent = _emailOrchestrator.SendConfirmation(userCreds.NewEmail);

        if (!sent) return new ApiResult(520, "We're getting problems with sending you a new link. Try again later");

        user.Email = userCreds.NewEmail;
        postgresContext.Users.Update(user);
        postgresContext.SaveChanges();

        return new ApiResult(200, "Your email was changed and we've sent you new confirmation message");
    }

    public ApiResult Login(UserCreds userCreds, HttpResponse response)
    {
        using var postgresContext = GetPostgresContext();

        var user = postgresContext.Users.FirstOrDefault(x => x.Email == userCreds.Email);
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
            HttpOnly = !isAccess,
            // Domain = "http://localhost:3000"
        };
        response.Cookies.Append((isAccess ? "access" : "refresh") + "_token", tokenResult.Token, options);

        return tokenResult;
    }

    private bool VerifyPass(string hash, string password) => BCrypt.Net.BCrypt.Verify(hash, password);

    private PostgresContext GetPostgresContext() =>
        _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<PostgresContext>();
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