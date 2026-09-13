import type { Metadata } from "next";
export function siteOrigin(): string | null {
  const value = process.env.SITE_URL;
  if (!value) return null;
  try {
    const u = new URL(value);
    if (
      u.hostname.endsWith(".invalid") ||
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      u.pathname !== "/" ||
      u.search ||
      u.hash ||
      ["localhost", "127.0.0.1"].includes(u.hostname)
    )
      return null;
    return u.origin;
  } catch {
    return null;
  }
}
export function indexable() {
  return process.env.PREPRODUCTION === "false" && !!siteOrigin();
}
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const base = siteOrigin(),
    url = base ? base + path : undefined;
  return {
    title,
    description,
    robots: indexable()
      ? { index: true, follow: true }
      : { index: false, follow: false },
    ...(url
      ? {
          alternates: { canonical: url },
          openGraph: {
            title,
            description,
            url,
            siteName: "Beyond Expertise",
            locale: "fr_FR",
            type: "website",
          },
        }
      : {}),
  };
}
