import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title: "Données personnelles et cookies | Beyond Expertise",
  robots: { index: false },
};
export default function Page() {
  return (
    <QualityLayout
      title="Vos données sur cette plateforme."
      intro="Notice de la plateforme — mise à jour le 13 septembre 2026. Contact : contact@beyondexpertise.eu · 09 54 70 23 80."
    >
      <QualityCard title="Qui utilise les données ?">
        <p>
          Beyond Expertise utilise les données pour traiter vos demandes et
          organiser les formations. Pour toute question sur vos données ou pour
          exercer vos droits, contactez le centre aux coordonnées indiquées
          ci-dessus. Les informations sont hébergées sur le serveur de la
          plateforme en France ; l’accès aux dossiers est réservé aux personnes
          habilitées.
        </p>
      </QualityCard>
      <QualityCard title="Données, usages et destinataires">
        <ul>
          <li>
            Candidatures MBA/DBA : identité, coordonnées, pays, formation
            antérieure, expérience, fonction, projet et financement envisagé,
            afin d’étudier la demande et de préparer l’entretien. Les dossiers
            et notes de suivi sont accessibles à l’administration. Aucune
            utilisation publicitaire ni transmission à un partenaire n’est
            déduite de cette demande.
          </li>
          <li>
            Contact, devis et inscription : coordonnées, entreprise éventuelle,
            formation et besoin exprimé, pour instruire la demande. Accès
            réservé aux personnes habilitées à son traitement.
          </li>
          <li>
            Comptes : email, profil, rôles et mot de passe haché ; session de
            connexion et sécurité d’accès.
          </li>
          <li>
            Apprentissage : parcours attribués, leçons déclarées lues, réponses
            et scores de quiz, brouillons, travaux et retours. L’apprenant
            accède à ses données ; le formateur aux groupes qui lui sont
            attribués ; l’administration aux fonctions autorisées.
          </li>
          <li>
            Qualité et droits : demande, coordonnées déclarées, appréciation ou
            niveau seulement lorsque pertinent, statut, responsable, échéance et
            historique. Les administrateurs habilités traitent ces demandes ;
            les identités déclarées ne sont pas automatiquement vérifiées.
          </li>
        </ul>
        <p>
          Les champs marqués * sont nécessaires à la demande correspondante.
          Leur absence peut empêcher son enregistrement. N’ajoutez pas de
          données sensibles, pièces d’identité ou mots de passe dans un message
          libre. Les exports doivent être conservés dans un emplacement protégé.
        </p>
      </QualityCard>
      <QualityCard title="Bases légales et conservation à confirmer">
        <p>
          Le centre doit documenter la base légale de chaque finalité et les
          durées ou critères applicables, y compris pour les demandes, preuves
          pédagogiques, journaux et sauvegardes. Le contrat ne couvre pas
          automatiquement tout usage ; les obligations légales doivent être
          identifiées et l’intérêt légitime justifié lorsqu’il est retenu.
        </p>
        <p>
          Aucun consentement publicitaire n’est demandé ni présumé à partir d’un
          formulaire. Le cookie de connexion expire au plus tard après huit
          heures ; la déconnexion invalide la session. Les données métier et
          archives n’ont pas encore de purge automatique fondée sur une
          politique validée du centre. Leur conservation ne doit pas être
          présentée comme définitivement conforme.
        </p>
      </QualityCard>
      <QualityCard title="Stockage, cookies et chargements">
        <p>
          Les données de la plateforme sont stockées sur le VPS OVH de Beyond
          à Gravelines, en France. La vidéo de l’accueil, les photos et les logos sont
          servis localement : leur affichage ne contacte pas de service tiers.
          Aucun outil de publicité ou de mesure d’audience n’est intégré dans
          cette version.
        </p>
        <p>
          Le cookie HttpOnly <code>be_elearning_session</code> est réservé à la
          connexion demandée. Les brouillons de notebook sont enregistrés sur le
          serveur de la plateforme ; le laboratoire exécute le calcul dans le navigateur
          avec des ressources servies localement sur une origine distincte.
          Aucun bandeau de consentement publicitaire n’est nécessaire pour ces
          seuls usages strictement nécessaires.
        </p>
        <p>
          Cloudflare Turnstile peut être activé par configuration pour la
          protection des formulaires. Son activation introduit des échanges avec
          Cloudflare : le centre devra alors documenter prestataire, finalité,
          données techniques, garanties et transferts éventuels. Les liens vers
          des sources officielles n’ouvrent leur site qu’à votre demande.
        </p>
        <p>
          Les accès au site et au laboratoire utilisent HTTPS. Les sauvegardes
          et journaux techniques servent à la continuité et à la sécurité du
          service ; leur accès est réservé aux administrateurs habilités.
        </p>
      </QualityCard>
      <QualityCard title="Exercer vos droits">
        <p>
          Selon votre situation, vous pouvez demander accès, rectification,
          effacement, limitation, opposition ou portabilité ; retirer un
          consentement lorsque cette base est utilisée ; et saisir la CNIL. Le
          délai de principe est d’un mois, avec prolongation motivée possible
          dans les conditions légales. L’effacement n’est pas automatique
          lorsque certaines données doivent légalement être conservées.
        </p>
        <div className="regulatory-actions">
          <Link className="button button-primary" href="/vos-droits">
            Faire une demande ou exporter mes données
          </Link>
          <a href="https://www.cnil.fr/fr/adresser-une-plainte">
            Saisir la CNIL
          </a>
        </div>
        <p>
          Les formulaires locaux n’envoient pas d’email automatique. Pour
          contacter effectivement le centre, utilisez contact@beyondexpertise.eu
          ou le téléphone indiqué.
        </p>
      </QualityCard>
      <QualityCard title="IA et décisions">
        <p>
          Le quiz utilise un barème fixe ; cette version n’intègre pas de
          décision d’admission ni de correction par un modèle d’IA. L’assistant
          visiteurs consulte uniquement les informations publiques du catalogue.
          Les messages sont traités sur cet ordinateur ; aucun échange n’est
          envoyé à un fournisseur d’IA externe par cette intégration. Les
          conversations ne sont pas enregistrées dans la base ni dans un
          historique sur disque. Elles restent en mémoire dans la page jusqu’à
          effacement ou rechargement. Un compteur par adresse réseau, conservé
          une minute en mémoire, limite les demandes. Ne transmettez pas de
          données personnelles dans l’assistant.
        </p>
        <Link href="/transparence-ia">Comprendre les usages de l’IA</Link>
      </QualityCard>
    </QualityLayout>
  );
}
