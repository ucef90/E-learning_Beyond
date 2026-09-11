"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      remove?: (widgetId: string) => void;
      reset?: (widgetId?: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  const containerId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const renderedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !isReady || !window.turnstile || renderedRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(`#${containerId}`, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "light",
      callback: (token) => onVerify(token),
      "expired-callback": () => {
        onExpire?.();
      },
      "error-callback": () => {
        onExpire?.();
      }
    });

    renderedRef.current = true;

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [containerId, isReady, onExpire, onVerify]);

  if (!TURNSTILE_SITE_KEY) {
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setIsReady(true)}
      />
      <div className="turnstile-wrap">
        <div id={containerId} />
      </div>
    </>
  );
}
