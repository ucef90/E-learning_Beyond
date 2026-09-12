import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { QualityForm } from "@/components/quality-form";
export const metadata = {
  title: "Handicap et accessibilité | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Étudier les adaptations dont vous avez besoin."
      intro="Un besoin lié au handicap ou une difficulté d’accès ? Préparez un échange avec le centre avant votre inscription ou pendant votre parcours."
    >
      <QualityCard title="Une demande centrée sur vos besoins">
        <p>
          Décrivez un besoin de rythme, de lisibilité, d’accès aux supports, de
          matériel ou de modalités d’évaluation, sans communiquer de diagnostic
          ni de document médical.
        </p>
        <p>
          Le centre devra étudier la faisabilité avec vous, confirmer les
          aménagements et leurs conditions ou proposer une orientation vers un
          interlocuteur compétent. Aucun aménagement ne doit être présenté comme
          accordé avant cet échange.
        </p>
      </QualityCard>
      <div className="quality-grid">
        <QualityCard title="Contact et accueil">
          <p>
            Contactez le centre aux coordonnées en haut de page. La personne
            référente handicap et les conditions d’accessibilité des locaux
            restent à confirmer. Ne vous déplacez pas sans avoir vérifié le lieu
            et les modalités d’accueil.
          </p>
        </QualityCard>
        <QualityCard title="Accessibilité du site">
          <p>
            Les formulaires proposent des libellés explicites, une navigation au
            clavier et des retours d’erreur. Une réduction des animations est
            prévue selon les réglages du navigateur.
          </p>
          <p>
            Un audit RGAA complet n’a pas été réalisé. Signalez une difficulté
            en précisant la page et l’action bloquante.
          </p>
        </QualityCard>
      </div>
      <QualityForm kinds={["ACCESSIBILITY"]} />
    </QualityLayout>
  );
}
