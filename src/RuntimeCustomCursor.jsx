import { useEffect, useRef, useState } from "react";

export default function RuntimeCustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
      return mobile;
    };

    if (checkMobile()) return;

    document.body.style.cursor = "none";

    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId = null;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updatePosition = () => {
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    const handleHover = (target) => {
      if (ring && dot) {
        const isCta = target.closest("button, [role='button'], .btn-magnetic");
        if (isCta) {
          ring.classList.add("hovering-cta");
        } else {
          ring.classList.add("hovering");
        }
        dot.classList.add("hovering");
      }
    };

    const handleLeave = () => {
      if (ring && dot) {
        ring.classList.remove("hovering", "hovering-cta", "warning-state");
        dot.classList.remove("hovering");
      }
    };

    const onMouseOver = (e) => {
      const target = e.target.closest("a, button, input, select, textarea, [data-cursor='hover']");
      if (target) {
        handleHover(target);
        target.style.cursor = "none";
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest("a, button, input, select, textarea, [data-cursor='hover']");
      if (target) {
        handleLeave();
      }
    };

    const onResize = () => {
      if (checkMobile()) {
        document.body.style.cursor = "auto";
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", onResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.body.style.cursor = "auto";
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[10000] rounded-full"
      />
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[10000] rounded-full"
      />
    </>
  );
}
