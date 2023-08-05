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
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            return AuthenticateResult.Fail("No refresh token");

        if (_jwtOrchestrator.TryDecodeToken(refreshToken, out var refreshTokenPayload) != DecodeStatus.success)
            return AuthenticateResult.Fail("Invalid refresh token");

        var email = refreshTokenPayload["email"].ToString();
        var realRole = _redisContext.GetValue(email);


        if (!Request.Cookies.TryGetValue("accessToken", out var accessToken) ||
            _jwtOrchestrator.TryDecodeToken(accessToken, out var accessTokenPayload) != DecodeStatus.success ||
            accessTokenPayload["role"].ToString() != realRole)
        {
            var newAccessToken =
                _jwtOrchestrator.GenerateAccessToken(email, Enum.Parse<Roles>(realRole), out var expiration);
            Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
            {
                Expires = expiration,
                SameSite = SameSiteMode.Strict
            });
        }

        var refreshTokenExpiration = DateTime.Parse(refreshTokenPayload["exp"].ToString());

        if (refreshTokenExpiration < DateTime.Now.AddDays(3))
        {
            _redisContext.DeleteKey(email + ":" + refreshToken);

            var newRefreshToken = _jwtOrchestrator.GenerateRefreshToken(email, out var newRefreshTokenExpiration);
        
            Response.Cookies.Append("refresh_token", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = newRefreshTokenExpiration
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