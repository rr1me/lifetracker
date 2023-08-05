using System.Security.Cryptography;
using backend.Entities;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;

namespace backend.JWT;

public class JwtOrchestrator
{
    private readonly ILogger<JwtOrchestrator> _logger;
    private readonly IConfiguration _config;

    private readonly ES256Algorithm confirmationLinksAlgorithm;
    private readonly ES256Algorithm accessTokenAlgorithm;
    private readonly ES256Algorithm refreshTokenAlgorithm;

    public JwtOrchestrator(IConfiguration config, ILogger<JwtOrchestrator> logger)
    {
        _config = config;
        _logger = logger;

        confirmationLinksAlgorithm = GenerateES256Algorithm("ECKeysForLinks");
        accessTokenAlgorithm = GenerateES256Algorithm("ECKeysForAccessToken");
        refreshTokenAlgorithm = GenerateES256Algorithm("ECKeysForRefreshToken");
    }

    public string GenerateJwtForConfirmationLink(string email)
    {
        return JwtBuilder.Create().WithAlgorithm(confirmationLinksAlgorithm)
            .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(24).ToUnixTimeSeconds())
            .AddClaim("email", email)
            .MustVerifySignature()
            .Encode();
        ;
    }

    public DecodeStatus TryDecodeToken(string token, out IDictionary<string, object> payload, TokenType tokenType)
    {
        var algorithm = tokenType switch
        {
            TokenType.Access => accessTokenAlgorithm,
            TokenType.Refresh => refreshTokenAlgorithm,
            TokenType.ConfirmLink => confirmationLinksAlgorithm
        };

        var jwtDecoder = JwtBuilder.Create()
            .WithAlgorithm(algorithm)
            .MustVerifySignature();
        try
        {
            payload = jwtDecoder
                .Decode<IDictionary<string, object>>(token);
        }
        catch (Exception e)
        {
            _logger.LogWarning("Decode exception: " + e.Message);

            if (e.GetType() == typeof(TokenExpiredException))
            {
                payload = jwtDecoder.WithValidationParameters(x => x.ValidateExpirationTime = false)
                    .Decode<IDictionary<string, object>>(token);
                return DecodeStatus.Expired;
            }

            payload = null;
            return DecodeStatus.Invalid;
        }

        return DecodeStatus.Success;
    }

    private ES256Algorithm GenerateES256Algorithm(string sectionName)
    {
        var ecKeys = _config.GetSection(sectionName).GetChildren().ToList();
        var privateEcKey = ecKeys[0].Value!;
        var publicEcKey = ecKeys[1].Value!;

        var publicEcDsa = ECDsa.Create();
        publicEcDsa.ImportSubjectPublicKeyInfo(Convert.FromBase64String(publicEcKey), out _);

        var privateEcDsa = ECDsa.Create();
        privateEcDsa.ImportECPrivateKey(Convert.FromBase64String(privateEcKey), out _);

        return new ES256Algorithm(publicEcDsa, privateEcDsa);
    }

    public void GetCustomESToken(out string pub, out string priv)
    {
        var ecDsa = ECDsa.Create();
        pub = ecDsa.ExportSubjectPublicKeyInfoPem();
        priv = ecDsa.ExportECPrivateKeyPem();
    }

    public string GenerateAccessToken(string email, Roles role, out long expiration)
    {
        expiration = DateTimeOffset.UtcNow.AddMinutes(5).ToUnixTimeSeconds();
        return JwtBuilder.Create().WithAlgorithm(accessTokenAlgorithm)
            .AddClaim("exp", expiration)
            .AddClaim("email", email)
            .AddClaim("role", role)
            .MustVerifySignature()
            .Encode();
    }

    public string GenerateRefreshToken(string email, out long expiration)
    {
        expiration = DateTimeOffset.UtcNow.AddDays(14).ToUnixTimeSeconds();
        return JwtBuilder.Create().WithAlgorithm(refreshTokenAlgorithm)
            .AddClaim("exp", expiration)
            .AddClaim("email", email)
            .MustVerifySignature()
            .Encode();
    }

    public string GenerateAuthToken(bool isAccess, User user, out DateTimeOffset expiration)
    {
        expiration = isAccess ? DateTimeOffset.UtcNow.AddMinutes(5) : DateTimeOffset.UtcNow.AddDays(14);
        var builder = JwtBuilder.Create().WithAlgorithm(isAccess ? accessTokenAlgorithm : refreshTokenAlgorithm)
            .AddClaim("exp", expiration.ToUnixTimeSeconds())
            .AddClaim("email", user.Email)
            .MustVerifySignature();

        if (isAccess) builder.AddClaim("role", user.Role);

        return builder.Encode();
    }
}

public enum DecodeStatus
{
    Success,
    Expired,
    Invalid
}

public enum TokenType
{
    Access,
    Refresh,
    ConfirmLink
}