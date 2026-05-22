import { create } from "zustand";

export const useRuntimeEnvironment = create((set) => ({
  activeState: 0,

  setState: (index) =>
    set({
      activeState: index,
    }),
}));
