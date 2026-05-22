export function detectRuntimeTier() {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  if (memory <= 2 || cores <= 2) {
    return "low";
  }

  if (memory <= 4 || cores <= 4) {
    return "medium";
  }

  return "cinematic";
}
