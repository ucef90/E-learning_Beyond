import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title: "Usages de l’IA et contrôle humain | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Comprendre la place de l’IA ici."
      intro="Fonctionnement de la version locale vérifiée le 12 septembre 2026. Une information précise sur les outils, les contenus et les décisions."
    >
      <QualityCard title="Votre parcours et vos évaluations">
        <p>
          Cette version n’intègre pas de chatbot, de sélection des candidats par
          IA, de reconnaissance des émotions ni de notation des travaux par un
          modèle d’IA. Le quiz compare vos réponses au corrigé prévu et calcule
          un score avec un barème fixe. Les retours sur les travaux sont saisis
          par le formateur.
        </p>
        <p>
          Un score de quiz est un indicateur pédagogique. Il ne constitue pas
          une décision d’admission ni une certification officielle. Si vous
          contestez une question ou un résultat, demandez une relecture au
          centre.
        </p>
        <Link href="/reclamations">
          Demander une relecture ou signaler une difficulté
        </Link>
      </QualityCard>
      <QualityCard title="Comment les contenus sont préparés">
        <p>
          Des outils d’IA ont aidé à rédiger et structurer les programmes et les
          nouveaux supports RGPD et AI Act. Les sources officielles sont
          indiquées avec une date de consultation. La validation pédagogique du
          formateur doit précéder l’animation d’une session ; les supports
          signalent ce statut.
        </p>
        <p>
          Les exercices utilisent des entreprises et données fictives. Une
          sortie d’IA peut contenir une erreur : le centre doit vérifier les
          références, les exemples et les évolutions réglementaires. Signalez un
          passage à corriger en précisant la formation et la séquence.
        </p>
        <Link href="/signalement">Signaler une erreur dans un contenu</Link>
      </QualityCard>
      <QualityCard title="Avant tout futur usage d’IA auprès des apprenants">
        <p>
          Le centre devra inventorier l’usage, qualifier son rôle et les
          risques, vérifier les données et fournisseurs, organiser la maîtrise
          de l’IA des personnes concernées et prévoir supervision, information
          et recours. Un outil qui influence l’admission ou l’évaluation des
          acquis exige une analyse spécifique de l’AI Act et du RGPD avant
          déploiement.
        </p>
        <p>
          Cette page décrit le logiciel local examiné. Elle n’atteste pas
          l’ensemble des usages internes du centre ni sa conformité globale aux
          règlements.
        </p>
        <Link href="/rgpd-ai-act">Découvrir les formations RGPD et AI Act</Link>
      </QualityCard>
    </QualityLayout>
  );
}
