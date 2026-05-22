import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function RuntimeCustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    document.body.style.cursor = "none";

    const dot = dotRef.current;
    const ring = ringRef.current;

    const moveCursor = (e) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });

      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const handleHover = () => {
      gsap.to(ring, {
        scale: 1.5,
        borderColor: "rgba(0, 201, 167, 0.8)",
        backgroundColor: "rgba(0, 201, 167, 0.1)",
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 0,
        duration: 0.2,
      });
    };

    const handleLeave = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        backgroundColor: "transparent",
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.2,
      });
    };

    const onMouseOver = (e) => {
      const target = e.target.closest("a, button, input, select, textarea, [data-cursor='hover']");
      if (target) {
        handleHover();
        target.style.cursor = "none";
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest("a, button, input, select, textarea, [data-cursor='hover']");
      if (target) {
        handleLeave();
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 transition-colors"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00c9a7]"
      />
    </>
  );
}
