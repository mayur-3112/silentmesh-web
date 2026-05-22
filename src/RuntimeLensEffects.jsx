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
        intensity={2.2}
        luminanceThreshold={0.12}
        luminanceSmoothing={0.95}
      />

      <Noise opacity={0.018} />

      <Vignette
        eskil={false}
        offset={0.1}
        darkness={1.1}
      />
    </EffectComposer>
  );
}
