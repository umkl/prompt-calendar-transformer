import { useEffect, useState } from "react";

export default function useEvents() {
  const [events, setEvents] = useState<pct.Event[]>([]);

  useEffect(() => {
    const url = new URL(window.location.href);
    let urlCalendar: string | undefined;
    urlCalendar = url.pathname;
    if (!urlCalendar || urlCalendar === "/")
      urlCalendar = sessionStorage.getItem("calendar") || undefined;
  }, []);

  return {
    events,
    insertEvent(events: pct.Event) {
      setEvents((prev) => [...prev, events]);
    },
  };
}
