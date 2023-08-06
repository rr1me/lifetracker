namespace backend.JWT;

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

public class GenerationResult
{
    public string Token { get; }
    public long Expiration { get; }

    public GenerationResult(string token, long expiration)
    {
        Token = token;
        Expiration = expiration;
    }
}