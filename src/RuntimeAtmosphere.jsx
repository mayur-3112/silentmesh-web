import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeAtmosphere() {
  const mesh = useRef();
  const zone = useRuntimeScroll((s) => s.zone);

  useFrame(() => {
    const mat = mesh.current.material;

    // Emotional arc per zone
    let targetOpacity, targetColor;
    
    switch (zone) {
      case "surface":
        targetOpacity = 0.06;
        targetColor = new THREE.Color("#0a2f2a"); // cool, distant
        break;
      case "observation":
        targetOpacity = 0.09;
        targetColor = new THREE.Color("#0d3b35"); // slight warmth
        break;
      case "orchestration":
        targetOpacity = 0.14;
        targetColor = new THREE.Color("#00c9a7"); // intensity rises
        break;
      case "containment":
        targetOpacity = 0.18;
        targetColor = new THREE.Color("#3d1515"); // RED warning atmosphere
        break;
      case "deep-runtime":
        targetOpacity = 0.08;
        targetColor = new THREE.Color("#0f2b3d"); // calm stabilization
        break;
      default:
        targetOpacity = 0.06;
        targetColor = new THREE.Color("#0a2f2a");
    }

    mat.opacity += (targetOpacity - mat.opacity) * 0.015;
    mat.color.lerp(targetColor, 0.015);
  });

  return (
    <mesh ref={mesh} position={[0, 0, -15]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        color="#0a2f2a"
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}
