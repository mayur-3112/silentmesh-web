import { create } from "zustand";

export const useRuntimeQuality = create(
  (set) => ({
    quality: "high",

    setQuality: (q) =>
      set({
        quality: q,
      }),
  })
);
