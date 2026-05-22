import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { runtimeStates } from "./RuntimeStateMachine";
import { useRuntimeEnvironment } from "./RuntimeEnvironmentStore";

export default function RuntimeContainment() {
  const containment = useRef();
  
  const activeState = useRuntimeEnvironment((s) => s.activeState);
  const current = runtimeStates[activeState];

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    containment.current.rotation.y = t * 0.08;

    containment.current.scale.setScalar(
      1 + Math.sin(t * 0.8) * 0.02
    );
  });

  return (
    <group ref={containment}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 5.7, 128]} />

        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={current.containmentOpacity}
          side={2}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0.8, 0]}>
        <ringGeometry args={[7.5, 7.55, 128]} />

        <meshBasicMaterial
          color="#66e3ff"
          transparent
          opacity={current.containmentOpacity * 0.66}
          side={2}
        />
      </mesh>
    </group>
  );
}
