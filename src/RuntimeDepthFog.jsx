import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeDepthFog() {
  const fog = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    fog.current.material.opacity =
      0.04 +
      Math.sin(t * 0.2) * 0.01;
  });

  return (
    <mesh
      ref={fog}
      position={[0, 0, -35]}
    >
      <planeGeometry args={[200, 120]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.04}
      />
    </mesh>
  );
}
