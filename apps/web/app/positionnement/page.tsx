import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { QualityForm } from "@/components/quality-form";
export const metadata = {
  title: "Besoins et positionnement | Beyond Expertise",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ formation?: string }>;
}) {
  const p = await searchParams;
  return (
    <QualityLayout
      title="Partons de vos besoins."
      intro="Décrivez votre niveau, ce que vous souhaitez savoir faire et vos contraintes pour préparer l’échange avec le centre."
    >
      <QualityCard title="Avant de choisir votre parcours">
        <p>
          Précisez votre pratique actuelle, un exemple de tâche à maîtriser, les
          outils disponibles et les contraintes de calendrier. Pour une demande
          d’entreprise, indiquez aussi les attentes du commanditaire et les
          profils du groupe.
        </p>
        <p>
          Ce recueil déclaratif prépare l’analyse des besoins. Il ne remplace
          pas l’entretien, la vérification des prérequis ou une évaluation
          initiale adaptée à la formation. Une décision pédagogique doit être
          consignée par le centre.
        </p>
      </QualityCard>
      <QualityForm
        kinds={["NEEDS"]}
        initialContext={(p.formation || "").slice(0, 240)}
      />
    </QualityLayout>
  );
}
