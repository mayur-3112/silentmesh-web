import { useFrame } from "@react-three/fiber";
import { scrollZones } from "./RuntimeScrollZones";
import { create } from "zustand";

export const useRuntimeScroll = create((set) => ({
  zone: "surface",
  setZone: (zone) => set({ zone }),
}));

export default function RuntimeScrollDirector() {
  const setZone = useRuntimeScroll((s) => s.setZone);

  useFrame(() => {
    const spacerHeight = window.innerHeight * 2.5;
    const offset = Math.min(0.999, window.scrollY / spacerHeight);

    for (const zone of scrollZones) {
      if (offset >= zone.start && offset < zone.end) {
        setZone(zone.id);
      }
    }
  });

  return null;
}
