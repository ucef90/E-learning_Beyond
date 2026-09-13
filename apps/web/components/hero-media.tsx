"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function HeroMedia() {
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setEnabled(!preference.matches);
      if (preference.matches) video.current?.pause();
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (enabled) video.current?.play().catch(() => setPlaying(false));
  }, [enabled]);
  function toggle() {
    if (!enabled) {
      setEnabled(true);
      return;
    }
    if (playing) video.current?.pause();
    else video.current?.play().catch(() => setPlaying(false));
  }
  return (
    <>
      <div className="reference-media original-hero-media" aria-hidden="true">
        {enabled && (
          <video
            ref={video}
            src="/media/hero-original.mp4"
            poster="/media/hero-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
        )}
      </div>
      {!failed && (
        <button
          className="reference-pause"
          onClick={toggle}
          aria-pressed={playing}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Mettre le fond en pause" : "Animer le fond"}
        </button>
      )}
    </>
  );
}
