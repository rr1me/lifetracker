namespace backend.Entities;

public class Event
{
    public long Start { get; set; }
    public long End { get; set; }
    public string Description { get; set; }

    public Event(long start, long end, string description)
    {
        Start = start;
        End = end;
        Description = description;
    }
}