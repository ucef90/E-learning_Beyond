import { ExecutiveHome } from "@/components/executive-home";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "DBA : recherche appliquée en management | Beyond Expertise",
  "Dix axes DBA pour professionnels : problématique, méthodologie, recherche sur le terrain, mémoire et soutenance. Modalités et candidature.",
  "/dba",
);
export default function Page() {
  return <ExecutiveHome kind="DBA" />;
}
