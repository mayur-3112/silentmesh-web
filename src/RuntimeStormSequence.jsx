import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useRuntimeEvents } from "./RuntimeEventDirector";

export default function RuntimeStormSequence() {
  const storm = useRef();

  const activeEvent = useRuntimeEvents(
    (s) => s.activeEvent
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (activeEvent === "propagate") {
      storm.current.rotation.y += 0.01;

      storm.current.material.opacity =
        0.08 + Math.sin(t * 4) * 0.02;
    } else {
      storm.current.material.opacity = 0.01;
    }
  });

  return (
    <mesh ref={storm}>
      <torusGeometry args={[14, 0.8, 32, 400]} />

      <meshBasicMaterial
        color="#00c9a7"
        wireframe
        transparent
        opacity={0.01}
      />
    </mesh>
  );
}
