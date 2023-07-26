using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class User
{
    [Key] public int Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public bool Confirmed { get; set; }
    
    public ICollection<Day>? Days { get; set; }

    public User()
    {
        Confirmed = false;
    }
}