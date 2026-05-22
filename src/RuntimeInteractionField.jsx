import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeInteractionField() {
  const field = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    field.current.rotation.z =
      Math.sin(t * 0.1) * 0.08;

    field.current.rotation.x =
      Math.cos(t * 0.08) * 0.04;
  });

  return (
    <mesh ref={field}>
      <torusGeometry args={[9, 0.03, 32, 400]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.05}
      />
    </mesh>
  );
}
