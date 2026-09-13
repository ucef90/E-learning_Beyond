import Link from "next/link";
import data from "@/lib/regulatory-catalogue.json";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title: "Formations RGPD et AI Act | Beyond Expertise",
  description:
    "Deux parcours pratiques : protection des données, maîtrise de l’IA, cas corrigés et outils de gouvernance.",
};
export default function Page() {
  return (
    <QualityLayout
      title="Données protégées. IA mieux maîtrisée."
      intro="Comprendre les règles, s’exercer sur des cas concrets et repartir avec des outils pour agir. Deux parcours de 14 heures, avec supports et exercices consultables."
    >
      <div className="regulatory-intro">
        <span>RGPD + AI Act</span>
        <h2>
          Transformez les obligations en compétences utiles à votre équipe.
        </h2>
        <p>
          Un registre de traitements à construire, un incident à analyser, des
          usages d’IA à qualifier. Chaque parcours relie les textes officiels à
          des décisions de terrain.
        </p>
      </div>
      <div className="quality-grid">
        {data.courses.map((c) => (
          <QualityCard key={c.slug} title={c.title}>
            <p>{c.summary}</p>
            <p>
              <strong>2 jours · 14 h · Sur devis</strong>
            </p>
            <p>8 séquences · 8 cas corrigés · 20 questions expliquées</p>
            <h3>Votre boîte à outils</h3>
            <ul>
              {c.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <div className="regulatory-actions">
              <a
                className="button button-primary"
                href={"/formations/" + c.slug}
              >
                Voir le programme
              </a>
              <a
                className="button button-secondary"
                href={"/formations/" + c.slug + "/support"}
              >
                Lire le support
              </a>
            </div>
          </QualityCard>
        ))}
      </div>
      <QualityCard title="Des parcours pour apprendre à décider">
        <p>
          Positionnement initial, ateliers sur données fictives, corrections
          expliquées et dossier final. Les 14 heures comprennent l’animation et
          les exercices ; elles ne correspondent pas au seul temps de lecture.
          Les quiz formatifs sont à livre ouvert.
        </p>
        <p>
          Les supports pédagogiques s’appuient sur des références officielles
          consultées le 12 septembre 2026. Leur validation pédagogique par le
          formateur et leur adaptation à votre contexte restent à réaliser avant
          animation.
        </p>
        <Link href="/positionnement">Préparer mon parcours avec le centre</Link>
      </QualityCard>
      <QualityCard title="Formation, conformité et certification">
        <p>
          Le RGPD et l’AI Act sont des règlements européens. Suivre une
          formation contribue aux compétences ; cela ne certifie pas votre
          organisation. Beyond ne revendique ici ni certification RGPD / AI Act,
          ni certification DPO, ni titre RNCP ou RS pour ces parcours.
        </p>
        <p>
          <a href="https://www.cnil.fr/fr/mecanismes-certification-approuves">
            La CNIL explique les certifications volontaires
          </a>
          .{" "}
          <a href="https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers">
            La Commission précise les mesures de maîtrise de l’IA
          </a>
          .
        </p>
      </QualityCard>
      <QualityCard title="Notre démarche sur cette plateforme">
        <p>
          L’accueil utilise un décor local sans vidéo tierce. Les comptes
          disposent d’un export de leurs données rattachées, les demandes de
          droits sont enregistrées et les usages de l’IA sont expliqués.
        </p>
        <p>
          Ces mesures sont vérifiables ; elles ne constituent pas une
          certification ni une preuve de conformité globale. Les informations
          juridiques et les procédures réelles du centre doivent encore être
          complétées.
        </p>
        <div className="regulatory-actions">
          <Link href="/confidentialite">Vos données</Link>
          <Link href="/transparence-ia">Nos usages de l’IA</Link>
          <Link href="/vos-droits">Exercer vos droits</Link>
        </div>
      </QualityCard>
    </QualityLayout>
  );
}
