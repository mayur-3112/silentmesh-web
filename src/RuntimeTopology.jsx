import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

const TopologyShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uZone;
    uniform float uCoreInfluence;
    varying float vDistance;
    varying float vZone;

    void main() {
      vec3 pos = position;
      float dist = length(pos);
      
      // 1. Gravity pull towards core (origin)
      float pull = 0.18 * uCoreInfluence * (1.0 / (dist * 0.15 + 0.4));
      pos = pos - normalize(pos) * clamp(pull, 0.0, dist * 0.6);

      // 2. Zone-based Ecosystem Animations
      if (abs(uZone - 0.0) < 0.1) {
        // Surface: dormant
        pos.y += sin(uTime * 0.5 + pos.x * 0.15) * 0.04;
      } else if (abs(uZone - 1.0) < 0.1) {
        // Observation: propagating waves
        pos.y += sin(uTime * 1.2 + pos.x * 0.25) * 0.09;
      } else if (abs(uZone - 2.0) < 0.1) {
        // Orchestration: active flowing waves
        pos.y += sin(uTime * 2.5 + pos.x * 0.4) * 0.2;
        pos.z += cos(uTime * 2.0 + pos.y * 0.3) * 0.15;
      } else if (abs(uZone - 3.0) < 0.1) {
        // Containment: contaminated glitch state
        float jitterX = sin(uTime * 45.0 + pos.y * 90.0) * 0.08;
        float jitterY = cos(uTime * 40.0 + pos.z * 80.0) * 0.08;
        pos.x += jitterX;
        pos.y += jitterY;
        pos = pos - normalize(pos) * (sin(uTime * 8.0) * 0.15);
      } else if (abs(uZone - 4.0) < 0.1) {
        // Deep-runtime: stabilized calm
        pos.y += sin(uTime * 0.4 + pos.x * 0.08) * 0.05;
      }

      vDistance = dist;
      vZone = uZone;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vDistance;
    varying float vZone;

    void main() {
      // distance-based fade (fades out at edges)
      float maxRadius = (abs(vZone - 3.0) < 0.1) ? 14.0 : 20.0;
      float distanceFade = clamp(1.0 - (vDistance / maxRadius), 0.0, 1.0);
      distanceFade = distanceFade * distanceFade;

      float alpha = uOpacity * distanceFade;
      
      vec3 finalColor = uColor;
      if (abs(vZone - 3.0) < 0.1) {
        // red warning glow mix
        finalColor = mix(uColor, vec3(0.95, 0.25, 0.25), 0.7);
      }

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

function TopologyLine({ points, isInner, centerDist }) {
  const zone = useRuntimeScroll((s) => s.zone);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(isInner ? 45 : 25)
    );
  }, [points, isInner]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uZone: { value: 0 },
    uCoreInfluence: { value: 0.1 },
    uColor: { value: new THREE.Color(isInner ? "#00c9a7" : "#145246") },
    uOpacity: { value: 0 },
  }), [isInner]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;

    let zoneVal = 0.0;
    let influenceVal = 0.1;
    let baseOpacity = 0.0;

    switch (zone) {
      case "surface":
        zoneVal = 0.0;
        influenceVal = 0.1;
        baseOpacity = isInner ? 0.2 : 0.06;
        break;
      case "observation":
        zoneVal = 1.0;
        influenceVal = 0.3;
        baseOpacity = isInner ? 0.3 : 0.1;
        break;
      case "orchestration":
        zoneVal = 2.0;
        influenceVal = 0.9;
        baseOpacity = isInner ? 0.6 : 0.2;
        break;
      case "containment":
        zoneVal = 3.0;
        influenceVal = 1.6;
        baseOpacity = isInner ? 0.75 : 0.25;
        break;
      case "deep-runtime":
        zoneVal = 4.0;
        influenceVal = 0.4;
        baseOpacity = isInner ? 0.25 : 0.08;
        break;
      default:
        zoneVal = 0.0;
        influenceVal = 0.1;
        baseOpacity = 0.1;
    }

    uniforms.uZone.value = zoneVal;
    uniforms.uCoreInfluence.value = influenceVal;
    uniforms.uOpacity.value = baseOpacity;
  });

  return (
    <line geometry={geometry}>
      <shaderMaterial
        vertexShader={TopologyShader.vertexShader}
        fragmentShader={TopologyShader.fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </line>
  );
}

export default function RuntimeTopology() {
  const group = useRef();

  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 35; i++) {
      const points = [];
      const isInner = Math.random() < 0.4;
      const radius = isInner ? 7 : 20;
      const segments = isInner ? 7 : 4;
      
      const angle = Math.random() * Math.PI * 2;
      
      // Giant darkness pockets / topology dead zones (Issue 2)
      const deadZone1 = angle > 0.8 && angle < 2.0;
      const deadZone2 = angle > 3.6 && angle < 4.8;
      if (deadZone1 || deadZone2) continue;

      for (let j = 0; j < segments; j++) {
        const spread = isInner ? 0.5 : 1.0;
        points.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * radius * spread,
            (Math.random() - 0.5) * radius * 0.5,
            (Math.random() - 0.5) * radius * 0.7
          )
        );
      }

      const centerDist = points.reduce((sum, p) => sum + p.length(), 0) / points.length;
      arr.push({ points, centerDist, isInner });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.02;
    group.current.rotation.x = Math.sin(t * 0.05) * 0.05;
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <TopologyLine
          key={i}
          points={line.points}
          isInner={line.isInner}
          centerDist={line.centerDist}
        />
      ))}
    </group>
  );
}
