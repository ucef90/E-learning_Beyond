"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  captureAttribution,
  configureTracking,
  consent,
  saveConsent,
  track,
  isolateTrackingRoute,
} from "@/lib/campaign-tracking";
export function ConsentSettings() {
  return (
    <button
      type="button"
      className="consent-settings"
      onClick={() => window.dispatchEvent(new Event("beyond-preferences"))}
    >
      Gérer mes cookies
    </button>
  );
}
export function CampaignConsent() {
  const path = usePathname(),
    [open, setOpen] = useState(false),
    [custom, setCustom] = useState(false),
    [statistics, setStatistics] = useState(false),
    [advertising, setAdvertising] = useState(false);
  const counted = useRef(""),
    privatePage =
      /^\/(admin|apprentissage|connexion|recuperation|formateur|apprenant)(\/|$)/.test(
        path,
      );
  useEffect(() => {
    if (isolateTrackingRoute()) return;
    function preferences() {
      const c = consent();
      setStatistics(c?.statistics || false);
      setAdvertising(c?.advertising || false);
      setCustom(true);
      setOpen(true);
    }
    const update = () => {
      setOpen(!consent());
      captureAttribution();
      const slug = /^\/mba-dba\/(mba-|dba-)/.test(location.pathname)
        ? location.pathname.split("/").pop()
        : undefined;
      if (
        (consent()?.statistics || consent()?.advertising) &&
        counted.current !== location.pathname
      ) {
        track(slug ? "view_programme" : "page_view", slug);
        counted.current = location.pathname;
      }
    };
    window.addEventListener("beyond-preferences", preferences);
    window.addEventListener("beyond-consent", update);
    if (!privatePage) {
      captureAttribution();
      setOpen(!consent());
      void fetch("/api/v1/campaigns/configuration")
        .then((r) => (r.ok ? r.json() : null))
        .then((c) => {
          if (c) {
            configureTracking(c);
            update();
          }
        })
        .catch(() => {});
    }
    const clicks = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest("a");
      if (!a) return;
      const url = a.getAttribute("href") || "",
        slug = a.getAttribute("data-programme") || undefined;
      if (url.startsWith("tel:")) track("click_phone", slug);
      else if (url.startsWith("https://wa.me/")) track("click_whatsapp", slug);
      else if (url.endsWith(".pdf")) track("download_brochure", slug);
      else if (url.startsWith("/mba-dba/candidature"))
        track("start_application", slug);
    };
    document.addEventListener("click", clicks);
    return () => {
      window.removeEventListener("beyond-preferences", preferences);
      window.removeEventListener("beyond-consent", update);
      document.removeEventListener("click", clicks);
    };
  }, [path, privatePage]);
  if (privatePage || !open) return null;
  function choose(s: boolean, a: boolean) {
    saveConsent(s, a);
    setOpen(false);
    setCustom(false);
  }
  return (
    <aside className="campaign-consent" aria-label="Choix des cookies">
      <div>
        <strong>Vos choix de confidentialité</strong>
        <p>
          Avec votre accord, nous mesurons les visites et l’origine des
          demandes. Les outils publicitaires sont facultatifs. Vos choix
          n’empêchent pas de demander une brochure ou de candidater.{" "}
          <a href="/confidentialite">En savoir plus</a>
        </p>
        {custom && (
          <div className="consent-options">
            <label>
              <input
                type="checkbox"
                checked={statistics}
                onChange={(e) => setStatistics(e.target.checked)}
              />{" "}
              Statistiques du site et GA4, si configuré
            </label>
            <label>
              <input
                type="checkbox"
                checked={advertising}
                onChange={(e) => setAdvertising(e.target.checked)}
              />{" "}
              Mesure publicitaire Meta, si configurée
            </label>
            <small>
              Préférences et session de connexion : nécessaires au service.
            </small>
          </div>
        )}
      </div>
      <div className="consent-actions">
        <button onClick={() => choose(false, false)}>Tout refuser</button>
        <button onClick={() => choose(true, true)}>Tout accepter</button>
        {custom ? (
          <button onClick={() => choose(statistics, advertising)}>
            Enregistrer mes choix
          </button>
        ) : (
          <button onClick={() => setCustom(true)}>Personnaliser</button>
        )}
      </div>
    </aside>
  );
}
