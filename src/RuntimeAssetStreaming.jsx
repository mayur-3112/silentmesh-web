export async function preloadRuntimeAssets() {
  const assets = [
    "/audio/deep_hum.mp3",
    "/shaders/runtimeFieldFragment.glsl",
  ];

  try {
    await Promise.all(
      assets.map((src) => fetch(src))
    );
  } catch (e) {
    console.warn("Failed to preload assets", e);
  }
}
