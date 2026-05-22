import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

import * as THREE from "three";

import vertexShader from "./shaders/runtimeFieldVertex.glsl";
import fragmentShader from "./shaders/runtimeFieldFragment.glsl";

const RuntimeMaterial = shaderMaterial(
  {
    uTime: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ RuntimeMaterial });

export default function RuntimeShaderField() {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
        ref.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -6, -20]}
    >
      <planeGeometry args={[120, 120, 96, 96]} />

      <runtimeMaterial
        ref={ref}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
