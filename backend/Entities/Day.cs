using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Entities;

public class Day
{
    [Key][JsonIgnore] public int Id { get; set; }
    public double DateMark { get; set; }
    public User User { get; set; }
    public int dayNumber { get; set; }
    // public ICollection<Event> Events { get; set; }
}