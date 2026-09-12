import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { QualityForm } from "@/components/quality-form";
export const metadata = {
  title: "Assistance technique et pédagogique | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Besoin d’aide pendant votre parcours ?"
      intro="Décrivez votre difficulté pour préparer une réponse technique, pédagogique ou administrative."
    >
      <div className="quality-grid">
        <QualityCard title="Un problème technique">
          <p>
            Précisez le cours, l’étape, votre navigateur, l’heure et le message
            d’erreur. Ne communiquez jamais votre mot de passe. Avant de
            recharger le laboratoire, téléchargez une copie de votre travail si
            cela reste possible.
          </p>
        </QualityCard>
        <QualityCard title="Une question pédagogique">
          <p>
            Indiquez la leçon ou l’exercice et ce qui bloque votre
            compréhension. Pour un travail déjà corrigé, consultez les
            commentaires dans votre espace apprenant.
          </p>
        </QualityCard>
      </div>
      <QualityCard title="Votre interlocuteur">
        <p>
          Le point d’entrée est le contact du centre indiqué en haut de page.
          Les horaires, le responsable d’assistance et les délais de réponse
          doivent être confirmés avec le centre avant le début d’une session
          réelle. Ce service local n’est pas une messagerie instantanée.
        </p>
      </QualityCard>
      <QualityForm kinds={["ASSISTANCE"]} />
    </QualityLayout>
  );
}
