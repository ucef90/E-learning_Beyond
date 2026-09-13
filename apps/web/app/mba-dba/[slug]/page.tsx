import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowDownToLine } from "lucide-react";
import {
  credentialNote,
  executiveProgrammes,
  launchNote,
  programmeBySlug,
} from "@/lib/executive";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return executiveProgrammes.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = programmeBySlug(slug);
  return p
    ? pageMetadata(
        `${p.kind} ${p.title} | Beyond Expertise`,
        p.promise,
        `/mba-dba/${slug}`,
      )
    : { title: "Parcours introuvable" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = programmeBySlug(slug);
  if (!p) notFound();
  const apply = `/mba-dba/candidature?programme=${p.slug}` as const;
  return (
    <main id="contenu" className="executive executive-detail page-shell">
      <nav className="executive-breadcrumb" aria-label="Fil d’Ariane">
        <Link href="/mba-dba">MBA & DBA</Link>
        <span>/</span>
        <Link href={p.kind === "MBA" ? "/mba" : "/dba"}>{p.kind}</Link>
        <span>/</span>
        <span>{p.domain}</span>
      </nav>
      <section className="executive-detail-hero">
        <div>
          <span className="executive-eyebrow">
            {p.kind === "MBA"
              ? "MBA · Parcours professionnel"
              : "DBA · Recherche appliquée en administration des affaires"}
          </span>
          <h1>{p.title}</h1>
          <p>{p.promise}</p>
          <div className="executive-actions">
            <Link href={apply} className="button button-accent">
              Présenter ma candidature <ArrowRight size={18} />
            </Link>
            <a href="#programme" className="executive-text-link">
              Lire le programme <ArrowRight size={17} />
            </a>
          </div>
        </div>
        <div className="executive-detail-facts">
          <dl>
            <div>
              <dt>Durée cible</dt>
              <dd>{p.months}</dd>
            </div>
            <div>
              <dt>Rythme indicatif</dt>
              <dd>{p.pace}</dd>
            </div>
            <div>
              <dt>Format proposé</dt>
              <dd>À distance · classes virtuelles</dd>
            </div>
            <div>
              <dt>Langue de travail</dt>
              <dd>Français</dd>
            </div>
          </dl>
          <p>
            Calendrier, intervenants et modalités confirmés avant inscription.
          </p>
        </div>
      </section>
      <nav className="executive-anchor-nav" aria-label="Dans cette fiche">
        <a href="#objectifs">Objectifs</a>
        <a href="#programme">Programme</a>
        <a href="#projet">Projet & évaluation</a>
        <a href="#admission">Admission & tarif</a>
      </nav>
      <div className="executive-detail-grid">
        <div>
          <section id="objectifs">
            <span className="executive-eyebrow">Ce que vous saurez faire</span>
            <h2>Des compétences qui se démontrent.</h2>
            <ul className="executive-outcomes">
              {p.outcomes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <h3>À qui s’adresse ce parcours ?</h3>
            <p>{p.audience}</p>
            <h3>Perspectives professionnelles</h3>
            <ul>
              {p.jobs.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="executive-note">
              Ces perspectives dépendent de votre expérience et des exigences du
              poste. Une formation ne confère pas, à elle seule, l’autorisation
              d’exercer une profession réglementée.
            </p>
          </section>
          <section id="programme">
            <span className="executive-eyebrow">
              {p.modules.length}{" "}
              {p.kind === "MBA" ? "modules articulés" : "jalons de recherche"}
            </span>
            <h2>Le programme, étape par étape.</h2>
            <p>
              {p.kind === "MBA"
                ? "Trois modules de socle, six modules de spécialisation et un projet final. Chaque étape donne lieu à une production concrète."
                : "Un cadre méthodologique commun, appliqué à votre axe de recherche. Chaque jalon donne lieu à un retour pédagogique et à des corrections avant la suite du travail."}
            </p>
            <div className="executive-modules">
              {p.modules.map((m, i) => (
                <details key={m.title} open={i === 0}>
                  <summary>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{m.title}</strong>
                    <span className="executive-expand" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div>
                    <h3>Questions et méthodes travaillées</h3>
                    <ul>
                      {m.topics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <p className="executive-deliverable">
                      <strong>Votre livrable</strong>
                      {m.deliverable}
                    </p>
                  </div>
                </details>
              ))}
            </div>
            {p.methods && (
              <>
                <h3>Méthodes à explorer pour cet axe</h3>
                <ul>
                  {p.methods.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p>
                  Le choix définitif dépend de la question, du terrain et des
                  données effectivement accessibles.
                </p>
              </>
            )}
          </section>
          <section id="projet">
            <span className="executive-eyebrow">
              Appliquer, argumenter, défendre
            </span>
            <h2>
              {p.kind === "DBA"
                ? "Votre recherche part d’une question utile."
                : "Un projet ancré dans la réalité."}
            </h2>
            <div className="executive-case">
              <span>
                {p.kind === "DBA"
                  ? "Exemple de question de recherche"
                  : "Situation pédagogique proposée"}
              </span>
              <p>{p.caseStudy}</p>
            </div>
            <h3>Production finale attendue</h3>
            <p>{p.capstone}</p>
            <h3>Évaluation et reprises</h3>
            <p>{p.assessment}</p>
            <h3>Un travail original et documenté</h3>
            <p>
              Les sources sont citées, les données sensibles protégées et les
              usages d’IA déclarés. Les productions personnelles doivent pouvoir
              être expliquées et défendues par leur auteur. Les cas proposés
              sont pédagogiques et ne constituent pas des missions clients déjà
              réalisées.
            </p>
          </section>
          <section id="admission">
            <span className="executive-eyebrow">Préparer votre entrée</span>
            <h2>Admission, organisation et financement.</h2>
            <h3>Prérequis et étude du dossier</h3>
            <p>{p.admission}</p>
            <h3>Rythme et accompagnement</h3>
            <p>
              Le parcours associe préparation en autonomie, classes virtuelles,
              travaux appliqués et retours du formateur. Les horaires tiennent
              compte des contraintes de la cohorte ; ils sont communiqués avec
              le calendrier. Les éventuelles séquences en présentiel font
              l’objet d’un accord spécifique.
            </p>
            <h3>Tarif et prise en charge</h3>
            <p>
              Sur devis, après étude de votre projet. Le devis détaille les
              prestations incluses, le calendrier de paiement et les frais
              éventuels. Le financement employeur et un éventuel échéancier
              peuvent être étudiés. Aucune prise en charge ni éligibilité CPF
              n’est garantie.
            </p>
            <h3>Accessibilité</h3>
            <p>
              Signalez les adaptations souhaitées au moment de l’entretien. Les
              besoins de rythme, de supports et d’accès technique sont étudiés
              avant engagement.
            </p>
            <p>{launchNote}</p>
            <Link href={apply} className="button button-primary">
              Déposer ma demande <ArrowRight size={18} />
            </Link>
          </section>
          <section className="executive-assurance">
            <h2>Statut du parcours et du titre visé</h2>
            <p>{credentialNote}</p>
            <Link href="/mba-dba/certifications">
              Consulter les informations sur les titres et certifications
            </Link>
          </section>
        </div>
        <aside className="executive-detail-aside">
          <h2>Construisons votre parcours.</h2>
          <p>
            Expliquez votre expérience et le défi que vous souhaitez relever.
            Beyond étudiera l’adéquation du programme avec votre projet.
          </p>
          <Link href={apply} className="button button-primary">
            Candidater <ArrowRight size={17} />
          </Link>
          <Link
            href={{pathname:"/mba-dba/candidature",query:{programme:p.slug,demande:"information"}}}
            className="button button-secondary"
          >
            Demander un entretien
          </Link>
          <a
            href={`/programmes-executive/${p.slug}.pdf`}
            className="executive-download"
            download
          >
            <ArrowDownToLine size={18} /> Télécharger le programme PDF
          </a>
          <hr />
          <Link href="/mba-dba/pedagogie">
            Comment se déroule le parcours ?
          </Link>
          <Link href="/apprentissage">Déjà inscrit ? Accéder à mes cours</Link>
          <p className="executive-note">
            La demande est sans paiement et sans engagement contractuel.
          </p>
        </aside>
      </div>
    </main>
  );
}
