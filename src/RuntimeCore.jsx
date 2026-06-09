import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeCore() {
  const coreGroup = useRef();
  const lightRef = useRef();
  const pulseRef = useRef();
  
  const coreMeshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const nucleusRef = useRef();

  const zone = useRuntimeScroll((s) => s.zone);
  const containmentStartRef = useRef(0);
  const lastZoneRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Core group slow overall rotation
    if (coreGroup.current) {
      coreGroup.current.rotation.y = t * 0.06;
    }

    // Individual gyroscopic ring spinning
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.18;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.14;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.22;

    // Spin and breathe the wireframe core icosahedron
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x = t * 0.2;
      coreMeshRef.current.rotation.y = t * 0.28;
      coreMeshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.06);
    }

    if (zone === "containment" && lastZoneRef.current !== "containment") {
      containmentStartRef.current = t;
    }
    lastZoneRef.current = zone;

    const elapsed = t - containmentStartRef.current;
    // Core flare peaks high on entry and decays
    const flare = zone === "containment" ? Math.max(0, Math.exp(-elapsed * 1.8) * 12.0) : 0;

    // Core breathing light intensity
    const breathe = 0.6 + Math.sin(t * 0.8) * 0.3;
    const urgency = zone === "containment" ? 2.5 : zone === "orchestration" ? 1.4 : 1.0;
    
    if (lightRef.current) {
      lightRef.current.intensity = (4 + breathe * 6) * urgency + flare * 15.0;
    }

    // Determine target colors based on scroll zone
    let targetColor = new THREE.Color("#00c9a7"); // Cyber-teal default
    if (zone === "containment") {
      targetColor = new THREE.Color("#ef4444"); // Threat red
    } else if (zone === "orchestration") {
      targetColor = new THREE.Color("#00f0ff"); // Cyber-cyan
    }

    // Smoothly interpolate colors
    if (lightRef.current) lightRef.current.color.lerp(targetColor, 0.03);
    if (coreMeshRef.current) coreMeshRef.current.material.color.lerp(targetColor, 0.03);
    if (ring1Ref.current) ring1Ref.current.material.color.lerp(targetColor, 0.03);
    if (ring2Ref.current) ring2Ref.current.material.color.lerp(targetColor, 0.03);
    if (ring3Ref.current) ring3Ref.current.material.color.lerp(targetColor, 0.03);
    if (nucleusRef.current) nucleusRef.current.material.color.lerp(targetColor, 0.03);

    // Volumetric pulse sphere breathing
    if (pulseRef.current) {
      pulseRef.current.material.opacity = 0.015 + (breathe * 0.02) + (flare * 0.04);
      pulseRef.current.scale.setScalar(2.6 + Math.sin(t * 0.6) * 0.15 + (flare * 0.8));
    }
  });

  return (
    <group ref={coreGroup}>
      {/* Dynamic core light source */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={8}
        color="#00c9a7"
        distance={25}
        decay={2}
      />

      {/* 1. Central Nucleus (Representing Kernel Data State) */}
      <mesh ref={nucleusRef}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshBasicMaterial color="#00c9a7" transparent opacity={0.85} />
      </mesh>

      {/* 2. Brutalist Icosahedron Wireframe Shell */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#00c9a7" wireframe transparent opacity={0.38} />
      </mesh>

      {/* 3. Ring 1 (Horizontal - Y-Axis Gyro) */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 16, 120]} />
        <meshBasicMaterial color="#00c9a7" transparent opacity={0.42} />
      </mesh>

      {/* 4. Ring 2 (Tilted - X-Axis Gyro) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2 + 0.4, 0.25, 0]}>
        <torusGeometry args={[1.9, 0.035, 12, 90]} />
        <meshBasicMaterial color="#00c9a7" transparent opacity={0.32} />
      </mesh>

      {/* 5. Ring 3 (Tilted - Z-Axis Gyro) */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 2 - 0.3, -0.2, 0.35]}>
        <torusGeometry args={[1.35, 0.025, 12, 80]} />
        <meshBasicMaterial color="#00c9a7" transparent opacity={0.24} />
      </mesh>

      {/* 6. Volumetric Breathing Atmosphere Pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00c9a7" transparent opacity={0.02} />
      </mesh>
    </group>
  );
}
