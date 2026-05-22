import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { runtimeStates } from "./RuntimeStateMachine";
import { useRuntimeEnvironment } from "./RuntimeEnvironmentStore";

export default function RuntimeSignals() {
  const group = useRef();
  
  const activeState = useRuntimeEnvironment((s) => s.activeState);
  const current = runtimeStates[activeState];

  const signals = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      radius: 5 + Math.random() * 10,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 8,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    group.current.children.forEach((child, i) => {
      const s = signals[i];

      child.position.x =
        Math.cos(t * s.speed + s.offset) * s.radius;

      child.position.z =
        Math.sin(t * s.speed + s.offset) * s.radius;

      child.position.y = s.y;
    });
  });

  return (
    <group ref={group}>
      {signals.map((_, i) => (
        <mesh key={i} scale={1 + current.signalIntensity * 0.6}>
          <sphereGeometry args={[0.04, 16, 16]} />

          <meshBasicMaterial
            color="#00c9a7"
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}
