import useEvents from "../hooks/useEvents";

export default function Calendar(){
  const {events} = useEvents(); 
  return <div className="h-full w-full">
    {events.map((event, index) => (
      <div key={index}>
        <h3>{event.title}</h3>
        <p>
          {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
        </p>
      </div>
    ))}
  </div>
}