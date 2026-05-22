import { useEffect } from "react";

export default function RuntimeTelemetryBridge() {
  useEffect(() => {
    async function connect() {
      console.log("Runtime telemetry layer connected");
    }

    connect();
  }, []);

  return null;
}
