import Link from "next/link";
import { CatalogExplorer } from "./catalog-explorer";
import { getTrainings } from "@/lib/api";
import { ProgrammeContact } from "@/components/programme-contact";
export default async function TrainingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const trainings = await getTrainings();
  const params = searchParams ? await searchParams : undefined;
  const modules = trainings.reduce((n, t) => n + t.courses.length, 0);
  const programmes = trainings.filter((t) => t.source?.syllabusSummary).length;
  return (
    <main id="contenu" className="section section-tight-top catalog-page-main">
      <div className="page-shell">
        <section className="catalog-introduction">
          <p className="eyebrow">Beyond Expertise · Catalogue de formation</p>
          <h1 className="section-title">Votre catalogue de formation.</h1>
          <p className="section-copy">
            {trainings.length} fiches issues du catalogue officiel, avec leurs
            objectifs, publics et prérequis. {programmes} programmes détaillés
            avec déroulé par journée, ateliers et critères d’évaluation.{" "}
            {modules} module pilote disponible dans l’espace apprenant ; les
            autres cours e-learning sont à préparer.
          </p>
          <div className="learning-actions">
            <Link className="button button-primary" href="/apprentissage">
              Ouvrir mon espace apprenant
            </Link>
            <a
              className="button button-secondary"
              href="https://beyond-expertise.com/formations"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consulter le catalogue officiel
            </a>
          </div>
          <p className="learning-note">
            Relevé du 11 septembre 2026. Les durées et modalités décrivent
            l’offre du site officiel. L’accès aux modules en ligne dépend de
            leur disponibilité et de leur attribution.
          </p>
        </section>
        <ProgrammeContact />
        <CatalogExplorer
          trainings={trainings}
          initialQuery={params?.q?.trim() || ""}
        />
      </div>
    </main>
  );
}
