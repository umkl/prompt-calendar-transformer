import { useMemo } from "react";
import useEvents from "../hooks/useEvents";
import { DnDCalendar } from "../comps/dnd-calendar";

export default function Calendar(props: {highlightedDay: Date}) {
  const {events, updateEvents} = useEvents(); 
  const filteredEvents = useMemo(()=>{
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === props.highlightedDay.getDate();
    });
  }, [props.highlightedDay, events]);


  const handleEventMove = (eventId: string, newStart: Date) => {
    updateEvents((prevEvents: pct.Event[]) => {
      const movedEvent = prevEvents.find((e) => e.id === eventId)
      if (!movedEvent) return prevEvents

      const duration = movedEvent.end.getTime() - movedEvent.start.getTime()
      const newEnd = new Date(newStart.getTime() + duration)

      const updatedEvents = prevEvents.map((e) => (e.id === eventId ? { ...e, start: newStart, end: newEnd } : e))

      updatedEvents.sort((a, b) => {
        const timeDiff = a.start.getTime() - b.start.getTime()
        if (timeDiff === 0) {
          // If times are equal, prioritize the dragged event
          if (a.id === eventId) return -1
          if (b.id === eventId) return 1
          return 0
        }
        return timeDiff
      })

      // Cascade through events to resolve overlaps
      for (let i = 0; i < updatedEvents.length - 1; i++) {
        const currentEvent = updatedEvents[i]
        const nextEvent = updatedEvents[i + 1]

        if (
          currentEvent.end.getTime() > nextEvent.start.getTime() ||
          currentEvent.start.getTime() === nextEvent.start.getTime()
        ) {
          // Move next event to start right after current event
          const eventDuration = nextEvent.end.getTime() - nextEvent.start.getTime()
          updatedEvents[i + 1] = {
            ...nextEvent,
            start: new Date(currentEvent.end.getTime()),
            end: new Date(currentEvent.end.getTime() + eventDuration),
          }
        }
      }

      return updatedEvents
    })
  }

  return <div className='h-full w-full overflow-visible'>
    <div className="h-[10px]"></div>
    <DnDCalendar events={filteredEvents} onFirstLoaded={
      function(firstElement: HTMLDivElement): void {
        console.log("Scrolling to first element:", firstElement);
        firstElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    } onEventMove={handleEventMove}/>
  </div>
}