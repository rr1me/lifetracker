namespace backend.Entities;

public class Event
{
    public int Start { get; set; }
    public int End { get; set; }
    public string Description { get; set; }

    public Event(int start, int end, string description)
    {
        Start = start;
        End = end;
        Description = description;
    }
}