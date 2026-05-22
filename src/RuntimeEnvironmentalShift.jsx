import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeEnvironmentalShift() {
  const env = useRef();

  const zone = useRuntimeScroll(
    (s) => s.zone
  );

  useFrame(() => {
    if (!env.current) return;

    let target = 0.02;

    if (zone === "orchestration") {
      target = 0.06;
    }

    if (zone === "containment") {
      target = 0.1;
    }

    if (zone === "deep-runtime") {
      target = 0.16;
    }

    env.current.material.opacity +=
      (target -
        env.current.material.opacity) *
      0.02;
  });

  return (
    <mesh
      ref={env}
      position={[0, 0, -50]}
    >
      <planeGeometry args={[200, 120]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.02}
      />
    </mesh>
  );
}
