"use client";

import { useEffect, useState } from "react";

export function useMouseParallax(factor: number = 15) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * factor;
      const y = (e.clientY / innerHeight - 0.5) * factor;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [factor]);

  return position;
}
