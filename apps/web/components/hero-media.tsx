"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
const source =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";
export function HeroMedia() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setAllowed(!preference.matches);
      if (preference.matches) {
        video.current?.pause();
        setPlaying(false);
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (allowed) video.current?.play().catch(() => setPlaying(false));
  }, [allowed]);
  return (
    <>
      <div className="reference-media" aria-hidden="true">
        {allowed && (
          <video
            ref={video}
            src={source}
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setPlaying(false)}
          />
        )}
      </div>
      {allowed && (
        <button
          className="reference-pause"
          onClick={() =>
            playing
              ? video.current?.pause()
              : void video.current?.play().catch(() => setPlaying(false))
          }
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
          {playing ? "Mettre le fond en pause" : "Animer le fond"}
        </button>
      )}
    </>
  );
}
