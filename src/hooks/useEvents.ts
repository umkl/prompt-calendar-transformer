import { useContext, useEffect } from "react";
import { EventProviderContext } from "../context/event-context";
import { retrieveObjectFromLocalStorage } from "../repo/local-storage";
import { persistKey } from "../const/local-storage";

export default function useEvents() {
  const {events, setEvents} = useContext(EventProviderContext);
  useEffect(() => {
    const url = new URL(window.location.href);
    const slugCalendarId: string | undefined  = url.pathname;
    if (!slugCalendarId || slugCalendarId === "/"){
      // localstorage persistence
      try {
        const persistedData = retrieveObjectFromLocalStorage<pct.Event[]>(persistKey);
        if(persistedData instanceof Array){
          setEvents(persistedData);
        }
      }catch(e: Error | unknown){
        console.error("No persisted data found in localStorage", e);
      }
    }

  }, []);

  return {
    events,
    insertEvent(event: pct.Event) {
      setEvents((prev) => [...prev, event]);
    },
  };
}
