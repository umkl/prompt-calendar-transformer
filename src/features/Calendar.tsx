import { useMemo } from "react";
import useEvents from "../hooks/useEvents";

export default function Calendar(props: {highlightedDay: Date}) {
  const {events} = useEvents(); 

  const filteredEvents = useMemo(()=>{
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === props.highlightedDay.getDate();
    });
  }, [props.highlightedDay, events]);

  return <div className='h-full w-full' >
    {filteredEvents.map((event, index) => (
      <div key={index}>
        <h3>{event.title}</h3>
        <p>
          {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
        </p>
      </div>
    ))}
  </div>
}