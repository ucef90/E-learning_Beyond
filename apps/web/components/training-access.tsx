import Link from "next/link";
import { CentreContact } from "./quality-layout";
export function TrainingAccess({ title }: { title: string }) {
  return (
    <section className="training-content-card" id="acces-formation">
      <h2>Accès, accompagnement et reconnaissance</h2>
      <p>
        Le centre doit confirmer les prérequis, le programme final, les dates,
        les horaires et le tarif avant inscription. Le délai d’accès dépend des
        disponibilités et du besoin ; aucune session commerciale n’est ouverte
        dans cette copie locale.
      </p>
      <p>
        Les ateliers, méthodes et évaluations du programme sont proposés pour
        validation pédagogique. Les supports effectivement disponibles sont
        indiqués dans la section « Contenu e-learning ».
      </p>
      <p>
        Le parcours local ne délivre pas de diplôme ni de certification
        professionnelle. Aucune éligibilité CPF ou prise en charge n’est
        garantie. Toute préparation à un examen externe devra faire l’objet
        d’informations et d’habilitations vérifiées.
      </p>
      <div className="quality-actions">
        <Link href={`/positionnement?formation=${encodeURIComponent(title)}`}>
          Préparer mon positionnement
        </Link>
        <Link href="/informations-pratiques">Modalités et délais d’accès</Link>
        <Link href="/accessibilite">Handicap et aménagements</Link>
        <Link href="/assistance">Assistance</Link>
      </div>
      <CentreContact />
    </section>
  );
}
