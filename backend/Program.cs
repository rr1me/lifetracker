using backend.Auth;
using backend.Db;
using backend.Email;
using backend.JWT;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<PostgresContext>();
builder.Services.AddSingleton<RedisContext>();

builder.Services.AddSingleton<EmailOrchestrator>();
builder.Services.AddSingleton<JwtOrchestrator>();

builder.Services.AddSingleton<AuthService>();

builder.Services.AddAuthentication().AddScheme<AuthScheme, AuthMiddleware>("AuthScheme", null);
builder.Services.AddAuthorization(x =>
{
    x.AddPolicy("Admin", p => p.RequireRole("Admin"));
    x.AddPolicy("User", p => p.RequireRole("User"));
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(b => b.AllowAnyOrigin());

app.MapControllers();


var serviceProvider = app.Services.CreateScope().ServiceProvider;
var db = serviceProvider.GetRequiredService<PostgresContext>();
db.Database.EnsureCreated();

// var user = new User
// {
//     Confirmed = false,
//     Email = "email",
//     Password = "pass"
// };
// db.Users.Add(user);
// // var user = db.Users.First(x => x.Id == 1);
//
// var day = new Day
// {
//     dayNumber = 1,
//     DateMark = 2023.01,
//     User = user
// };
// db.Days.Add(day);

// db.SaveChanges();

var redisContext = app.Services.GetService<RedisContext>();
app.Lifetime.ApplicationStopped.Register(redisContext.CloseConnection);

app.Use(async (context, next) =>
{
    var logger = app.Logger;
    
    var request = context.Request;

    var requestPath = request.Path;
    var requestMethod = request.Method;
    var remoteIp = context.Connection.RemoteIpAddress.ToString();
    logger.LogInformation($"Starting: {requestPath} | Method: {requestMethod} | RemoteIp: {remoteIp} | Date: {DateTime.Now}");
    logger.LogInformation($"Headers: {string.Join(" | ", request.Headers.ToArray())}");

    await next.Invoke();

    var responseStatusCode = context.Response.StatusCode;
    logger.LogInformation($"Ending: {requestPath} | Code: {responseStatusCode}");
});

app.Run();