"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
export function HeroMedia() {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const p = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlaying(!p.matches);
    update();
    p.addEventListener("change", update);
    return () => p.removeEventListener("change", update);
  }, []);
  return (
    <>
      <div
        className={
          "reference-media local-hero-art" + (playing ? " is-playing" : "")
        }
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
      <button className="reference-pause" onClick={() => setPlaying(!playing)}>
        {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
        {playing ? "Mettre le fond en pause" : "Animer le fond"}
      </button>
    </>
  );
}
