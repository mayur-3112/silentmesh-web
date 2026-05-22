import { useEffect } from "react";
import { create } from "zustand";

import { runtimeEvents } from "./RuntimeEventTimeline";

export const useRuntimeEvents = create((set) => ({
  activeEvent: "wake",

  setEvent: (event) =>
    set({
      activeEvent: event,
    }),
}));

export default function RuntimeEventDirector() {
  const setEvent = useRuntimeEvents(
    (s) => s.setEvent
  );

  useEffect(() => {
    let current = 0;

    const cycle = () => {
      const event = runtimeEvents[current];

      setEvent(event.id);

      setTimeout(() => {
        current++;

        if (current >= runtimeEvents.length) {
          current = 0;
        }

        cycle();
      }, event.duration);
    };

    cycle();
  }, []);

  return null;
}
