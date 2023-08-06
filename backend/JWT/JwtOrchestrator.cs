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

    public DecodeStatus TryDecodeToken(string token, out IDictionary<string, object> payload, TokenType type)
    {
        var algorithm = GetAlgorithm(type);

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

    public GenerationResult GenerateJwtToken(IDictionary<string, object> claims, TokenType type)
    {
        var algorithm = GetAlgorithm(type);
        var expiration = GetExpirationDate(type);
        var builder = JwtBuilder.Create().WithAlgorithm(algorithm).AddClaim("exp", expiration);
        foreach (var claim in claims)
        {
            builder.AddClaim(claim.Key, claim.Value);
        }

        return new GenerationResult(builder.MustVerifySignature().Encode(), expiration);
    }

    public GenerationResult GenerateAccessToken(string email, string role) => GenerateJwtToken(
        new Dictionary<string, object>
        {
            { "email", email },
            { "role", Enum.Parse<Roles>(role) }
        }, TokenType.Access);

    public GenerationResult GenerateRefreshToken(string email) => GenerateJwtToken(new Dictionary<string, object>
    {
        { "email", email },
    }, TokenType.Refresh);

    public GenerationResult GenerateJwtForConfirmationLink(string email) => GenerateJwtToken(
        new Dictionary<string, object>
        {
            { "email", email }
        }, TokenType.ConfirmLink);

    private ES256Algorithm GetAlgorithm(TokenType type)
    {
        return type switch
        {
            TokenType.Access => accessTokenAlgorithm,
            TokenType.Refresh => refreshTokenAlgorithm,
            TokenType.ConfirmLink => confirmationLinksAlgorithm
        };
    }

    private long GetExpirationDate(TokenType type)
    {
        var offset = DateTimeOffset.UtcNow;
        return type switch
        {
            TokenType.Access => offset.AddMinutes(5).ToUnixTimeSeconds(),
            TokenType.Refresh => offset.AddDays(14).ToUnixTimeSeconds(),
            TokenType.ConfirmLink => offset.AddDays(1).ToUnixTimeSeconds()
        };
    }
}