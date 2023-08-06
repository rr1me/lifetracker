using backend.Auth;
using backend.Db;
using backend.JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class AuthController : ControllerBase
{
    private readonly RedisContext _redisContext;
    private readonly JwtOrchestrator _jwtOrchestrator;
    private readonly AuthService _auth;

    public AuthController(AuthService auth, JwtOrchestrator jwtOrchestrator, RedisContext redisContext)
    {
        _auth = auth;
        _jwtOrchestrator = jwtOrchestrator;
        _redisContext = redisContext;
    }

    [HttpPost("/singup")]
    public IActionResult Registration([FromBody] UserCreds userCreds)
    {
        var r = _auth.Register(userCreds);
        return StatusCode(r.StatusCode, r.Result);
    }

    [HttpGet("/confirm/{JWT}")]
    public IActionResult Confirmation(string JWT)
    {
        var r = _auth.Confirm(JWT);
        return StatusCode(r.StatusCode, r.Result);
    }

    [HttpPost("/resend")]
    public IActionResult Resend([FromBody] UserCreds userCreds)
    {
        var r = _auth.Resend(userCreds);
        return StatusCode(r.StatusCode, r.Result);
    }

    [HttpPost("/singin")]
    public IActionResult Login([FromBody] UserCreds userCreds)
    {
        var r = _auth.Login(userCreds, HttpContext.Response);
        return StatusCode(r.StatusCode, r.Result);
    }

    public IActionResult Logout()
    {
        var r = _auth.Logout(HttpContext);
        return StatusCode(r.StatusCode, r.Result);
    }

    [HttpGet("/token")]
    [Authorize]
    public IActionResult GetKeys()
    {
        _jwtOrchestrator.GetCustomESToken(out var pub, out var priv);

        return Ok(pub + " | " + priv);
    }

    [HttpPost("/role")]
    [Authorize]
    public IActionResult SetRole([FromBody] UserCreds userCreds)
    {
        var value = _redisContext.GetValue(userCreds.Email);
        _redisContext.SetValue(userCreds.Email, value == "Admin" ? "User" : "Admin");
        return Ok("not " + value);
    }
}