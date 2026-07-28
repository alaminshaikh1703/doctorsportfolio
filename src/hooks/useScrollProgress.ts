"use client";

import { useEffect, useState } from "react";

export function useScrollProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Number((currentScroll / scrollHeight).toFixed(3)));
      }
    };

    window.addEventListener("scroll", updateScrollCompletion);
    updateScrollCompletion();

    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return completion;
}
