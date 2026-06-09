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
      float pull = 0.15 * uCoreInfluence * (1.0 / (dist * 0.12 + 0.35));
      pos = pos - normalize(pos) * clamp(pull, 0.0, dist * 0.5);

      // 2. Wave propagation from the center
      float wave = sin(uTime * 1.8 - dist * 0.45) * 0.18 * uCoreInfluence;
      
      // Containment zone: glitchy/jittery height + horizontal vibration
      if (abs(uZone - 3.0) < 0.1) {
        float jitter = sin(uTime * 40.0 + dist * 20.0) * 0.08;
        pos.y += wave + jitter;
        pos.x += sin(uTime * 50.0) * 0.03;
      } else {
        // Normal breathing wave
        pos.y += wave;
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
      float maxRadius = 16.5;
      float distanceFade = clamp(1.0 - (vDistance / maxRadius), 0.0, 1.0);
      distanceFade = distanceFade * distanceFade;

      float alpha = uOpacity * distanceFade;
      
      vec3 finalColor = uColor;
      if (abs(vZone - 3.0) < 0.1) {
        // red warning glow mix
        finalColor = mix(uColor, vec3(0.95, 0.2, 0.2), 0.75);
      }

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

export default function RuntimeTopology() {
  const group = useRef();
  const materialsRef = useRef([]);
  const zone = useRuntimeScroll((s) => s.zone);

  const circles = [2.2, 4.5, 7.0, 10.0, 13.0, 16.0];
  const radialAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];

  const lines = useMemo(() => {
    const arr = [];
    
    // 1. Generate concentric circles with tech-style gap sectors
    circles.forEach((r) => {
      const points = [];
      const segments = 64; // High resolution circle path
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        
        // Skip sectors to create elegant scan gaps in the sonar grid
        const gap1 = angle > 0.6 && angle < 1.4;
        const gap2 = angle > 3.4 && angle < 4.2;
        if (gap1 || gap2) continue;
        
        points.push(new THREE.Vector3(Math.cos(angle) * r, -1.0, Math.sin(angle) * r));
      }
      if (points.length > 1) {
        arr.push({ points, isCircle: true, centerDist: r });
      }
    });

    // 2. Generate radial radar gridlines extending outward
    radialAngles.forEach((angle) => {
      const points = [];
      const segments = 16;
      const startR = 1.0;
      const endR = 17.0;
      for (let j = 0; j <= segments; j++) {
        const r = startR + (j / segments) * (endR - startR);
        points.push(new THREE.Vector3(Math.cos(angle) * r, -1.0, Math.sin(angle) * r));
      }
      arr.push({ points, isCircle: false, centerDist: (startR + endR) / 2 });
    });

    return arr;
  }, []);

  const geometries = useMemo(() => {
    return lines.map((line) => {
      const curve = new THREE.CatmullRomCurve3(line.points);
      return new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(line.isCircle ? 60 : 20)
      );
    });
  }, [lines]);

  const uniformInstances = useMemo(() => {
    return lines.map((line) => ({
      uTime: { value: 0 },
      uZone: { value: 0 },
      uCoreInfluence: { value: 0.1 },
      uColor: { value: new THREE.Color(line.isCircle ? "#00c9a7" : "#145246") },
      uOpacity: { value: 0 },
    }));
  }, [lines]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Slow planetary tilt rotation
    if (group.current) {
      group.current.rotation.y = t * 0.015;
      group.current.rotation.x = Math.sin(t * 0.03) * 0.03;
    }

    let zoneVal = 0.0;
    let influenceVal = 0.1;
    let baseOpacityInner = 0.0;
    let baseOpacityOuter = 0.0;

    switch (zone) {
      case "surface":
        zoneVal = 0.0;
        influenceVal = 0.1;
        baseOpacityInner = 0.35;
        baseOpacityOuter = 0.12;
        break;
      case "observation":
        zoneVal = 1.0;
        influenceVal = 0.4;
        baseOpacityInner = 0.45;
        baseOpacityOuter = 0.18;
        break;
      case "orchestration":
        zoneVal = 2.0;
        influenceVal = 0.9;
        baseOpacityInner = 0.7;
        baseOpacityOuter = 0.25;
        break;
      case "containment":
        zoneVal = 3.0;
        influenceVal = 1.6;
        baseOpacityInner = 0.85;
        baseOpacityOuter = 0.35;
        break;
      case "deep-runtime":
        zoneVal = 4.0;
        influenceVal = 0.4;
        baseOpacityInner = 0.4;
        baseOpacityOuter = 0.15;
        break;
      default:
        zoneVal = 0.0;
        influenceVal = 0.1;
        baseOpacityInner = 0.3;
        baseOpacityOuter = 0.1;
    }

    materialsRef.current.forEach((mat, i) => {
      if (!mat) return;
      const line = lines[i];
      mat.uniforms.uTime.value = t;
      mat.uniforms.uZone.value = zoneVal;
      mat.uniforms.uCoreInfluence.value = influenceVal;
      
      const distanceFade = Math.max(0.1, 1 - (line.centerDist / 17));
      const baseOpacity = line.isCircle ? baseOpacityInner : baseOpacityOuter;
      mat.uniforms.uOpacity.value = baseOpacity * distanceFade;
    });
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <line key={i} geometry={geometries[i]}>
          <shaderMaterial
            ref={(el) => (materialsRef.current[i] = el)}
            vertexShader={TopologyShader.vertexShader}
            fragmentShader={TopologyShader.fragmentShader}
            uniforms={uniformInstances[i]}
            transparent
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}
