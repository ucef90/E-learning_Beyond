import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { centre } from "@/lib/centre";
export const metadata = {
  title: "Conditions, tarifs et admission | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Votre demande et votre inscription."
      intro="Les étapes, les informations remises et les conditions applicables avant votre engagement. Mise à jour : 13 septembre 2026."
    >
      <QualityCard title="1. Demande gratuite et étude de candidature">
        <p>
          Une demande de brochure, de tarifs, de rappel ou une candidature est
          gratuite et sans engagement. Elle ne réserve pas une place et ne vaut
          ni admission, ni inscription, ni contrat. Aucun paiement n’est demandé
          par ces formulaires.
        </p>
        <p>
          Beyond Expertise étudie les prérequis, votre expérience et votre
          projet. L’admission et les éventuelles adaptations sont confirmées
          individuellement.
        </p>
      </QualityCard>
      <QualityCard title="2. Informations transmises avant engagement">
        <p>
          La proposition écrite précise le programme, les objectifs, les
          prérequis, la durée, les dates et horaires, les modalités à distance,
          les moyens pédagogiques et techniques, l’accompagnement, les
          évaluations et la nature exacte du document délivré, avec son
          organisme émetteur.
        </p>
        <p>
          Les noms MBA et DBA ne garantissent pas à eux seuls une reconnaissance
          officielle. Aucune double diplomation ou équivalence avec un diplôme
          national ne peut être déduite de ces intitulés.{" "}
          <Link href="/mba-dba/certifications">
            Consulter les informations sur les titres
          </Link>
          .
        </p>
      </QualityCard>
      <QualityCard title="3. Prix, devise et paiement">
        <p>
          Les tarifs MBA et DBA sont communiqués sur demande. Avant signature,
          la proposition indique le prix total, la devise de facturation, les
          taxes applicables, les frais obligatoires et les prestations incluses.
          Les éventuels frais bancaires ou de change doivent être examinés avant
          de payer.
        </p>
        <p>
          Un échéancier ou une prise en charge employeur peut être étudié. Les
          modalités acceptées figurent dans le contrat ; aucun financement,
          exonération ou paiement échelonné n’est automatique. Ne procédez à
          aucun règlement sur la seule base d’un échange publicitaire.
        </p>
      </QualityCard>
      <QualityCard title="4. Contrat, rétractation et annulation">
        <p>
          L’inscription est formalisée par un contrat ou une convention
          précisant notamment les conditions de report, d’annulation,
          d’interruption et de remboursement. Les droits impératifs applicables
          à votre situation et à votre pays de résidence sont préservés.
        </p>
        <p>
          Pour une personne physique finançant à titre individuel une formation
          relevant du Code du travail français, le contrat prévoit le délai
          légal de rétractation de dix jours ; aucun paiement n’est exigé avant
          son expiration et le premier versement est plafonné à 30 %, le solde
          étant échelonné au fur et à mesure de la formation. Lorsqu’un contrat
          à distance relève du droit français de la consommation, le droit de
          rétractation de quatorze jours et ses conditions sont également
          examinés avant signature. Le document contractuel précise le régime
          applicable et les modalités d’exercice.
        </p>
        <p>
          Le site ne permet actuellement ni la signature d’un contrat de
          formation ni un paiement en ligne. Pour une demande liée à un contrat
          existant, contactez <a href={centre.emailHref}>{centre.email}</a> en
          indiquant sa référence, sans transmettre de pièce d’identité par un
          formulaire public.
        </p>
      </QualityCard>
      <QualityCard title="5. Déroulement et accessibilité">
        <p>
          Les parcours à distance nécessitent un ordinateur, un navigateur
          récent et une connexion adaptée aux visioconférences. Le calendrier,
          le fuseau horaire de référence et les conditions d’accès aux
          ressources sont confirmés avant inscription. Les évaluations et
          livrables sont détaillés dans la fiche du programme.
        </p>
        <p>
          <Link href="/accessibilite">Signaler un besoin d’adaptation</Link> ·{" "}
          <Link href="/mba-dba/pedagogie">Consulter la pédagogie</Link> ·{" "}
          <Link href="/informations-pratiques">Préparer sa formation</Link>.
        </p>
      </QualityCard>
      <QualityCard title="6. Réclamations et règlement des différends">
        <p>
          Adressez d’abord votre réclamation à Beyond Expertise via le{" "}
          <Link href="/reclamations">formulaire dédié</Link> ou par email. La
          référence de la demande permet d’en assurer le suivi.
        </p>
        <p>
          Pour les contrats conclus avec des consommateurs, les coordonnées du
          médiateur de la consommation compétent doivent être communiquées avant
          signature. Elles ne sont pas encore publiées sur ce site. Cette
          information reste à compléter avant l’ouverture de ventes aux
          particuliers.
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
