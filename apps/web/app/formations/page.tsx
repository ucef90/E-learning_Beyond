import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "Catalogue des formations | Beyond Expertise",
  "Consultez les programmes de formation en data, BI, IA et gestion de projet. Objectifs, prérequis, modalités et demande de devis.",
  "/formations",
);
import Link from "next/link";
import { CatalogExplorer } from "./catalog-explorer";
import { getTrainings } from "@/lib/api";
import { ProgrammeContact } from "@/components/programme-contact";
export default async function TrainingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; univers?: string }>;
}) {
  const trainings = await getTrainings();
  const params = searchParams ? await searchParams : undefined;
  return (
    <main id="contenu" className="section section-tight-top catalog-page-main">
      <div className="page-shell">
        <section className="catalog-introduction reference-catalog">
          <p className="eyebrow">Beyond Expertise · Nos formations</p>
          <h1 className="section-title">Des compétences pour vos projets.</h1>
          <p className="section-copy">
            Explorez nos {trainings.length} formations en data, intelligence
            artificielle, développement et management. Retrouvez les objectifs,
            les prérequis et le programme de chaque parcours.
          </p>
          <div className="learning-actions">
            <Link href="/devis" className="button button-primary">
              Être accompagné dans mon choix
            </Link>
            <Link href="/connexion" className="button button-secondary">
              Accéder à mes cours
            </Link>
          </div>
        </section>
        <ProgrammeContact />
        <CatalogExplorer
          trainings={trainings}
          initialQuery={params?.q?.trim() || ""}
          initialUniverse={params?.univers || ""}
        />
      </div>
    </main>
  );
}
