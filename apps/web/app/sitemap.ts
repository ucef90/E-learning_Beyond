import type { MetadataRoute } from "next";
import { executiveProgrammes } from "@/lib/executive";
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
    "/mba-dba",
    "/afrique",
    "/mba",
    "/dba",
    "/mba-dba/pedagogie",
    "/mba-dba/certifications",
    "/entreprises/afrique",
    ...executiveProgrammes.map((p) => "/mba-dba/" + p.slug),
    "/contact",
    "/devis",
    "/a-propos",
    ...getSeoCategoryHubs().map((h) => "/expertises/" + h.slug),
    ...trainings.map((t) => "/formations/" + t.slug),
  ].map((path) => ({ url: root + path }));
}
