import { ExecutiveHome } from "@/components/executive-home";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "MBA & DBA Afrique et international | Beyond Expertise",
  "Explorez 21 parcours MBA et 10 axes DBA : programmes détaillés, projets appliqués, accompagnement et candidature.",
  "/mba-dba",
);
export default function Page() {
  return <ExecutiveHome />;
}
