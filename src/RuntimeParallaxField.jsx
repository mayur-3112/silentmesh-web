import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RuntimeParallaxField() {
  const near = useRef();
  const mid = useRef();
  const far = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    near.current.rotation.y = t * 0.02;
    mid.current.rotation.y = -t * 0.01;
    far.current.rotation.y = t * 0.004;
  });

  return (
    <>
      {/* near field */}
      <group ref={near}>
        <mesh position={[0, 0, -6]}>
          <ringGeometry args={[10, 10.1, 256]} />

          <meshBasicMaterial
            color="#00c9a7"
            transparent
            opacity={0.05}
          />
        </mesh>
      </group>

      {/* mid field */}
      <group ref={mid}>
        <mesh position={[0, 0, -14]}>
          <ringGeometry args={[18, 18.08, 256]} />

          <meshBasicMaterial
            color="#66e3ff"
            transparent
            opacity={0.03}
          />
        </mesh>
      </group>

      {/* far field */}
      <group ref={far}>
        <mesh position={[0, 0, -28]}>
          <ringGeometry args={[34, 34.2, 256]} />

          <meshBasicMaterial
            color="#00c9a7"
            transparent
            opacity={0.015}
          />
        </mesh>
      </group>
    </>
  );
}
