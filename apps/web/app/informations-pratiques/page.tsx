import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = { title: "Préparer ma formation | Beyond Expertise" };
export default function Page() {
  return (
    <QualityLayout
      title="Préparer votre entrée en formation."
      intro="Les éléments à examiner avec le centre avant de confirmer votre parcours."
    >
      <QualityCard title="Modalités et délais d’accès">
        <ol>
          <li>
            Choisissez une formation et décrivez vos objectifs, votre niveau et
            vos contraintes.
          </li>
          <li>
            Le centre doit vérifier les prérequis, les adaptations nécessaires
            et les disponibilités du formateur.
          </li>
          <li>
            Avant votre engagement, obtenez un programme validé, un tarif
            contractuel, les dates et les documents d’inscription adaptés à
            votre situation.
          </li>
          <li>
            La convocation doit préciser les horaires, le lieu ou le lien de
            connexion, le matériel et vos interlocuteurs.
          </li>
        </ol>
        <p>
          <strong>Délai d’accès :</strong> à confirmer individuellement selon la
          formation, la session, les prérequis et le financement. Aucun délai
          standard ni date d’entrée n’est validé pour cette copie locale ;
          aucune inscription n’y vaut confirmation d’une session.
        </p>
        <Link href="/positionnement" className="button button-primary">
          Préparer mon positionnement
        </Link>
      </QualityCard>
      <div className="quality-grid">
        <QualityCard title="Tarifs et financement">
          <p>
            Les prix des fiches sont des références relevées sur le site
            officiel. Demandez un devis précisant le montant, le régime de TVA,
            les prestations incluses, les frais éventuels et les conditions de
            paiement.
          </p>
          <p>
            Aucun financement public ou mutualisé ni aucune éligibilité CPF ne
            sont annoncés comme acquis. Vérifiez l’offre exacte et l’accord du
            financeur avant tout engagement.
          </p>
          <Link href="/devis">Demander un devis</Link>
        </QualityCard>
        <QualityCard title="Reconnaissance de la formation">
          <p>
            Les modules locaux ne délivrent pas de diplôme, de titre RNCP, de
            certification RS ni de droit de poursuite d’études. Un relevé
            d’activité ou de résultats ne constitue pas une certification
            professionnelle.
          </p>
          <p>
            Pour une préparation à un examen externe, le centre doit confirmer
            la certification visée, les habilitations, le coût et les modalités
            de présentation avant inscription.
          </p>
        </QualityCard>
      </div>
      <QualityCard title="Suivre le module pilote à distance">
        <p>
          Prévoyez un ordinateur, un navigateur récent, une connexion internet
          pour le chargement initial du laboratoire et la possibilité de
          télécharger vos fichiers. Le module Python et pandas affiche une durée
          indicative d’environ deux heures ; la durée de chaque activité figure
          dans le parcours.
        </p>
        <p>
          L’espace apprenant donne accès aux cours attribués, exercices, remises
          de TP, quiz et retours du formateur. L’équipe pédagogique doit
          convenir avec vous du rythme, des critères d’évaluation et du suivi
          effectif.
        </p>
        <p>
          Le laboratoire s’exécute dans le navigateur ; n’y importez que les
          données pédagogiques autorisées. Il ne remplace pas un environnement
          sécurisé pour des données confidentielles.
        </p>
        <Link href="/assistance">Assistance technique et pédagogique</Link>
      </QualityCard>
      <QualityCard title="Documents à obtenir avant la session">
        <ul>
          <li>Programme validé, objectifs évaluables et prérequis.</li>
          <li>
            Convention ou contrat adapté, devis, conditions d’annulation,
            règlement intérieur.
          </li>
          <li>
            Convocation, calendrier, coordonnées d’assistance et modalités de
            suivi.
          </li>
          <li>
            Adaptations convenues et modalités d’évaluation et de fin de
            parcours.
          </li>
        </ul>
        <p>
          Ces documents contractuels et les délais de réponse du centre doivent
          être finalisés avant l’ouverture de sessions réelles. Ils ne sont pas
          remplacés par cette page.
        </p>
        <Link href="/accessibilite">Étudier un besoin d’aménagement</Link>
      </QualityCard>
    </QualityLayout>
  );
}
