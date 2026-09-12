import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title: "Mentions légales | Beyond Expertise",
  robots: { index: false },
};
export default function Page() {
  return (
    <QualityLayout
      title="Informations légales."
      intro="Version de travail locale — les informations juridiques de l’éditeur doivent être confirmées avant publication."
    >
      <QualityCard title="Identification du centre">
        <p>
          Nom utilisé : Beyond Expertise. Téléphone et email : voir les
          coordonnées ci-dessus, confirmées par le porteur du projet le 12
          septembre 2026.
        </p>
        <p>
          À compléter sur justificatifs : dénomination sociale, forme juridique,
          capital, adresse du siège, SIREN / SIRET, immatriculation, numéro de
          déclaration d’activité, régime de TVA et directeur de publication.
          Aucune adresse provisoire n’est présentée comme celle du centre.
        </p>
      </QualityCard>
      <QualityCard title="Hébergement et diffusion">
        <p>
          Le site fonctionne actuellement en local sur l’ordinateur du projet.
          Aucun hébergeur public n’est désigné pour cette version. Ses
          coordonnées légales devront être ajoutées lors du choix d’un
          hébergement.
        </p>
      </QualityCard>
      <QualityCard title="Formation et certification">
        <p>
          La certification Qualiopi est en cours de préparation et n’est pas
          acquise. Les conditions contractuelles, le règlement intérieur et,
          selon les publics et prestations concernés, les informations de
          médiation doivent être validés avant commercialisation.
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
