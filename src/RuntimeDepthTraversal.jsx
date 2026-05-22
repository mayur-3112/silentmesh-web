import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeDepthTraversal() {
  const zone = useRuntimeScroll(
    (s) => s.zone
  );

  useFrame((state, delta) => {
    let targetZ = 12;

    if (zone === "observation") {
      targetZ = 10;
    }

    if (zone === "orchestration") {
      targetZ = 7;
    }

    if (zone === "containment") {
      targetZ = 5;
    }

    if (zone === "deep-runtime") {
      targetZ = 2;
    }

    easing.damp(
      state.camera.position,
      "z",
      targetZ,
      0.18,
      delta
    );
  });

  return null;
}
