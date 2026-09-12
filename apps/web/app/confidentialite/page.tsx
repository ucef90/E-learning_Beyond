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
      intro="Notice de la version locale — mise à jour le 12 septembre 2026. Contact : contact@beyondexpertise.eu · 09 54 70 23 80."
    >
      <QualityCard title="Qui utilise les données ?">
        <p>
          La plateforme est préparée pour Beyond Expertise. L’identité juridique
          complète, l’adresse du responsable de traitement et le contact DPO, si
          un DPO est désigné, restent à confirmer par le centre. Cette copie
          sert aux essais locaux ; cette notice doit être complétée avant une
          collecte réelle et la mise en ligne.
        </p>
      </QualityCard>
      <QualityCard title="Données, usages et destinataires">
        <ul>
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
          Les données d’essai sont stockées dans la base locale du projet sur
          cet ordinateur. Le décor de l’accueil est maintenant rendu localement
          : aucune vidéo CloudFront n’est chargée. Aucun outil de publicité ou
          de mesure d’audience n’est intégré dans cette version.
        </p>
        <p>
          Le cookie HttpOnly <code>be_elearning_session</code> est réservé à la
          connexion demandée. Les brouillons de notebook sont enregistrés sur le
          serveur local ; le laboratoire exécute le calcul dans le navigateur
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
          La mise en ligne changera l’hébergement et les destinataires
          techniques. Les contrats, localisations, transferts éventuels et
          mesures HTTPS devront être vérifiés pour l’environnement effectivement
          retenu.
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
          décision d’admission ni de correction par un modèle d’IA. Les contenus
          préparés avec assistance d’IA et leurs limites sont expliqués dans
          notre page de transparence.
        </p>
        <Link href="/transparence-ia">Comprendre les usages de l’IA</Link>
      </QualityCard>
    </QualityLayout>
  );
}
