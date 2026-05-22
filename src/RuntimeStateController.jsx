import { useEffect } from "react";
import { runtimeStates } from "./RuntimeStateMachine";
import { useRuntimeEnvironment } from "./RuntimeEnvironmentStore";

export default function RuntimeStateController() {
  const activeState = useRuntimeEnvironment(
    (s) => s.activeState
  );

  const setState = useRuntimeEnvironment(
    (s) => s.setState
  );

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current++;

      if (current >= runtimeStates.length) {
        current = 0;
      }

      setState(current);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
