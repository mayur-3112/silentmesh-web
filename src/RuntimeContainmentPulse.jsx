import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeContainmentPulse() {
  const ringRef = useRef();
  const [triggered, setTriggered] = useState(false);
  const [active, setActive] = useState(false);
  const startTimeRef = useRef(0);
  const zone = useRuntimeScroll((s) => s.zone);

  useFrame((state) => {
    if (!ringRef.current) return;

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
      const duration = 2.5;
      const progress = Math.min(elapsed / duration, 1);

      // Rapid expansion with deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = eased * 25;

      // Opacity: flash bright then fade
      const opacity = progress < 0.15
        ? progress / 0.15 * 0.5
        : Math.max(0, 0.5 * (1 - (progress - 0.15) / 0.85));

      ringRef.current.scale.setScalar(scale);
      ringRef.current.material.opacity = opacity;

      if (progress >= 1) {
        setActive(false);
      }
    } else {
      ringRef.current.material.opacity = 0;
      ringRef.current.scale.setScalar(0.01);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.08, 16, 128]} />
      <meshBasicMaterial
        color="#ef4444"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
