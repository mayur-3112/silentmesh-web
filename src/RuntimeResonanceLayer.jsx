import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeResonanceLayer() {
  const resonance = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (resonance.current) {
        resonance.current.position.y = Math.sin(t * 0.2) * 0.4;
    }
  });

  return (
    <mesh ref={resonance} position={[0, -12, -30]}>
      <torusGeometry args={[22, 0.3, 32, 500]} />
      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.015}
      />
    </mesh>
  );
}
