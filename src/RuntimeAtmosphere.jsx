import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeAtmosphere() {
  const mesh = useRef();
  const zone = useRuntimeScroll((s) => s.zone);
  const { scene } = useThree();

  const containmentStartRef = useRef(0);
  const lastZoneRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mat = mesh.current.material;
    
    // Core breathe factor (synchronized with RuntimeCore)
    const breathe = 0.6 + Math.sin(t * 0.8) * 0.3;

    // Track when we enter the containment zone to trigger a flash
    if (zone === "containment" && lastZoneRef.current !== "containment") {
      containmentStartRef.current = t;
    }
    lastZoneRef.current = zone;

    const elapsed = t - containmentStartRef.current;
    // Red ignition flash: peaks at 1.0 and decays over 2 seconds
    const flash = zone === "containment" ? Math.max(0, Math.exp(-elapsed * 1.5)) : 0;

    // Emotional arc parameters per zone
    let targetOpacity = 0.04;
    let targetColor = new THREE.Color("#020d0b"); // dark void
    let targetFogNear = 8;
    let targetFogFar = 24;
    let targetFogColor = new THREE.Color("#05070b");
    
    switch (zone) {
      case "surface":
        targetOpacity = 0.04;
        targetColor = new THREE.Color("#020d0b");
        targetFogNear = 8;
        targetFogFar = 24;
        targetFogColor = new THREE.Color("#05070b");
        break;
      case "observation":
        targetOpacity = 0.08;
        targetColor = new THREE.Color("#041512"); // slight teal
        targetFogNear = 6;
        targetFogFar = 20;
        targetFogColor = new THREE.Color("#04080d");
        break;
      case "orchestration":
        targetOpacity = 0.15;
        targetColor = new THREE.Color("#00241f"); // rich cyber-teal glow
        targetFogNear = 4.5;
        targetFogFar = 16;
        targetFogColor = new THREE.Color("#011210");
        break;
      case "containment":
        targetOpacity = 0.22;
        targetColor = new THREE.Color("#2a0808"); // deep red
        targetFogNear = 3.0; // highly compressed
        targetFogFar = 10;
        targetFogColor = new THREE.Color("#120303");
        break;
      case "deep-runtime":
        targetOpacity = 0.06;
        targetColor = new THREE.Color("#020b12"); // calm navy
        targetFogNear = 7;
        targetFogFar = 22;
        targetFogColor = new THREE.Color("#05070c");
        break;
      default:
        targetOpacity = 0.04;
        targetColor = new THREE.Color("#020d0b");
        targetFogNear = 8;
        targetFogFar = 24;
        targetFogColor = new THREE.Color("#05070b");
    }

    // Apply breathing pulse and flash to target values for dynamic distortion
    const urgency = zone === "containment" ? 1.8 : zone === "orchestration" ? 1.3 : 1.0;
    const pulseFactor = breathe * 0.15 * urgency;

    // Ambient opacity pulses with core, spikes on flash
    const finalOpacity = targetOpacity + (pulseFactor * 0.03) + (flash * 0.1);
    mat.opacity += (finalOpacity - mat.opacity) * 0.02;
    mat.color.lerp(targetColor, 0.02);

    // Update scene fog dynamically
    if (scene.fog) {
      // During flash, contaminate fog with bright warning crimson!
      const flashColor = new THREE.Color("#ef4444");
      const currentFogColor = new THREE.Color();
      currentFogColor.lerpColors(targetFogColor, flashColor, flash);
      scene.fog.color.lerp(currentFogColor, 0.03);
      
      // Dynamic compression: fog moves closer/further as core breathes + flash compression
      const flashCompressionNear = flash * 1.5; // moves near plane closer
      const flashCompressionFar = flash * 4.0;  // moves far plane closer
      
      const dynamicNear = targetFogNear - (breathe * 0.3 * urgency) - flashCompressionNear;
      const dynamicFar = targetFogFar - (breathe * 1.0 * urgency) - flashCompressionFar;
      
      scene.fog.near += (dynamicNear - scene.fog.near) * 0.03;
      scene.fog.far += (dynamicFar - scene.fog.far) * 0.03;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, -15]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        color="#020d0b"
        transparent
        opacity={0.04}
      />
    </mesh>
  );
}
