import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeStormField() {
  const storm = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    storm.current.rotation.y =
      t * 0.03;

    storm.current.rotation.x =
      Math.sin(t * 0.1) * 0.2;
  });

  return (
    <mesh
      ref={storm}
      position={[0, 0, -25]}
    >
      <torusGeometry args={[14, 1.2, 32, 300]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        wireframe
        opacity={0.025}
      />
    </mesh>
  );
}
