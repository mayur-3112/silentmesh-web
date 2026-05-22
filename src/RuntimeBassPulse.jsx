import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useRuntimeAudio } from "./RuntimeAudioStore";

export default function RuntimeBassPulse() {
  const pulse = useRef();
  const intensity = useRuntimeAudio((s) => s.intensity);

  useFrame(() => {
    const scale = 1 + intensity * 0.12;
    if (pulse.current) {
        pulse.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={pulse}>
      <sphereGeometry args={[12, 64, 64]} />
      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.015}
      />
    </mesh>
  );
}
