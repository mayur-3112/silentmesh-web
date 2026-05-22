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

    for (let i = 0; i < 40; i++) {
      const points = [];
      
      // Density function: cluster near core, sparse at edges
      // Some lines are "inner" (dense, short), some are "outer" (sparse, long)
      const isInner = Math.random() < 0.4;
      const radius = isInner ? 8 : 22;
      const segments = isInner ? 8 : 5;
      
      // Create dead zones — skip generation in certain angular regions
      const angle = Math.random() * Math.PI * 2;
      const deadZone1 = angle > 1.2 && angle < 1.8;
      const deadZone2 = angle > 3.8 && angle < 4.5;
      if (deadZone1 || deadZone2) continue;

      for (let j = 0; j < segments; j++) {
        const spread = isInner ? 0.6 : 1.0;
        points.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * radius * spread,
            (Math.random() - 0.5) * radius * 0.6,
            (Math.random() - 0.5) * radius * 0.8
          )
        );
      }

      // Store distance from center for opacity variation
      const centerDist = points.reduce((sum, p) => sum + p.length(), 0) / points.length;
      arr.push({ points, centerDist, isInner });
    }

    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.025;
    group.current.rotation.x = Math.sin(t * 0.06) * 0.06;
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => {
        const curve = new THREE.CatmullRomCurve3(line.points);
        const geometry = new THREE.BufferGeometry().setFromPoints(
          curve.getPoints(line.isInner ? 50 : 30)
        );

        // Brighter near core, fading to nothing at edges
        const distanceFade = Math.max(0.1, 1 - (line.centerDist / 14));
        const opacity = current.topologyOpacity * distanceFade;

        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color={line.isInner ? "#00c9a7" : "#1a6b5a"}
              transparent
              opacity={opacity}
            />
          </line>
        );
      })}
    </group>
  );
}
