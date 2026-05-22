import { gsap } from "gsap";

export default function RuntimeTransitionOrchestrator() {
  gsap.defaults({
    ease: "power3.out",
    duration: 1.4,
  });

  return null;
}
