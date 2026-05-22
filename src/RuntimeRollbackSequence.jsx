import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useRuntimeEvents } from "./RuntimeEventDirector";

export default function RuntimeRollbackSequence() {
  const rollback = useRef();

  const activeEvent = useRuntimeEvents(
    (s) => s.activeEvent
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (activeEvent === "rollback") {
      rollback.current.rotation.z -= 0.03;

      rollback.current.material.opacity =
        0.18 + Math.sin(t * 3) * 0.04;
    } else {
      rollback.current.material.opacity = 0.03;
    }
  });

  return (
    <mesh ref={rollback}>
      <torusGeometry args={[9, 0.04, 32, 300]} />

      <meshBasicMaterial
        color="#8ef7ff"
        transparent
        opacity={0.03}
      />
    </mesh>
  );
}
