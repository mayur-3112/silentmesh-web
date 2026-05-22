import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeScaleEscalation() {
  const scale = useRef();

  const zone = useRuntimeScroll(
    (s) => s.zone
  );

  useFrame(() => {
    let target = 1;

    if (zone === "orchestration") {
      target = 1.3;
    }

    if (zone === "containment") {
      target = 1.8;
    }

    if (zone === "deep-runtime") {
      target = 2.4;
    }

    scale.current.scale.x +=
      (target -
        scale.current.scale.x) *
      0.02;

    scale.current.scale.y +=
      (target -
        scale.current.scale.y) *
      0.02;

    scale.current.scale.z +=
      (target -
        scale.current.scale.z) *
      0.02;
  });

  return (
    <group ref={scale} />
  );
}
