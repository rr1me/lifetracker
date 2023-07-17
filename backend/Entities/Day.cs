using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Entities;

public class Day
{
    [Key][JsonIgnore] public int Id { get; set; }
    public float DateMark { get; set; }
    public int userId { get; set; }
    public int dayNumber { get; set; }
    public ICollection<Event> Events { get; set; }

    public Day(float dateMark, int userId, int dayNumber, ICollection<Event> events)
    {
        DateMark = dateMark;
        this.userId = userId;
        this.dayNumber = dayNumber;
        Events = events;
    }
}