import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { QualityForm } from "@/components/quality-form";
export const metadata = { title: "Donner mon avis | Beyond Expertise" };
export default function Page() {
  return (
    <QualityLayout
      title="Votre expérience nous aide à progresser."
      intro="Partagez votre appréciation de l’organisation ou un retour précis sur les contenus et les enseignements."
    >
      <QualityCard title="Deux retours complémentaires">
        <p>
          La satisfaction générale concerne les apprenants, formateurs,
          entreprises et financeurs. L’évaluation des contenus s’adresse aux
          apprenants et porte spécifiquement sur les explications, supports et
          exercices.
        </p>
        <p>
          Indiquez la formation et la session pour rapprocher le retour du bon
          parcours. Les avis ne sont pas publiés automatiquement et les retours
          de test ne sont pas des résultats réels.
        </p>
      </QualityCard>
      <QualityForm kinds={["SATISFACTION", "TEACHING"]} />
    </QualityLayout>
  );
}
