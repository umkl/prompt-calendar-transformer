import { useContext, useEffect, type SetStateAction } from "react";
import { EventProviderContext } from "../context/event-context";
import { retrieveObjectFromLocalStorage, storeObjectInLocalStorage } from "../repo/local-storage";
import { persistKey } from "../const/local-storage";
import parseObjectToEvent from "../lib/parse-object-to-event";

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
          setEvents(persistedData.map(event=>{
            return parseObjectToEvent(event as unknown) as pct.Event;
          }));
        }
      }catch(e: Error | unknown){
        console.error("No persisted data found in localStorage", e);
      }
    }
  }, []);

  const [isLocalStorageStale, setIsLocalStorageStale] = useContext(EventProviderContext).isLocalStorageStaleState;

  return {
    events,
    insertEvent(event: pct.Event) {
      setEvents((prev) => [...prev, event]);
      setIsLocalStorageStale(true);
    },
    updateEvents(value: SetStateAction<pct.Event[]>){
      setEvents(value);
      setIsLocalStorageStale(true);
    },
    persistInLocalStorageAction(){
      storeObjectInLocalStorage(persistKey, events);
      setIsLocalStorageStale(false);
    },
    isLocalStorageStale
  };
}
