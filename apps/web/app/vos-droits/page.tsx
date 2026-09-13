import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { QualityForm } from "@/components/quality-form";
import { PersonalData } from "@/components/personal-data";
export const metadata = {
  title: "Exercer vos droits sur vos données | Beyond Expertise",
  robots: { index: false },
};
export default function Page() {
  return (
    <QualityLayout
      title="Vos données, vos droits."
      intro="Accès, rectification, effacement, opposition, limitation ou portabilité : précisez votre demande sans joindre de document sensible."
    >
      <QualityCard title="Récupérer les données de mon compte">
        <PersonalData />
      </QualityCard>
      <QualityCard title="Adresser une demande au centre">
        <p>
          Vous pouvez aussi écrire à contact@beyondexpertise.eu ou appeler le 09
          54 70 23 80. Le délai légal de principe est d’un mois à compter de la
          réception ; une prolongation motivée peut être nécessaire dans les
          conditions du RGPD et doit être annoncée dans le premier mois.
          Certains droits dépendent de la base légale et de la situation.
        </p>
        <p>
          Ce formulaire enregistre votre demande dans le registre du centre.
          Conservez la référence affichée après envoi pour suivre son traitement.
          Vous pouvez également contacter le centre par email ou téléphone.
        </p>
        <p>
          Le centre peut demander une précision proportionnée pour vérifier
          l’identité avant de communiquer des données. Ne transmettez pas ici de
          pièce d’identité, mot de passe ou diagnostic. Le centre doit organiser
          un canal adapté si une vérification supplémentaire est nécessaire.
        </p>
      </QualityCard>
      <QualityForm kinds={["DATA_RIGHTS"]} />
      <QualityCard title="En cas de difficulté">
        <p>
          Le centre doit motiver un refus ou une restriction et indiquer les
          recours. Vous pouvez adresser une{" "}
          <a href="https://www.cnil.fr/fr/adresser-une-plainte">
            plainte à la CNIL
          </a>
          .{" "}
          <a href="/confidentialite">
            Consulter les informations sur vos données
          </a>
          .
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
