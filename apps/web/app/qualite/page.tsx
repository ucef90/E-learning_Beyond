import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title: "Démarche qualité et résultats | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Une formation claire, un suivi accessible."
      intro="Les informations utiles à votre parcours, les moyens de signaler une difficulté et l’état de notre démarche qualité."
    >
      <QualityCard title="Notre démarche Qualiopi">
        <p>
          La démarche de certification Qualiopi est en cours. La certification
          n’est pas acquise. Cette plateforme ne constitue pas un certificat
          Qualiopi et aucune prise en charge CPF ou OPCO n’est garantie.
        </p>
        <p>
          Les programmes détaillés du catalogue sont en validation pédagogique.
          Le module pilote Python et pandas permet de tester les leçons,
          exercices, remises et évaluations ; il ne couvre pas encore la
          totalité de la formation de référence.
        </p>
      </QualityCard>
      <div className="quality-grid">
        <QualityCard title="Avant votre inscription">
          <p>
            Consultez les objectifs, prérequis, durée, modalités et programme de
            chaque formation. Un échange de positionnement prépare l’adaptation
            à vos besoins.
          </p>
          <Link href="/informations-pratiques">
            Modalités d’accès et documents avant formation
          </Link>
        </QualityCard>
        <QualityCard title="Pendant et après le parcours">
          <p>
            Vous pouvez demander de l’aide, signaler une difficulté ou donner
            votre avis. Chaque enregistrement reçoit une référence pour
            faciliter son traitement.
          </p>
          <Link href="/avis">Partager mon expérience</Link>
        </QualityCard>
      </div>
      <QualityCard title="Résultats et indicateurs">
        <p>
          Aucun résultat consolidé issu de sessions réelles n’est publié à ce
          stade dans cette version locale. Les comptes et exercices de
          démonstration sont exclus des résultats du centre.
        </p>
        <p>
          Chaque bilan devra préciser la période, les formations couvertes, les
          effectifs et les limites de lecture.
        </p>
        <dl>
          <dt>Satisfaction</dt>
          <dd>
            Réponses de 4 ou 5 sur 5 ÷ réponses exploitables × 100 ; taux de
            réponse : répondants ÷ personnes sollicitées × 100.
          </dd>
          <dt>Atteinte des objectifs</dt>
          <dd>
            Participants ayant atteint les critères pédagogiques annoncés ÷
            participants évalués × 100, en précisant les absents à l’évaluation.
          </dd>
          <dt>Achèvement et ruptures</dt>
          <dd>
            Parcours achevés ou interrompus ÷ parcours commencés × 100, avec une
            définition stable de l’achèvement et la période étudiée.
          </dd>
        </dl>
        <p>
          Une moyenne de quiz ou un clic « leçon lue » ne suffit pas à établir
          la réalisation complète d’une formation.
        </p>
      </QualityCard>
      <QualityCard title="Vos remarques font avancer le dispositif">
        <p>
          Les demandes, décisions et actions peuvent être consignées dans un
          registre réservé aux administrateurs. La réponse au demandeur et la
          vérification de l’efficacité d’une action restent à réaliser par le
          centre.
        </p>
        <div className="quality-actions">
          <Link href="/reclamations">Déposer une réclamation</Link>
          <Link href="/accessibilite">Demander un aménagement</Link>
          <Link href="/signalement">Signaler une situation préoccupante</Link>
        </div>
      </QualityCard>
    </QualityLayout>
  );
}
