import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeRefractionField() {
  const refraction = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    refraction.current.scale.setScalar(
      1 + Math.sin(t * 0.15) * 0.03
    );
  });

  return (
    <mesh
      ref={refraction}
      position={[0, 0, -12]}
    >
      <sphereGeometry args={[18, 64, 64]} />

      <meshBasicMaterial
        color="#66e3ff"
        transparent
        opacity={0.01}
        wireframe
      />
    </mesh>
  );
}
