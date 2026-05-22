import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useRuntimeEvents } from "./RuntimeEventDirector";

export default function RuntimeContainmentEvent() {
  const containment = useRef();

  const activeEvent = useRuntimeEvents(
    (s) => s.activeEvent
  );

  useFrame(() => {
    if (!containment.current) return;

    if (activeEvent === "containment") {
      containment.current.scale.x +=
        (1.8 - containment.current.scale.x) *
        0.03;

      containment.current.scale.y +=
        (1.8 - containment.current.scale.y) *
        0.03;

      containment.current.material.opacity +=
        (0.2 - containment.current.material.opacity) *
        0.03;
    } else {
      containment.current.scale.x +=
        (1 - containment.current.scale.x) *
        0.03;

      containment.current.scale.y +=
        (1 - containment.current.scale.y) *
        0.03;

      containment.current.material.opacity +=
        (0.04 - containment.current.material.opacity) *
        0.03;
    }
  });

  return (
    <mesh
      ref={containment}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[6, 6.15, 256]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.04}
      />
    </mesh>
  );
}
