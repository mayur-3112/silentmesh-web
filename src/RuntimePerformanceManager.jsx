import { PerformanceMonitor } from "@react-three/drei";

export default function RuntimePerformanceManager() {
  return (
    <PerformanceMonitor
      onDecline={() => {
        console.log(
          "Reducing runtime complexity"
        );
      }}
      onIncline={() => {
        console.log(
          "Increasing runtime quality"
        );
      }}
    />
  );
}
