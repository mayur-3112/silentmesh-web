import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RuntimeParticles() {
  const particles = useRef();
  const count = 600;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;     // X: wide spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24; // Y: height spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 32; // Z: depth spread
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (particles.current) {
      // Slowly rotate the field on all three axes
      particles.current.rotation.y = t * 0.012;
      particles.current.rotation.x = Math.sin(t * 0.05) * 0.08;
      particles.current.rotation.z = Math.cos(t * 0.04) * 0.06;
      
      // Floating translation drift
      particles.current.position.y = Math.sin(t * 0.1) * 0.4;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00c9a7"
        size={0.035}
        sizeAttenuation={true}
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </points>
  );
}
