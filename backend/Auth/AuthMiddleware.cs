using System.Security.Claims;
using System.Text.Encodings.Web;
using backend.Db;
using backend.Entities;
using backend.JWT;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace backend.Auth;

public class AuthScheme : AuthenticationSchemeOptions
{
}

public class AuthMiddleware : AuthenticationHandler<AuthScheme>
{
    private readonly JwtOrchestrator _jwtOrchestrator;
    private readonly RedisContext _redisContext;

    public AuthMiddleware(IOptionsMonitor<AuthScheme> options, ILoggerFactory logger, UrlEncoder encoder,
        ISystemClock clock, JwtOrchestrator jwtOrchestrator, RedisContext redisContext) : base(options, logger, encoder,
        clock)
    {
        _jwtOrchestrator = jwtOrchestrator;
        _redisContext = redisContext;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            return AuthenticateResult.Fail("No refresh token");

        if (_jwtOrchestrator.TryDecodeToken(refreshToken, out var refreshTokenPayload, TokenType.Refresh) !=
            DecodeStatus.Success)
            return AuthenticateResult.Fail("Invalid refresh token");

        var email = refreshTokenPayload["email"].ToString();
        var realRole = _redisContext.GetValue(email);


        if (!Request.Cookies.TryGetValue("access_token", out var accessToken) ||
            _jwtOrchestrator.TryDecodeToken(accessToken, out var accessTokenPayload, TokenType.Access) !=
            DecodeStatus.Success ||
            accessTokenPayload["role"].ToString() != realRole)
        {
            var newAccessResult = _jwtOrchestrator.GenerateAccessToken(email, realRole);

            Response.Cookies.Append("access_token", newAccessResult.Token, new CookieOptions
            {
                Expires = DateTimeOffset.FromUnixTimeSeconds(newAccessResult.Expiration),
                SameSite = SameSiteMode.Strict
            });
        }

        var refreshTokenExpiration =
            DateTimeOffset.FromUnixTimeSeconds(long.Parse(refreshTokenPayload["exp"].ToString()));

        if (refreshTokenExpiration < DateTime.Now.AddDays(3))
        {
            _redisContext.DeleteKey(email + ":" + refreshToken);

            var newRefreshResult = _jwtOrchestrator.GenerateRefreshToken(email);

            Response.Cookies.Append("refresh_token", newRefreshResult.Token, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.FromUnixTimeSeconds(newRefreshResult.Expiration)
            });
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.Role, realRole)
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims, "AuthScheme"));

        return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name));
    }
}