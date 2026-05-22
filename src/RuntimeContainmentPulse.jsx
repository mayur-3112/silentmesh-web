import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeContainmentPulse() {
  const groupRef = useRef();
  const [triggered, setTriggered] = useState(false);
  const [active, setActive] = useState(false);
  const startTimeRef = useRef(0);
  const zone = useRuntimeScroll((s) => s.zone);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Trigger ONCE when entering containment zone
    if (zone === "containment" && !triggered) {
      setTriggered(true);
      setActive(true);
      startTimeRef.current = state.clock.elapsedTime;
    }

    // Reset trigger when leaving containment
    if (zone !== "containment" && triggered) {
      setTriggered(false);
    }

    if (active) {
      const elapsed = state.clock.elapsedTime - startTimeRef.current;
      const duration = 2.2;
      const progress = Math.min(elapsed / duration, 1);

      // Fast initial explosion, slow final expansion
      const eased = 1 - Math.pow(1 - progress, 4);

      // Animate the three concentric rings
      groupRef.current.children.forEach((child, index) => {
        // Stagger the final scale: outer is largest, inner is smallest
        const maxScale = index === 0 ? 32 : index === 1 ? 26 : 20;
        const scale = eased * maxScale;
        child.scale.setScalar(scale);

        // Opacity: rapid flash, then slow linear decay
        const opacity = progress < 0.1
          ? (progress / 0.1) * 0.7
          : Math.max(0, 0.7 * (1 - (progress - 0.1) / 0.9));
        
        child.material.opacity = opacity;
      });

      if (progress >= 1) {
        setActive(false);
      }
    } else {
      // Inactive: keep everything hidden and minimized
      groupRef.current.children.forEach((child) => {
        if (child.material) child.material.opacity = 0;
        child.scale.setScalar(0.01);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ring 1 - horizontal */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.03, 16, 128]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ring 2 - tilted X */}
      <mesh rotation={[Math.PI / 2 + 0.35, 0.2, 0]}>
        <torusGeometry args={[0.85, 0.02, 16, 96]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ring 3 - tilted Y */}
      <mesh rotation={[Math.PI / 2 - 0.25, -0.3, 0.15]}>
        <torusGeometry args={[0.7, 0.015, 16, 80]} />
        <meshBasicMaterial
          color="#fda4af"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
