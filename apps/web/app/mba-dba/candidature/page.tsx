import Link from "next/link";
import { ExecutiveApplication } from "@/components/executive-application";
export const metadata = {
  title: "Candidature MBA, DBA et accompagnement | Beyond Expertise",
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string; demande?: string }>;
}) {
  const q = await searchParams;
  return (
    <main id="contenu" className="executive page-shell">
      <div className="executive-section-heading executive-page-intro">
        <div>
          <Link href="/mba-dba">← MBA & DBA</Link>
          <h1>Parlons de votre prochain défi.</h1>
        </div>
        <p>
          Quelques informations pour comprendre votre projet. Beyond examine
          votre demande avant de proposer un entretien et les conditions
          détaillées du parcours.
        </p>
      </div>
      <div className="executive-application-grid">
        <ExecutiveApplication
          initialProgramme={q.programme}
          information={q.demande === "information"}
        />
        <aside>
          <h2>Et ensuite ?</h2>
          <ol className="executive-step-list">
            <li>
              <strong>Votre demande est enregistrée</strong>
              <p>
                Une référence s’affiche immédiatement. Conservez-la pour vos
                échanges avec le centre.
              </p>
            </li>
            <li>
              <strong>Votre projet est étudié</strong>
              <p>
                Les prérequis, le terrain d’application et les contraintes de
                rythme sont examinés.
              </p>
            </li>
            <li>
              <strong>Vous décidez en connaissance de cause</strong>
              <p>
                Calendrier, tarif, accompagnement et statut du titre visé sont
                précisés avant tout engagement.
              </p>
            </li>
          </ol>
          <Link href="/mba-dba/certifications">
            Comprendre les titres et certifications
          </Link>
        </aside>
      </div>
    </main>
  );
}
