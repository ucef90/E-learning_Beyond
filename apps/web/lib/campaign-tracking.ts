"use client";
export type Consent = {
  statistics: boolean;
  advertising: boolean;
  expires: number;
  version: number;
};
export type Config = { ga4: string; metaPixel: string; whatsapp: string };
const CONSENT = "beyond-consent-v1",
  ATTR = "beyond-campaign-v1";
let config: Config = { ga4: "", metaPixel: "", whatsapp: "" },
  activeGa = "",
  activeMeta = "";
let queuedTouch: Record<string, string> | null = null;
const publicPath = (path: string) =>
  /^\/(?:afrique|mba|dba|formations|contact|devis)(?:[a-z0-9/-]*)$/.test(path);
function read(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}
export function consent(): Consent | null {
  if (typeof window === "undefined") return null;
  const c = read(CONSENT);
  if (c?.version === 1 && c.expires > Date.now()) return c;
  try {
    localStorage.removeItem(CONSENT);
    localStorage.removeItem(ATTR);
  } catch {}
  return null;
}
export function saveConsent(statistics: boolean, advertising: boolean) {
  const previous = consent();
  const c = {
    statistics,
    advertising,
    version: 1,
    expires: Date.now() + 180 * 86400000,
  };
  try {
    localStorage.setItem(CONSENT, JSON.stringify(c));
    if (!statistics) localStorage.removeItem(ATTR);
  } catch {}
  if (
    (previous?.statistics && !statistics) ||
    (previous?.advertising && !advertising)
  ) {
    for (const cookie of document.cookie.split(";")) {
      const key = cookie.trim().split("=")[0];
      if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(key))
        for (const domain of [
          "",
          location.hostname,
          "." + location.hostname.replace(/^www\./, ""),
        ])
          document.cookie =
            key + "=; Max-Age=0; Path=/" + (domain ? "; Domain=" + domain : "");
    }
    location.reload();
    return;
  }
  window.dispatchEvent(new Event("beyond-consent"));
}
export function configureTracking(value: Config) {
  config = value;
  activateTags();
}
function script(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}
function metaSafeUrl() {
  return [...new URLSearchParams(location.search)].every(
    ([key, value]) =>
      /^(programme|demande|utm_source|utm_medium|utm_campaign|utm_content|utm_term|utm_country)$/.test(
        key,
      ) &&
      value.length <= 120 &&
      /^[\p{L}\p{N} _.+-]*$/u.test(value),
  );
}
function activateTags() {
  if (!publicPath(location.pathname)) return;
  const c = consent(),
    w = window as any;
  if (c?.statistics && config.ga4 && !activeGa) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      w.dataLayer.push(arguments);
    };
    w.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    w.gtag("consent", "update", { analytics_storage: "granted" });
    w.gtag("js", new Date());
    w.gtag("config", config.ga4, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: "",
    });
    script(
      "beyond-ga4",
      "https://www.googletagmanager.com/gtag/js?id=" + config.ga4,
    );
    activeGa = config.ga4;
  }
  if (c?.advertising && config.metaPixel && !activeMeta && metaSafeUrl()) {
    const f: any = function (...args: any[]) {
      f.callMethod ? f.callMethod(...args) : f.queue.push(args);
    };
    f.queue = [];
    f.push = f;
    f.loaded = true;
    f.version = "2.0";
    f.disablePushState = true;
    w.fbq = f;
    w._fbq = f;
    f("set", "autoConfig", false, config.metaPixel);
    f("consent", "grant");
    f("init", config.metaPixel);
    script("beyond-meta", "https://connect.facebook.net/en_US/fbevents.js");
    activeMeta = config.metaPixel;
  }
}
export function isolateTrackingRoute() {
  if ((activeGa || activeMeta) && !publicPath(location.pathname)) {
    location.reload();
    return true;
  }
  return false;
}
export function captureAttribution() {
  if (!publicPath(location.pathname)) return;
  const params = new URLSearchParams(location.search),
    touch: Record<string, string> = { landing: location.pathname };
  for (const [target, key] of [
    ["source", "utm_source"],
    ["medium", "utm_medium"],
    ["campaign", "utm_campaign"],
    ["content", "utm_content"],
    ["term", "utm_term"],
    ["country", "utm_country"],
  ]) {
    const v = params.get(key);
    if (v && v.length <= 100 && /^[\p{L}\p{N} _.+-]+$/u.test(v))
      touch[target] = v;
  }
  try {
    const host = new URL(document.referrer).hostname;
    if (host !== location.hostname && !queuedTouch) touch.referrer = host;
  } catch {}
  const fresh = !!touch.source || !!touch.campaign || !!touch.referrer;
  if (fresh || !queuedTouch) queuedTouch = touch;
  if (!consent()?.statistics) return;
  let a = read(ATTR);
  if (!a || a.expires <= Date.now())
    a = {
      first: queuedTouch,
      last: queuedTouch,
      expires: Date.now() + 30 * 86400000,
    };
  else if (fresh) a.last = touch;
  try {
    localStorage.setItem(ATTR, JSON.stringify(a));
  } catch {}
  activateTags();
}
export function attribution() {
  if (!consent()?.statistics) return undefined;
  const a = read(ATTR);
  return a && a.expires > Date.now()
    ? {
        first: a.first,
        last: a.last,
        statistics: true,
        advertising: consent()?.advertising === true,
      }
    : undefined;
}
export function track(name: string, programmeSlug?: string) {
  const path = location.pathname;
  if (!publicPath(path)) return;
  const c = consent();
  if (!c?.statistics && !c?.advertising) return;
  activateTags();
  const safeProgramme =
    programmeSlug && /^[a-z0-9-]{3,120}$/.test(programmeSlug)
      ? programmeSlug
      : undefined;
  if (c?.statistics)
    void fetch("/api/v1/campaigns/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        name,
        path,
        programmeSlug: safeProgramme,
        statisticsConsent: true,
        attribution: attribution(),
      }),
      keepalive: true,
    }).catch(() => {});
  const w = window as any;
  if (c?.statistics && activeGa)
    w.gtag?.("event", name, {
      page_location: location.origin + path,
      page_referrer: "",
      programme: safeProgramme,
    });
  // Meta receives no form fields or identifiers. Query strings are never part of event payloads.
  if (c?.advertising && activeMeta && metaSafeUrl())
    w.fbq?.("trackCustom", name, { programme: safeProgramme });
}
export function conversion(
  name: "generate_lead" | "application_submitted",
  key: string,
  programme: string,
) {
  const c = consent();
  if (!c?.statistics && !c?.advertising) return;
  try {
    const storageKey = "beyond-conversion-" + key;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {}
  const w = window as any;
  if (c?.statistics && activeGa)
    w.gtag?.("event", name, {
      programme,
      page_location: location.origin + "/mba-dba/merci",
      page_referrer: "",
    });
  if (c?.advertising && activeMeta && metaSafeUrl())
    w.fbq?.(
      "track",
      name === "generate_lead" ? "Lead" : "SubmitApplication",
      { content_name: programme },
      { eventID: key },
    );
}
export function leadRequestKey() {
  try {
    return JSON.parse(sessionStorage.getItem("beyond-lead-receipt") || "null")
      ?.requestKey;
  } catch {
    return undefined;
  }
}
