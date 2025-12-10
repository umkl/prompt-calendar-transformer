import { createContext } from "react";

type EventProviderState = {
  events: Array<pct.Event>;
  setEvents:  React.Dispatch<React.SetStateAction<pct.Event[]>>;
}

export const initialState: EventProviderState = {
  events: [],
  setEvents: () => {
  },
};

export const EventProviderContext = createContext<EventProviderState>(initialState);
