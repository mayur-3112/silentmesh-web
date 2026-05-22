import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeNebula() {
  const nebula = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    nebula.current.rotation.z =
      Math.sin(t * 0.02) * 0.04;
  });

  return (
    <mesh
      ref={nebula}
      position={[0, 0, -55]}
    >
      <planeGeometry args={[180, 120]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.035}
      />
    </mesh>
  );
}
