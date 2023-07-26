using System.Runtime.InteropServices.JavaScript;
using backend.Db;
using backend.Email;
using backend.Entities;
using backend.JWT;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// builder.Services.AddLogging();

builder.Services.AddDbContext<PostgresContext>();
builder.Services.AddSingleton<RedisContext>();

builder.Services.AddSingleton<EmailOrchestrator>();
builder.Services.AddSingleton<JwtOrchestrator>();

var app = builder.Build();

app.UseHttpsRedirection();

// app.UseAuthorization();

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

db.SaveChanges();

// var redisContext = serviceProvider.GetService<RedisContext>();
// redisContext.TryItOn();

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