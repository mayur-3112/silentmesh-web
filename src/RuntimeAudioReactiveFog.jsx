import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useRuntimeAudio } from "./RuntimeAudioStore";

export default function RuntimeAudioReactiveFog() {
  const fog = useRef();
  const intensity = useRuntimeAudio((s) => s.intensity);

  useFrame(() => {
    if (fog.current) {
        fog.current.material.opacity +=
        (0.02 + intensity * 0.04 - fog.current.material.opacity) * 0.03;
    }
  });

  return (
    <mesh ref={fog} position={[0, 0, -45]}>
      <planeGeometry args={[220, 140]} />
      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.02}
      />
    </mesh>
  );
}
