import type { MetadataRoute } from "next";
import { indexable, siteOrigin } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  if (!indexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/apprentissage/",
        "/espace/",
        "/apprenant/",
        "/formateur/",
        "/admin/",
        "/connexion",
        "/inscription",
        "/recuperation",
        "/api/",
      ],
    },
    sitemap: siteOrigin() + "/sitemap.xml",
  };
}
