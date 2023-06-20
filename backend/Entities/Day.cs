using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Entities;

public class Day
{
    [Key][JsonIgnore] public int Id { get; set; }
    public string Month { get; set; }
    public ICollection<Event> Events { get; set; }

    public Day(string month, ICollection<Event> events)
    {
        Month = month;
        Events = events;
    }
}