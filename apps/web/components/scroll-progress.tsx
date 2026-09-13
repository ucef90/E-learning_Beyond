"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Decorative reading progress, kept above the shared header on every route. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [path]);
  return (
    <div className="site-scroll-track" aria-hidden="true">
      <div className="site-scroll-progress" ref={bar} />
    </div>
  );
}
