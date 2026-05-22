import { detectRuntimeTier } from "./RuntimeDeviceAdaptation";

// Stubs for lower tiers
const LowRuntimeWorld = () => null;
const MediumRuntimeWorld = () => null;

export default function RuntimeAdaptiveRenderer({ children }) {
  const tier = detectRuntimeTier();

  return (
    <>
      {tier === "low" && <LowRuntimeWorld />}
      {tier === "medium" && <MediumRuntimeWorld />}
      {tier === "cinematic" && <>{children}</>}
    </>
  );
}
