import Link from "next/link";
import { CampaignLeadForm } from "@/components/campaign-lead-form";
import { executiveProgrammes, programmeHref } from "@/lib/executive";
import { centre } from "@/lib/centre";
export const metadata = {
  title: "MBA & DBA à distance en Afrique francophone | Beyond Expertise",
  description:
    "Direction, projets, transformation digitale et recherche appliquée : choisissez votre parcours Beyond, consultez le programme et échangez avec un conseiller.",
};
const focus = [
  "mba-direction-strategie-croissance",
  "mba-projets-programmes-agilite",
  "mba-transformation-digitale-ia",
  "dba-innovation-technologies",
];
const questions = [
  [
    "Quel programme choisir ?",
    "Le MBA accompagne un projet de progression managériale. Le DBA s’adresse à des professionnels expérimentés souhaitant conduire une recherche appliquée. Un conseiller vérifie avec vous les prérequis et l’adéquation du parcours.",
  ],
  [
    "Peut-on suivre le parcours depuis l’Afrique ?",
    "Le parcours peut être suivi à distance : classes en visioconférence, ressources, travaux et accompagnement en ligne. Les horaires, le fuseau de référence et les éventuelles adaptations sont confirmés avant inscription. Un ordinateur et une connexion internet sont nécessaires.",
  ],
  [
    "Quel diplôme est délivré ?",
    "Beyond Expertise organise ces parcours professionnels. La nature exacte du document de fin de parcours, son émetteur et ses conditions d’obtention figurent dans le dossier contractuel remis avant inscription. Les intitulés MBA et DBA ne constituent pas à eux seuls une preuve de reconnaissance officielle.",
  ],
  [
    "Quelle reconnaissance ou double diplomation ?",
    "Aucune équivalence avec un diplôme national, accréditation universitaire ou double diplomation n’est annoncée sur cette page. Consultez les informations sur les titres et certifications, puis demandez les justificatifs correspondant au parcours avant de vous engager.",
  ],
  [
    "Quelle durée et quels prérequis ?",
    "Chaque fiche indique la durée cible, le rythme, le niveau d’études et l’expérience attendus. Le calendrier définitif et l’admission sont confirmés après étude de votre dossier.",
  ],
  [
    "Quels tarifs et possibilités de paiement ?",
    "Demandez une proposition pour votre programme. Elle précisera le prix total, la devise, la fiscalité applicable, les prestations incluses et l’échéancier proposé. Un financement employeur ou un paiement échelonné peut être étudié, sans accord automatique.",
  ],
  [
    "Quand commence la prochaine rentrée ?",
    "L’équipe vous communique les sessions disponibles et les horaires compatibles avec votre situation. Aucune date n’est considérée comme réservée par l’envoi du formulaire.",
  ],
  [
    "Comment se déroule l’admission ?",
    "Vous recevez le programme, échangez avec un conseiller, puis présentez votre candidature. L’équipe étudie votre parcours. L’inscription intervient après admission et formalisation du contrat, avec les informations pédagogiques et commerciales.",
  ],
];
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string; demande?: string }>;
}) {
  const q = await searchParams,
    selected = focus
      .map((s) => executiveProgrammes.find((p) => p.slug === s))
      .filter((p) => !!p);
  return (
    <main id="contenu" className="campaign-page">
      <section className="campaign-hero">
        <div className="page-shell campaign-hero-grid">
          <div>
            <p className="executive-eyebrow">
              Beyond Expertise · Afrique francophone
            </p>
            <h1>
              Faites grandir vos responsabilités.
              <br />
              <em>À votre rythme, à distance.</em>
            </h1>
            <p className="campaign-intro">
              Des parcours MBA et DBA pour relier votre expérience, les méthodes
              de management et les défis de votre organisation.
            </p>
            <div className="campaign-actions">
              <a href="#demande" className="button button-accent">
                Recevoir la brochure
              </a>
              <a href="#parcours" className="campaign-light-link">
                Comparer les parcours ↓
              </a>
            </div>
            <ul className="campaign-points">
              <li>Enseignement en français</li>
              <li>Accompagnement à distance</li>
              <li>Projets appliqués à votre métier</li>
            </ul>
          </div>
          <div className="campaign-route">
            <span>DE VOTRE PROJET À VOTRE PARCOURS</span>
            <ol>
              <li>
                <strong>Choisissez votre direction</strong>
                <p>Management, projets, digital ou recherche appliquée.</p>
              </li>
              <li>
                <strong>Échangez avec un conseiller</strong>
                <p>Prérequis, organisation, tarifs et prochaines sessions.</p>
              </li>
              <li>
                <strong>Construisez votre candidature</strong>
                <p>Un dossier étudié avant toute inscription.</p>
              </li>
            </ol>
            <a href={centre.phoneHref}>Nous joindre : +33 9 54 70 23 80 ↗</a>
          </div>
        </div>
      </section>
      <section id="parcours" className="page-shell campaign-section">
        <p className="executive-eyebrow">Quatre parcours pour démarrer</p>
        <h2>Votre expérience. Une nouvelle ambition.</h2>
        <p className="campaign-intro">
          Une sélection issue des expertises de Beyond en management, gestion de
          projet et intelligence artificielle. Retrouvez tous les autres
          parcours dans le catalogue.
        </p>
        <div className="campaign-programmes">
          {selected.map((p) => (
            <article key={p.slug}>
              <span className="executive-eyebrow">
                {p.kind} · {p.domain}
              </span>
              <h3>
                <Link href={programmeHref(p)}>{p.title}</Link>
              </h3>
              <p>{p.promise}</p>
              <p>
                <strong>Durée cible : {p.months}</strong>
                <br />
                {p.pace}
              </p>
              <Link href={programmeHref(p)} className="campaign-programme-link">
                Programme, prérequis et évaluations →
              </Link>
              <Link
                href={{
                  pathname: "/afrique",
                  query: { programme: p.slug, demande: "TARIFF" },
                  hash: "demande",
                }}
              >
                Demander les tarifs
              </Link>
            </article>
          ))}
        </div>
        <p>
          <Link href="/mba">Tous les MBA →</Link> ·{" "}
          <Link href="/dba">Tous les DBA →</Link> ·{" "}
          <Link href="/mba-dba/pedagogie">Notre pédagogie →</Link>
        </p>
      </section>
      <section className="campaign-request-band" id="demande">
        <div className="page-shell campaign-request-grid">
          <div>
            <p className="executive-eyebrow">Parlons de la suite</p>
            <h2>Le bon parcours commence par votre projet.</h2>
            <p>
              Recevez le programme détaillé ou demandez un échange avec Beyond.
              Indiquez votre pays pour préparer un accompagnement adapté à votre
              situation.
            </p>
            <p>
              Vous préférez être rappelé ? Choisissez cette option et précisez
              vos disponibilités. Notre équipe conviendra du rendez-vous avec
              vous.
            </p>
            <p>
              <a href={centre.phoneHref}>+33 9 54 70 23 80</a>
              <br />
              <a href={centre.emailHref}>{centre.email}</a>
            </p>
            <p className="campaign-small">
              BEYOND EXPERTISE · Organisme de formation
              <br />
              23 rue Marcel Houdet, 77000 Melun, France
              <br />
              <Link href="/mentions-legales">
                Identification de l’organisme
              </Link>{" "}
              ·{" "}
              <Link href="/conditions-formation">Conditions et admission</Link>
            </p>
          </div>
          <CampaignLeadForm
            key={(q.programme || "") + (q.demande || "")}
            initialProgramme={q.programme}
            initialIntent={q.demande}
          />
        </div>
      </section>
      <section className="page-shell campaign-section campaign-faq">
        <p className="executive-eyebrow">Avant de vous décider</p>
        <h2>Vos questions, sans détour.</h2>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        <p>
          <Link href="/mba-dba/certifications">
            Lire les informations sur les titres et certifications
          </Link>
        </p>
      </section>
    </main>
  );
}
