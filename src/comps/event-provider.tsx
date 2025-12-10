import { useState } from "react";
import { EventProviderContext } from "../context/event-context";

export function EventProvider({children}: {children: React.ReactNode}) {
  const [events, setEvents] = useState<pct.Event[]>([]);
  return (
    <EventProviderContext.Provider value={{
      events,
      setEvents
    }}>
      {children}
    </EventProviderContext.Provider>
  );
}