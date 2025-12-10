import { useContext, useEffect } from "react";
import { EventProviderContext } from "../context/event-context";

export default function useEvents() {
  const {events, setEvents} = useContext(EventProviderContext);
  useEffect(() => {
    const url = new URL(window.location.href);
    let urlCalendar: string | undefined;
    urlCalendar = url.pathname;
    if (!urlCalendar || urlCalendar === "/")
      urlCalendar = sessionStorage.getItem("calendar") || undefined;
  }, []);

  return {
    events,
    insertEvent(event: pct.Event) {
      setEvents((prev) => [...prev, event]);
    },
  };
}
