import { useState } from "react";
import { EventProviderContext } from "../context/event-context";

export function EventProvider({children}: {children: React.ReactNode}) {
  const [events, setEvents] = useState<pct.Event[]>([]);
  const isLocalStorageStaleState = useState(true);
  return (
    <EventProviderContext.Provider value={{
      events,
      setEvents,
      isLocalStorageStaleState
    }}>
      {children}
    </EventProviderContext.Provider>
  );
}