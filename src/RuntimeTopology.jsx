import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { runtimeStates } from "./RuntimeStateMachine";
import { useRuntimeEnvironment } from "./RuntimeEnvironmentStore";

export default function RuntimeTopology() {
  const group = useRef();
  
  const activeState = useRuntimeEnvironment((s) => s.activeState);
  const current = runtimeStates[activeState];

  const lines = useMemo(() => {
    const arr = [];

    for (let i = 0; i < 80; i++) {
      const points = [];

      for (let j = 0; j < 6; j++) {
        points.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          )
        );
      }

      arr.push(points);
    }

    return arr;
  }, []);

  useFrame((state) => {
    group.current.rotation.y =
      state.clock.elapsedTime * 0.03;

    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <group ref={group}>
      {lines.map((points, i) => {
        const curve = new THREE.CatmullRomCurve3(points);

        const geometry = new THREE.BufferGeometry().setFromPoints(
          curve.getPoints(100)
        );

        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color="#00c9a7"
              transparent
              opacity={current.topologyOpacity}
            />
          </line>
        );
      })}
    </group>
  );
}
