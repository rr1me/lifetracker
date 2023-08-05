using StackExchange.Redis;

namespace backend.Db;

public class RedisContext
{
    private readonly ConnectionMultiplexer _connection;

    public RedisContext() => _connection = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect("91.233.169.34:7080, password=rrp4ss")).Value;

    public string GetValue(string key) => _connection.GetDatabase().StringGet(key);

    public void SetValue(string key, string value, DateTime? expiration = null)
    {
        var db = _connection.GetDatabase();
        db.StringSet(key, value);

        if (expiration != null)
        {
            db.KeyExpire(key, expiration);
        }
    }

    public bool KeyExist(string key) => _connection.GetDatabase().KeyExists(key);

    public void DeleteKey(string key) => _connection.GetDatabase().KeyDelete(key);

    public void CloseConnection() => _connection.Close();
}