import { create } from "zustand";

export const useRuntimeAudio = create((set) => ({
  intensity: 0,

  setIntensity: (v) =>
    set({
      intensity: v,
    }),
}));
