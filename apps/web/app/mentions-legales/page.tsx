import Link from "next/link";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { company } from "@/lib/company";
import { centre } from "@/lib/centre";
export const metadata = { title: "Mentions légales | Beyond Expertise" };
export default function Page() {
  return (
    <QualityLayout
      title="Mentions légales."
      intro="Identification de l’éditeur et de l’hébergeur de beyond-expertise.com. Mise à jour : 13 septembre 2026."
    >
      <QualityCard title="Éditeur du site">
        <p>
          <strong>{company.name}</strong> — {company.legalForm} au capital de{" "}
          {company.capital}.
        </p>
        <p>
          Siège social : {company.address}.<br />
          SIREN : {company.siren} · {company.registry}.<br />
          SIRET du siège : {company.siret}.<br />
          TVA intracommunautaire : {company.vat}.
        </p>
        <p>Directrice de la publication : {company.publicationDirector}.</p>
        <p>
          Téléphone : <a href={centre.phoneHref}>{centre.phone}</a> · Email :{" "}
          <a href={centre.emailHref}>{centre.email}</a>.
        </p>
        <p>
          <a
            href={company.registryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consulter la fiche de l’entreprise dans l’Annuaire des entreprises
          </a>
          .
        </p>
      </QualityCard>
      <QualityCard title="Organisme de formation">
        <p>
          Déclaration d’activité enregistrée sous le numéro {company.nda}. Cet
          enregistrement ne vaut pas agrément de l’État.
        </p>
        <p>
          La déclaration d’activité ne constitue ni une certification Qualiopi
          ni une reconnaissance des diplômes. Les informations propres à chaque
          titre sont présentées sur la{" "}
          <Link href="/mba-dba/certifications">
            page titres et certifications
          </Link>
          .
        </p>
      </QualityCard>
      <QualityCard title="Hébergement">
        <p>Le site est hébergé sur un VPS OVHcloud à Gravelines, en France.</p>
        <p>
          OVH SAS — 2 rue Kellermann, 59100 Roubaix, France. Téléphone : 1007.{" "}
          <a href="https://www.ovhcloud.com/fr/terms-and-conditions/">
            Coordonnées légales de l’hébergeur
          </a>
          .
        </p>
      </QualityCard>
      <QualityCard title="Utilisation, demandes et données personnelles">
        <p>
          Les formulaires de demande d’information et de candidature ne
          constituent pas une inscription définitive. Consultez les{" "}
          <Link href="/conditions-formation">
            conditions de demande et de formation
          </Link>{" "}
          ainsi que la{" "}
          <Link href="/confidentialite">
            politique de confidentialité et de cookies
          </Link>
          .
        </p>
        <p>
          Pour signaler une erreur ou un contenu,{" "}
          <Link href="/signalement">adressez un signalement au centre</Link>.
        </p>
      </QualityCard>
      <QualityCard title="Propriété intellectuelle et crédits">
        <p>
          Les textes, supports et éléments graphiques de Beyond Expertise sont
          protégés. Toute réutilisation doit respecter les droits de leurs
          titulaires. Les marques citées appartiennent à leurs propriétaires ;
          leur présence ne vaut pas annonce d’un partenariat ou d’une
          habilitation.
        </p>
        <p>
          Photo d’illustration :{" "}
          <a href="https://unsplash.com/photos/people-sitting-near-table-with-laptop-computer-qCi_MzVODoU">
            Campaign Creators, Unsplash
          </a>
          , sous <a href="https://unsplash.com/license">licence Unsplash</a>.
          Les scènes MBA et DBA générées sont indiquées comme illustrations avec
          personnages fictifs ; elles ne constituent pas des témoignages de
          diplômés Beyond.
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
