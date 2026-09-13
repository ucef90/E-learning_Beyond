import type { MetadataRoute } from "next";
import { getTrainings, getSeoCategoryHubs } from "@/lib/api";
import { indexable, siteOrigin } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexable()) return [];
  const root = siteOrigin()!,
    trainings = await getTrainings();
  return [
    "/",
    "/formations",
    "/contact",
    "/devis",
    "/a-propos",
    ...getSeoCategoryHubs().map((h) => "/expertises/" + h.slug),
    ...trainings.map((t) => "/formations/" + t.slug),
  ].map((path) => ({ url: root + path }));
}
