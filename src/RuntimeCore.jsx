import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeCore() {
  const core = useRef();
  const lightRef = useRef();
  const pulseRef = useRef();
  const zone = useRuntimeScroll((s) => s.zone);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    core.current.rotation.y = t * 0.12;
    core.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);

    // Core breathing light — the orb shapes the world
    const breathe = 0.6 + Math.sin(t * 0.8) * 0.3;
    const urgency = zone === "containment" ? 2.5 : zone === "orchestration" ? 1.4 : 1.0;
    lightRef.current.intensity = (4 + breathe * 6) * urgency;

    // Shift light color based on zone for emotional arc
    if (zone === "containment") {
      lightRef.current.color.lerp(new THREE.Color("#ef4444"), 0.02);
    } else if (zone === "orchestration") {
      lightRef.current.color.lerp(new THREE.Color("#00e5ff"), 0.02);
    } else {
      lightRef.current.color.lerp(new THREE.Color("#00c9a7"), 0.02);
    }

    // Atmospheric pulse breathes with the light
    pulseRef.current.material.opacity = 0.02 + breathe * 0.03;
    pulseRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.08);
  });

  return (
    <group ref={core}>
      {/* Core influence light — drives fog density and illuminates topology */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={8}
        color="#00c9a7"
        distance={25}
        decay={2}
      />

      {/* outer orchestration ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.8, 0.03, 32, 300]} />
        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* second ring */}
      <mesh rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[2.9, 0.02, 32, 200]} />
        <meshBasicMaterial
          color="#66e3ff"
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* orchestration sphere */}
      <mesh>
        <icosahedronGeometry args={[1.4, 6]} />
        <meshStandardMaterial
          color="#00c9a7"
          emissive="#00c9a7"
          emissiveIntensity={2.5}
          wireframe
        />
      </mesh>

      {/* atmospheric pulse — breathes in sync with light */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={0.03}
        />
      </mesh>
    </group>
  );
}
