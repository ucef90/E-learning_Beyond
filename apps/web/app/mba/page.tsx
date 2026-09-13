import { ExecutiveHome } from "@/components/executive-home";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "MBA pour professionnels en Afrique | Beyond Expertise",
  "21 spécialisations MBA en management, finance, data, santé, industrie et sport. Découvrez les programmes et déposez votre candidature.",
  "/mba",
);
export default function Page() {
  return <ExecutiveHome kind="MBA" />;
}
