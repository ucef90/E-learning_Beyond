import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { QualityForm } from "@/components/quality-form";
export const metadata = { title: "Réclamations | Beyond Expertise" };
export default function Page() {
  return (
    <QualityLayout
      title="Faire examiner une difficulté."
      intro="Apprenant, formateur, entreprise ou financeur : signalez un écart entre votre attente et la prestation."
    >
      <QualityCard title="Les étapes de traitement">
        <ol>
          <li>
            Décrivez les faits, la date, la formation concernée et la solution
            attendue.
          </li>
          <li>Conservez la référence affichée après enregistrement.</li>
          <li>
            L’administrateur peut affecter le dossier à un responsable, fixer
            une échéance et tracer les actions.
          </li>
          <li>
            La clôture exige une résolution et la référence de la réponse
            effectivement communiquée. Le dossier peut être rouvert si
            nécessaire.
          </li>
        </ol>
        <p>
          Le traitement humain, les délais d’accusé de réception et de réponse
          doivent être organisés par le centre. L’enregistrement automatique
          n’est pas une réponse à votre réclamation.
        </p>
      </QualityCard>
      <QualityForm kinds={["COMPLAINT"]} />
    </QualityLayout>
  );
}
