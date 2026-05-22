import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

export default function RuntimeLensEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.8}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
      />

      <Noise opacity={0.015} />

      <Vignette
        eskil={false}
        offset={0.15}
        darkness={0.8}
      />
    </EffectComposer>
  );
}
