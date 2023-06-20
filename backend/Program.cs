using System.Runtime.InteropServices.JavaScript;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

// app.UseAuthorization();

app.UseCors(b => b.AllowAnyOrigin());

app.MapControllers();

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