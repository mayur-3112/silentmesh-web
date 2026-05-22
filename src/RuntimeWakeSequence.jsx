import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useRuntimeEvents } from "./RuntimeEventDirector";

export default function RuntimeWakeSequence() {
  const wake = useRef();

  const activeEvent = useRuntimeEvents(
    (s) => s.activeEvent
  );

  useFrame(() => {
    if (!wake.current) return;

    if (activeEvent === "wake") {
      wake.current.material.opacity +=
        (0.12 - wake.current.material.opacity) *
        0.02;
    } else {
      wake.current.material.opacity +=
        (0.02 - wake.current.material.opacity) *
        0.02;
    }
  });

  return (
    <mesh ref={wake}>
      <sphereGeometry args={[8, 64, 64]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.02}
      />
    </mesh>
  );
}
