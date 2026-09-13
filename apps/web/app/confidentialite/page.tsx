import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { ConsentSettings } from "@/components/campaign-consent";
import { company } from "@/lib/company";
import { centre } from "@/lib/centre";
export const metadata = {
  title: "Données personnelles et cookies | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Vos données, vos choix."
      intro="Politique de confidentialité — version du 13 septembre 2026. Les demandes restent accessibles même lorsque vous refusez les cookies facultatifs."
    >
      <QualityCard title="Responsable du traitement">
        <p>
          {company.name}, {company.address}, SIREN {company.siren}, est
          responsable des traitements du site. Contact :{" "}
          <a href={centre.emailHref}>{centre.email}</a>.
        </p>
      </QualityCard>
      <QualityCard title="Demandes commerciales et candidatures">
        <p>
          Nous utilisons les coordonnées, le pays, le programme choisi et les
          informations de projet que vous transmettez pour répondre à votre
          demande, vérifier l’adéquation du parcours et préparer les échanges et
          documents précontractuels. Les champs obligatoires sont indiqués dans
          le formulaire ; le téléphone devient obligatoire pour un rappel
          demandé.
        </p>
        <p>
          Ces traitements répondent à votre demande précontractuelle. Le rappel
          ou contact est expressément demandé dans le formulaire, sans
          inscription automatique à une newsletter. Vos disponibilités et les
          notes de suivi sont accessibles aux personnes autorisées de Beyond.
        </p>
        <p>
          Les nouveaux prospects du formulaire Afrique sont supprimés
          automatiquement après douze mois s’ils n’ont pas été inscrits. Les
          dossiers de candidature et de formation suivent leur propre cycle :
          traitement du dossier, durée de la relation et, pour les pièces
          nécessaires, obligations de preuve, comptabilité ou litiges. Une
          demande d’effacement permet d’examiner les données qui ne sont plus
          nécessaires ; l’effacement n’est pas automatique pour l’ensemble des
          dossiers historiques.
        </p>
      </QualityCard>
      <QualityCard title="Mesure des campagnes, avec votre accord">
        <p>
          Si vous acceptez les statistiques, nous conservons pendant trente
          jours dans votre navigateur la première et la dernière origine de
          campagne : source, support, campagne, contenu, terme, pays de
          campagne, page d’arrivée et domaine référent. Le pays de campagne est
          distinct de votre pays de résidence. Ces informations peuvent être
          rattachées à la demande que vous envoyez.
        </p>
        <p>
          La mesure interne enregistre des événements tels que la consultation
          d’un programme, le début de formulaire, le téléchargement d’une
          brochure ou un clic téléphone/WhatsApp. Les événements sont conservés
          quatre-vingt-dix jours. Ils ne contiennent ni nom, ni email, ni numéro
          de téléphone, ni identifiant de session visiteur, ni adresse IP. Les
          inscriptions sont comptées à partir des dossiers réellement confirmés
          par l’administration.
        </p>
        <p>
          Google Analytics 4 peut être activé si configuré et après accord aux
          statistiques. Meta Pixel peut être activé si configuré et après accord
          à la mesure publicitaire. Ces prestataires peuvent traiter des données
          techniques et des identifiants dans leurs environnements, y compris
          hors de l’Union européenne selon leurs garanties contractuelles. Aucun
          de ces outils n’est chargé sans le consentement correspondant. Les
          champs des formulaires ne leur sont pas transmis par notre
          instrumentation.
        </p>
        <p>
          <a href="https://policies.google.com/privacy">Politique de Google</a>{" "}
          ·{" "}
          <a href="https://www.facebook.com/privacy/policy/">
            Politique de Meta
          </a>
          . Le refus ne bloque ni les formulaires ni les cours.
        </p>
      </QualityCard>
      <QualityCard title="Cookies et stockage nécessaires">
        <p>
          Votre choix de consentement est conservé six mois. La confirmation
          d’une demande utilise le stockage de session du navigateur pour
          retrouver son reçu sans afficher vos coordonnées dans l’adresse de la
          page. La connexion utilise une session sécurisée ; les informations
          nécessaires à la progression et aux travaux sont liées à votre compte.
        </p>
        <p>
          Vous pouvez modifier vos choix à tout moment. Le retrait supprime
          l’attribution enregistrée dans le navigateur et arrête les nouvelles
          mesures après rechargement. Il ne retire pas rétroactivement une
          demande déjà enregistrée ; contactez-nous pour exercer vos droits.
        </p>
        <ConsentSettings />
      </QualityCard>
      <QualityCard title="Sécurité, hébergement et destinataires">
        <p>
          Le site et sa base de données sont hébergés chez OVHcloud en France.
          Les données sont accessibles aux personnels autorisés selon leurs
          fonctions. Les accès d’administration sont protégés. Des informations
          techniques limitées sont utilisées pour la sécurité, la limitation des
          abus et le fonctionnement du service.
        </p>
        <p>
          Lorsqu’il est activé, le contrôle anti-robot Cloudflare Turnstile
          protège les formulaires. Un clic sur un service externe, tel que
          WhatsApp, vous fait accéder à ce service sous ses propres conditions.
          Nous ne vendons pas vos données.
        </p>
      </QualityCard>
      <QualityCard title="Plateforme pédagogique, assistance et IA">
        <p>
          Les comptes, inscriptions, travaux, évaluations, demandes
          d’assistance, réclamations et demandes d’exercice de droits sont
          traités pour fournir le service et assurer son suivi. Les ressources
          de laboratoire sont servies depuis l’infrastructure Beyond ; les liens
          externes sont signalés lorsqu’ils mènent vers un autre service.
        </p>
        <p>
          Évitez de saisir des données sensibles dans l’assistant public.
          Consultez la{" "}
          <Link href="/transparence-ia">
            présentation de ses usages et limites
          </Link>
          . Les échanges de l’assistant ne servent pas à mesurer les campagnes
          publicitaires.
        </p>
      </QualityCard>
      <QualityCard title="Exercer vos droits">
        <p>
          Vous pouvez demander l’accès, la rectification, l’effacement, la
          limitation, l’opposition ou la portabilité lorsque ce droit
          s’applique. Utilisez{" "}
          <Link href="/vos-droits">le formulaire d’exercice des droits</Link> ou
          écrivez à {centre.email}. Une vérification proportionnée de votre
          identité peut être nécessaire.
        </p>
        <p>
          Nous répondons en principe dans un délai d’un mois, sous réserve des
          prolongations prévues pour les demandes complexes. Vous pouvez saisir
          la <a href="https://www.cnil.fr/fr/plaintes">CNIL</a> si vous estimez
          que vos droits ne sont pas respectés.
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
