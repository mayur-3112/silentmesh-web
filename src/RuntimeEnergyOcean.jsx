import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeEnergyOcean() {
  const ocean = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    ocean.current.rotation.z =
      Math.sin(t * 0.03) * 0.02;
  });

  return (
    <mesh
      ref={ocean}
      position={[0, -18, -60]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[500, 500, 64, 64]} />

      <meshBasicMaterial
        color="#00161a"
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
