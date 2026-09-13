import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title: "Assistant IA et contrôle humain | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Un assistant IA, un périmètre clair."
      intro="Fonctionnement du service — 13 septembre 2026. L’assistant vous aide à explorer les formations et à préparer votre échange avec le centre."
    >
      <QualityCard title="Ce que l’assistant peut faire">
        <p>
          L’assistant IA Beyond Expertise comprend votre demande pour vous
          orienter dans le catalogue, présenter les programmes et expliquer les
          informations publiques du centre. Il restitue les informations des
          fiches avec des liens vers les pages et les programmes PDF.
        </p>
        <p>
          Il ne confirme pas une inscription, une disponibilité, un financement
          ou une certification. Les tarifs, dates proposées et modalités
          contractuelles doivent être confirmés avec le centre.
        </p>
        <Link href="/contact">Parler à une personne du centre</Link>
      </QualityCard>
      <QualityCard title="Des réponses limitées aux informations publiques">
        <p>
          L’assistant n’accède ni aux comptes, ni aux travaux, ni aux dossiers
          des apprenants ou des clients. Il n’exécute pas de commande et ne
          dispose d’aucun outil pour agir sur un compte ou modifier des données.
          Les demandes hors du périmètre du site sont refusées ou orientées vers
          le centre.
        </p>
        <p>
          Les informations restituées proviennent d’un catalogue public préparé
          à partir des mêmes programmes que les fiches. En cas d’indisponibilité
          du moteur d’IA, une réponse de recherche dans le catalogue peut être
          proposée et signalée comme telle.
        </p>
      </QualityCard>
      <QualityCard title="Votre échange avec l’assistant">
        <p>
          Votre message est traité par les services Beyond et, lorsque disponible,
          par le moteur d’IA de cette infrastructure. Cette intégration ne transmet
          pas les échanges à un fournisseur d’IA externe. Le texte des
          conversations n’est pas enregistré dans la base de données ni dans un
          historique de discussion sur disque.
        </p>
        <p>
          Les messages affichés restent dans la mémoire de la page jusqu’à leur
          effacement ou son rechargement. Le bouton « Nouvelle conversation »
          efface l’échange affiché. Un compteur technique temporaire par adresse
          réseau limite les demandes pendant une minute, sans conserver leur
          contenu.
        </p>
        <p>
          N’envoyez pas de coordonnées personnelles, données sensibles ou pièces
          de dossier. Les informations de traitement figurent dans la
          politique de confidentialité du site.
        </p>
        <Link href="/confidentialite">Consulter la notice sur les données</Link>
      </QualityCard>
      <QualityCard title="La responsabilité pédagogique reste au centre">
        <p>
          Les programmes et supports sont proposés sous la responsabilité
          éditoriale de Beyond Expertise. Leur validation pédagogique, leur
          actualisation et leur adaptation doivent précéder l’animation d’une
          session. Les sources de référence figurent dans les programmes ; les
          exercices utilisent des situations et données fictives.
        </p>
        <p>
          L’assistant ne sélectionne pas les candidats et ne note pas les
          travaux. Les quiz calculent un score selon un barème fixe ; les
          retours pédagogiques sont saisis par le formateur. Une erreur peut
          être signalée pour relecture.
        </p>
        <Link href="/signalement">Signaler une information à corriger</Link>
      </QualityCard>
    </QualityLayout>
  );
}
