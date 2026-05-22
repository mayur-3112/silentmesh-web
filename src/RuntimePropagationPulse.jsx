import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RuntimePropagationPulse() {
  const pulse = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const scale =
      1 + ((t * 0.4) % 4);

    pulse.current.scale.setScalar(scale);

    pulse.current.material.opacity =
      0.12 - scale * 0.02;
  });

  return (
    <mesh
      ref={pulse}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[1.2, 1.3, 128]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.08}
        side={2}
      />
    </mesh>
  );
}
