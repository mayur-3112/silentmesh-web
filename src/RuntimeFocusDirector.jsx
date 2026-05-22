import { useFrame } from "@react-three/fiber";

import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeFocusDirector() {
  const zone = useRuntimeScroll(
    (s) => s.zone
  );

  useFrame((state) => {
    if (zone === "surface") {
      state.camera.lookAt(0, 0, 0);
    }

    if (zone === "observation") {
      state.camera.lookAt(0, 1, -4);
    }

    if (zone === "orchestration") {
      state.camera.lookAt(2, 0, -8);
    }

    if (zone === "containment") {
      state.camera.lookAt(-3, 0, -14);
    }

    if (zone === "deep-runtime") {
      state.camera.lookAt(0, -2, -20);
    }
  });

  return null;
}
