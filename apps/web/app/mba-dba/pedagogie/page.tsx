import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Pédagogie et accompagnement MBA & DBA | Beyond Expertise",
  "Positionnement, classes virtuelles, projets appliqués, tutorat et jalons de recherche : comprendre l’organisation des parcours Beyond.",
  "/mba-dba/pedagogie",
);
export default function Page() {
  return (
    <main id="contenu" className="executive page-shell executive-editorial">
      <Link href="/mba-dba">← MBA & DBA</Link>
      <span className="executive-eyebrow">L’accompagnement Beyond</span>
      <h1>
        Apprendre, produire,
        <br />
        recevoir un retour.
      </h1>
      <p className="executive-lead">
        Un parcours se construit avec des objectifs précis et des échanges
        utiles. Les modalités de chaque cohorte sont définies avant
        l’inscription, avec un calendrier et des responsabilités identifiées.
      </p>
      <section>
        <h2>Un rythme de travail lisible</h2>
        <div className="executive-editorial-grid">
          <article>
            <h3>Avant la séance</h3>
            <p>
              Consultez les supports attribués, préparez le cas et identifiez
              les points à discuter. Les ressources sont organisées par modules
              dans l’espace apprenant.
            </p>
          </article>
          <article>
            <h3>Pendant la classe virtuelle</h3>
            <p>
              Confrontez les méthodes à une situation concrète et échangez avec
              le formateur. Les liens de connexion et horaires sont communiqués
              à la cohorte ; un enregistrement n’est prévu que si les conditions
              de consentement et de diffusion le permettent.
            </p>
          </article>
          <article>
            <h3>Après la séance</h3>
            <p>
              Produisez votre livrable, remettez-le dans l’espace prévu et
              utilisez le retour pédagogique pour le corriger. Le suivi
              distingue lecture, travail remis et acquis évalués.
            </p>
          </article>
        </div>
      </section>
      <section>
        <h2>Le projet MBA : faire une proposition qui tient.</h2>
        <ol className="executive-step-list">
          <li>
            <strong>Délimiter une décision</strong>
            <p>
              Choisissez un problème circonscrit, un décideur et un résultat
              attendu. Vérifiez l’autorisation d’utiliser le terrain et ses
              données.
            </p>
          </li>
          <li>
            <strong>Comparer des solutions</strong>
            <p>
              Explicitez les hypothèses, les coûts et les risques d’au moins
              deux scénarios. Ne retenez pas une solution uniquement parce
              qu’elle paraît innovante.
            </p>
          </li>
          <li>
            <strong>Tester et mesurer</strong>
            <p>
              Définissez une mesure de départ, un pilote et des critères de
              réussite. Consignez les écarts et les effets non prévus.
            </p>
          </li>
          <li>
            <strong>Défendre les résultats</strong>
            <p>
              Présentez votre recommandation, les preuves qui l’appuient et ses
              limites. Le jury pédagogique examine le raisonnement et la qualité
              du travail personnel.
            </p>
          </li>
        </ol>
      </section>
      <section>
        <h2>Le DBA : huit jalons pour une recherche traçable.</h2>
        <p>
          Problématique, revue critique, protocole, pilote, analyse,
          contribution, manuscrit et soutenance structurent la progression. Le
          sujet est ajusté à l’accès au terrain et à la faisabilité.
        </p>
        <p>
          L’accompagnateur examine la méthode et les productions. Il ne rédige
          pas le travail à la place du candidat. La collecte commence après
          validation du protocole et des conditions éthiques. Le manuscrit est
          discuté en pré-soutenance avant la soutenance finale.
        </p>
        <p>
          Les publications externes dépendent des décisions des revues et ne
          sont jamais garanties. Le DBA présenté est un parcours de recherche
          professionnelle ; son statut et celui du titre visé sont détaillés
          avant engagement.
        </p>
        <Link href="/dba" className="button button-secondary">
          Explorer les axes de recherche
        </Link>
      </section>
      <section>
        <h2>Des conditions adaptées à votre contexte</h2>
        <ul>
          <li>
            Horaires et fuseaux de la cohorte communiqués avec le calendrier.
          </li>
          <li>
            Supports consultables sur ordinateur ; les activités qui nécessitent
            un outil spécifique sont annoncées.
          </li>
          <li>Besoins d’aménagement étudiés avant l’entrée en formation.</li>
          <li>
            Confidentialité du terrain et utilisation de données pédagogiques
            lorsqu’un accès réel n’est pas possible.
          </li>
          <li>
            Retour pédagogique et assistance accessibles par les canaux indiqués
            dans votre convention.
          </li>
        </ul>
        <p>
          Les noms des intervenants, leurs rôles et leurs disponibilités sont
          confirmés pour la cohorte concernée. Aucun intervenant n’est présenté
          comme engagé sans accord.
        </p>
      </section>
      <div className="executive-actions">
        <Link href="/mba-dba/candidature" className="button button-primary">
          Présenter mon projet
        </Link>
        <Link href="/apprentissage" className="button button-secondary">
          Accéder à mes cours
        </Link>
      </div>
    </main>
  );
}
