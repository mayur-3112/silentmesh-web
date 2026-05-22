import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RuntimeParticles() {
  const particles = useRef();

  useFrame((state) => {
    particles.current.rotation.y =
      state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particles}>
      <sphereGeometry args={[12, 64, 64]} />

      <pointsMaterial
        color="#00c9a7"
        size={0.03}
        transparent
        opacity={0.5}
      />
    </points>
  );
}
