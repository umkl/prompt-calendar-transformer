import { useMemo } from "react";
import useEvents from "../hooks/useEvents";
import { DnDCalendar } from "../comps/dnd-calendar";

export default function Calendar(props: {highlightedDay: Date}) {
  const {events} = useEvents(); 
  const filteredEvents = useMemo(()=>{
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === props.highlightedDay.getDate();
    });
  }, [props.highlightedDay, events]);

  return <div className='h-full w-full' >
    <p className="mb-4">{props.highlightedDay.toDateString()}</p>
    <DnDCalendar events={filteredEvents} onFirstLoaded={
      function(firstElement: HTMLDivElement): void {
        console.log("Scrolling to first element:", firstElement);
        firstElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    } onEventMove={function (eventId: string, newStart: Date): void {
      // throw new Error("Function not implemented.");
      console.log("Event moved:", eventId, newStart);
    } }/>
  </div>
}