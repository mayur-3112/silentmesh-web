import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { scrollZones } from "./RuntimeScrollZones";

import { create } from "zustand";

export const useRuntimeScroll = create((set) => ({
  zone: "surface",

  setZone: (zone) =>
    set({
      zone,
    }),
}));

export default function RuntimeScrollDirector() {
  const scroll = useScroll();

  const setZone = useRuntimeScroll(
    (s) => s.setZone
  );

  useFrame(() => {
    const offset = scroll.offset;

    for (const zone of scrollZones) {
      if (
        offset >= zone.start &&
        offset < zone.end
      ) {
        setZone(zone.id);
      }
    }
  });

  return null;
}
