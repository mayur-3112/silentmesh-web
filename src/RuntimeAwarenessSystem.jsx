import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeAwarenessSystem() {
  const awareness = useRef();

  useFrame((state) => {
    awareness.current.position.x =
      state.mouse.x * 2;

    awareness.current.position.y =
      state.mouse.y * 1.2;
  });

  return (
    <mesh
      ref={awareness}
      position={[0, 0, -4]}
    >
      <sphereGeometry args={[0.8, 64, 64]} />

      <meshBasicMaterial
        color="#66e3ff"
        transparent
        opacity={0.03}
      />
    </mesh>
  );
}
