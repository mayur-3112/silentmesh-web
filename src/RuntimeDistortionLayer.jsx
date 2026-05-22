import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeDistortionLayer() {
  const layer = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    layer.current.rotation.z =
      Math.sin(t * 0.04) * 0.06;

    layer.current.position.y =
      Math.sin(t * 0.1) * 0.8;
  });

  return (
    <mesh
      ref={layer}
      position={[0, 0, -30]}
    >
      <planeGeometry args={[180, 120]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.015}
      />
    </mesh>
  );
}
