import { useEffect } from "react";
import { useRuntimeAudio } from "./RuntimeAudioStore";

export default function RuntimeAudioEngine() {
  const setIntensity = useRuntimeAudio((s) => s.setIntensity);

  useEffect(() => {
    const audio = new Audio("/audio/deep_hum.mp3");

    audio.loop = true;
    audio.volume = 0.25;

    audio.play().catch(() => {});

    const interval = setInterval(() => {
      setIntensity(0.3 + Math.random() * 0.7);
    }, 1200);

    return () => {
      audio.pause();
      clearInterval(interval);
    };
  }, [setIntensity]);

  return null;
}
