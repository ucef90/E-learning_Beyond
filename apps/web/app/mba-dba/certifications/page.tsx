import Link from "next/link";
import { credentialNote } from "@/lib/executive";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Titres, attestations et certifications | Beyond Expertise",
  "Comprendre la différence entre une attestation de formation, un titre, une certification qualité et une reconnaissance académique.",
  "/mba-dba/certifications",
);
export default function Page() {
  return (
    <main id="contenu" className="executive executive-editorial page-shell">
      <Link href="/mba-dba">← MBA & DBA</Link>
      <span className="executive-eyebrow">
        Choisir en connaissance de cause
      </span>
      <h1>
        Un parcours clair.
        <br />
        Des engagements écrits.
      </h1>
      <p className="executive-lead">
        Beyond Expertise est un centre de formation. La qualité de
        l’accompagnement, l’évaluation des acquis et la nature du document
        délivré sont des informations distinctes.
      </p>
      <section>
        <h2>Le statut des parcours présentés</h2>
        <p>{credentialNote}</p>
        <p>
          Les appellations MBA et DBA décrivent ici l’orientation des parcours :
          management pour professionnels et recherche appliquée en
          administration des affaires. Elles ne constituent pas à elles seules
          une preuve de reconnaissance par un État.
        </p>
      </section>
      <section>
        <h2>Ce qui doit être précisé avant votre engagement</h2>
        <ol className="executive-step-list">
          <li>
            <strong>Le document visé</strong>
            <p>
              Intitulé exact, organisme qui le délivre, nature du document et
              conditions de réussite.
            </p>
          </li>
          <li>
            <strong>Le cadre de reconnaissance, s’il existe</strong>
            <p>
              Autorité concernée, pays, périmètre du programme et justificatif
              vérifiable. Aucune équivalence n’est déduite d’un nom commercial.
            </p>
          </li>
          <li>
            <strong>Le contrat de formation</strong>
            <p>
              Contenu, rythme, intervenants, évaluation, conditions de reprise,
              prix et éventuels frais complémentaires.
            </p>
          </li>
        </ol>
      </section>
      <section>
        <h2>Trois notions à distinguer</h2>
        <div className="executive-editorial-grid">
          <article>
            <h3>Attestation de formation</h3>
            <p>
              Elle décrit la formation suivie et, lorsque prévu, les acquis
              évalués. Elle n’équivaut pas automatiquement à un diplôme
              national.
            </p>
          </article>
          <article>
            <h3>Certification professionnelle</h3>
            <p>
              Son intitulé, son certificateur et, le cas échéant, sa fiche dans
              un registre officiel doivent être vérifiés pour le programme
              précis.
            </p>
          </article>
          <article>
            <h3>Certification qualité</h3>
            <p>
              Elle porte sur un organisme ou ses processus dans un périmètre
              donné. Elle ne donne pas automatiquement un grade universitaire au
              parcours suivi.
            </p>
          </article>
        </div>
      </section>
      <section>
        <h2>La démarche qualité Beyond</h2>
        <p>
          La démarche Qualiopi est en cours ; Beyond ne la présente pas comme
          acquise. Aucun logo QAHE, CPD ou ISO n’est utilisé pour revendiquer
          une accréditation de ces parcours.
        </p>
        <p>
          Pour une poursuite d’études, une profession réglementée ou une
          démarche de reconnaissance dans votre pays, faites vérifier le
          document visé par l’autorité ou l’établissement destinataire avant
          inscription.
        </p>
        <Link href="/qualite">Consulter la démarche qualité de Beyond</Link>
      </section>
      <div className="executive-actions">
        <Link
          href="/mba-dba/candidature?demande=information"
          className="button button-primary"
        >
          Demander les conditions de mon parcours
        </Link>
        <Link href="/mba-dba" className="button button-secondary">
          Revenir au catalogue
        </Link>
      </div>
    </main>
  );
}
