import { createContext } from "react";

type EventProviderState = {
  events: Array<pct.Event>;
  setEvents:  React.Dispatch<React.SetStateAction<pct.Event[]>>;
  isLocalStorageStaleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const initialState: EventProviderState = {
  events: [],
  setEvents: () => {},
  isLocalStorageStaleState: [true, () => {
    throw new Error("please wrap in EventProviderContext");
  }],
};

export const EventProviderContext = createContext<EventProviderState>(initialState);
