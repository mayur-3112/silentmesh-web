import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RuntimeCursorField() {
  const field = useRef();
  const mouse = useRef(new THREE.Vector3());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useFrame((state) => {
    if (isMobile || !field.current) return;
    
    // Convert 2D screen coordinate [-1, 1] to 3D world coordinate
    mouse.current.x = (state.mouse.x * state.viewport.width) / 2;
    mouse.current.y = (state.mouse.y * state.viewport.height) / 2;
    
    field.current.position.lerp(mouse.current, 0.08);
  });

  if (isMobile) return null;

  return (
    <mesh ref={field}>
      <sphereGeometry args={[1.2, 16, 16]} />
      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}
