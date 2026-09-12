import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = {
  title: "Données personnelles | Beyond Expertise",
  robots: { index: false },
};
export default function Page() {
  return (
    <QualityLayout
      title="Vos données dans cette version locale."
      intro="Informations sur les données utilisées pour vos demandes et votre parcours. Mise à jour : 12 septembre 2026."
    >
      <QualityCard title="Données et finalités">
        <p>
          Les formulaires recueillent vos coordonnées, la formation concernée et
          votre message pour préparer une formation, traiter une demande ou
          exploiter un retour pédagogique. Une note et un niveau déclaratif ne
          sont collectés que dans les questionnaires concernés.
        </p>
        <p>
          Les comptes enregistrent l’identité, les droits d’accès, les cours
          attribués, la progression déclarée, les quiz, travaux, corrections et
          événements de suivi. Les mots de passe sont hachés ; ils ne doivent
          jamais être communiqués dans un formulaire.
        </p>
      </QualityCard>
      <QualityCard title="Accès et stockage">
        <p>
          Cette copie stocke les informations dans une base locale sur
          l’ordinateur du projet. Les administrateurs habilités accèdent aux
          demandes. Les formateurs accèdent aux parcours qui leur sont attribués
          et les apprenants à leurs propres cours et résultats.
        </p>
        <p>
          Aucun email n’est envoyé automatiquement par les nouveaux formulaires.
          Les exports du registre peuvent contenir des données personnelles :
          ils doivent être conservés dans un emplacement protégé.
        </p>
      </QualityCard>
      <QualityCard title="Cookies et contenus externes">
        <p>
          Un cookie nécessaire à la connexion conserve un identifiant de session
          pendant huit heures au maximum. La déconnexion invalide la session. Le
          laboratoire conserve également un brouillon de travail dans le
          navigateur.
        </p>
        <p>
          La vidéo décorative de l’accueil est chargée depuis CloudFront. Le
          laboratoire utilise des ressources de calcul chargées par le
          navigateur. Ces chargements impliquent des communications avec leurs
          fournisseurs. Une protection Cloudflare Turnstile peut être activée
          sur les formulaires selon la configuration ; elle devra être
          documentée avant mise en ligne.
        </p>
      </QualityCard>
      <QualityCard title="Vos droits et points à finaliser">
        <p>
          Écrivez au contact du centre indiqué en haut de page pour demander
          l’accès, la rectification ou la suppression de vos informations, selon
          les conditions applicables, ainsi que des précisions sur vos autres
          droits. Vous pouvez adresser une réclamation à la{" "}
          <a href="https://www.cnil.fr/fr/adresser-une-plainte">CNIL</a>.
        </p>
        <p>
          Avant toute collecte réelle, le centre doit confirmer l’identité du
          responsable de traitement, la base légale de chaque usage, les durées
          de conservation, les destinataires et prestataires, les transferts
          éventuels et le traitement effectif des demandes de droits. Cette
          notice décrit le fonctionnement local et reste à compléter sur ces
          points.
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
