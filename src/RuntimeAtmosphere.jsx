import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { runtimeStates } from "./RuntimeStateMachine";
import { useRuntimeEnvironment } from "./RuntimeEnvironmentStore";

export default function RuntimeAtmosphere() {
  const mesh = useRef();

  const activeState = useRuntimeEnvironment(
    (s) => s.activeState
  );

  const current = runtimeStates[activeState];

  useFrame(() => {
    mesh.current.material.opacity +=
      (current.fogDensity -
        mesh.current.material.opacity) *
      0.02;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -15]}>
      <planeGeometry args={[100, 100]} />

      <meshBasicMaterial
        color={current.glow}
        transparent
        opacity={0.1}
      />
    </mesh>
  );
}
