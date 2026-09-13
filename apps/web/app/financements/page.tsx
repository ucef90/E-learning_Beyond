import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title:
    "Financer votre formation : CPF, OPCO et entreprise | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Préparons le financement de votre formation."
      intro="CPF, OPCO, budget entreprise ou financement personnel : le bon dispositif dépend de votre situation et de la formation choisie."
    >
      <div className="funding-grid">
        <QualityCard title="CPF : vérifier la formation éligible">
          <p>
            La présence d’une formation dans notre catalogue ne signifie pas
            qu’elle est éligible au CPF. Avant toute démarche, vérifiez l’offre
            effectivement référencée sur Mon Compte Formation et les conditions
            applicables à votre situation.
          </p>
          <p>
            À ce stade, aucune éligibilité CPF n’est annoncée pour notre
            catalogue local.
          </p>
          <a
            href="https://www.moncompteformation.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consulter Mon Compte Formation
          </a>
        </QualityCard>
        <QualityCard title="OPCO : étudier votre demande">
          <p>
            Votre entreprise peut se renseigner auprès de son opérateur de
            compétences sur les critères et possibilités de prise en charge. Un
            programme, un devis et un calendrier permettent de préparer l’étude
            du dossier.
          </p>
          <p>
            L’accord dépend du financeur et des conditions applicables ; aucune
            prise en charge n’est garantie.
          </p>
          <Link href="/devis">Préparer un devis</Link>
        </QualityCard>
        <QualityCard title="Budget formation de votre entreprise">
          <p>
            Décrivez les métiers concernés, les compétences visées et le nombre
            de participants. Nous préparons avec vous un parcours inter, intra
            ou sur mesure, avec un devis détaillé.
          </p>
          <Link href="/entreprises">Découvrir les solutions entreprises</Link>
        </QualityCard>
        <QualityCard title="Financement personnel">
          <p>
            Demandez un devis avant de vous engager. Le prix, les dates, le
            programme et les conditions contractuelles doivent être confirmés
            avec le centre.
          </p>
          <Link href="/contact">Échanger avec le centre</Link>
        </QualityCard>
      </div>
      <QualityCard title="Qualiopi : finalisation de la démarche en cours">
        <p>
          La certification de Beyond Expertise n’est pas encore acquise. Cette
          situation doit être prise en compte dans toute étude de financement
          public ou mutualisé.
        </p>
        <Link href="/qualite#qualiopi">
          Consulter l’état de notre démarche qualité
        </Link>
        <p>
          <a
            href="https://travail-emploi.gouv.fr/referentiel-national-qualite-guide-de-lecture-qualiopi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cadre officiel : certification qualité et financement
          </a>
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
