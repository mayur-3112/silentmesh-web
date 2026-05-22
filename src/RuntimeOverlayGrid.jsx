export default function RuntimeOverlayGrid() {
  return (
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "120px 120px",
      }}
    />
  );
}
