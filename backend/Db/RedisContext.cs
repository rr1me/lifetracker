using StackExchange.Redis;

namespace backend.Db;

public class RedisContext
{
    public void TryItOn()
    {
        var redis = ConnectionMultiplexer.Connect("91.233.169.34:7080, password=rrp4ss");
        var db = redis.GetDatabase();
        db.KeyDelete("foo");
    }
}