namespace backend;

public class ApiResult
{
    public int StatusCode { get; }
    public object Result { get; }

    public ApiResult(int statusCode, object result)
    {
        StatusCode = statusCode;
        Result = result;
    }
}