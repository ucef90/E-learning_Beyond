import type { Metadata } from "next";
import { pageMetadata, siteOrigin } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Monitor,
  Phone,
} from "lucide-react";
import { trainingPresentation } from "@/lib/training-presentation";
import { getTrainingBySlug } from "@/lib/api";
import { DetailedProgrammeContent } from "@/components/detailed-programme";
import { TrainingAccess } from "@/components/training-access";
import { ProgrammeContact } from "@/components/programme-contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTrainingBySlug(slug);
  if (!t)
    return {
      title: "Formation introuvable",
      robots: { index: false, follow: false },
    };
  return pageMetadata(
    t.title + " | Beyond Expertise",
    (t.source?.syllabus?.overview || t.summary)
      .replace(/\s+/g, " ")
      .slice(0, 165),
    "/formations/" + t.slug,
  );
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTrainingBySlug(slug);
  if (!t) notFound();
  const presentation = trainingPresentation(t);
  const regulatory = t.source?.kind === "authored-regulatory";
  const programme = t.source?.syllabus;
  const origin = siteOrigin();
  const breadcrumb = origin
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Catalogue",
            item: origin + "/formations",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t.title,
            item: origin + "/formations/" + t.slug,
          },
        ],
      }
    : null;
  const quoteHref = {
    pathname: "/devis",
    query: { formation: t.title },
    hash: "quote-form",
  };
  return (
    <main
      id="contenu"
      className="section page-main-compact training-detail-page"
    >
      {breadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumb).replaceAll("<", "\\u003c"),
          }}
        />
      )}
      <div className="page-shell">
        <div className="breadcrumb-row">
          <Link href="/formations">Catalogue</Link>
          <span>/</span>
          <span>{t.category}</span>
        </div>
        <div className="detail-layout">
          <header className="detail-intro">
            <span className="detail-category">{t.category}</span>
            <h1 className="section-title training-detail-title">{t.title}</h1>
            <p className="detail-description">
              {programme?.overview || t.summary}
            </p>
            <div className="training-kpis">
              <span className="training-kpi">
                <Clock3 size={17} aria-hidden="true" />
                {t.duration}
                {programme ? ` · ${programme.totalHours} h` : ""}
              </span>
              <span className="training-kpi">
                <GraduationCap size={17} aria-hidden="true" />
                {t.level}
              </span>
              <span className="training-kpi">
                <Monitor size={17} aria-hidden="true" />
                {t.format}
              </span>
            </div>
            <div className="detail-intro-actions">
              {programme && (
                <a className="programme-jump" href="#programme">
                  Découvrir le programme{" "}
                  <ArrowDown size={17} aria-hidden="true" />
                </a>
              )}
              {regulatory && (
                <Link
                  className="detail-support-link"
                  href={`/formations/${slug}/support`}
                >
                  Lire les leçons et corrigés{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
            <div className="detail-audience">
              <section>
                <h2>Pour qui ?</h2>
                <p>
                  {programme?.audience ||
                    t.audience ||
                    "Public à préciser avec le centre."}
                </p>
              </section>
              <section>
                <h2>Prérequis</h2>
                <p>
                  {programme?.prerequisites ||
                    t.prerequisites ||
                    "Prérequis à préciser avec le centre."}
                </p>
              </section>
            </div>
          </header>
          <aside
            className="detail-sidebar"
            aria-label="Informations et contact pour cette formation"
          >
            <div className="detail-booking">
              <h2>Informations clés</h2>
              <dl className="detail-facts">
                <div>
                  <dt>Durée</dt>
                  <dd>
                    {t.duration}
                    {programme ? ` · ${programme.totalHours} h` : ""}
                  </dd>
                </div>
                <div>
                  <dt>Niveau</dt>
                  <dd>{t.level}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{t.format}</dd>
                </div>
              </dl>
              <div className="detail-price">
                <span>
                  {presentation.hasPrice
                    ? "Tarif indicatif à partir de"
                    : "Votre tarif"}
                </span>
                <strong>{presentation.price}</strong>
              </div>
              <div className="detail-session">
                <CalendarDays size={21} aria-hidden="true" />
                <div>
                  <span>Prochaine session proposée</span>
                  <strong>{presentation.session}</strong>
                  <small>
                    Date et disponibilité à confirmer avec le centre.
                  </small>
                </div>
              </div>
              <Link
                className="button button-accent detail-quote"
                href={quoteHref}
              >
                Demander un devis <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <a className="button button-secondary" href="tel:+33954702380">
                <Phone size={16} aria-hidden="true" />
                09 54 70 23 80
              </a>
              <Link
                className="detail-contact-link"
                href="/contact#contact-form"
              >
                Parler de mon projet avec le centre
              </Link>
              <p className="detail-booking-note">
                Tarif, dates et modalités contractuelles à confirmer avant
                inscription.
              </p>
            </div>
          </aside>
          <div className="detail-body training-content-stack">
            <section
              className="training-content-card detail-objectives"
              id="objectifs"
            >
              <p className="detail-eyebrow">
                Des compétences à mettre en pratique
              </p>
              <h2>Objectifs pédagogiques</h2>
              <ul className="catalog-objectives">
                {t.goals.map((goal, i) => (
                  <li key={i}>
                    <Check size={18} aria-hidden="true" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </section>
            {programme && <DetailedProgrammeContent programme={programme} />}
            <ProgrammeContact />
            <TrainingAccess title={t.title} />
            <section className="training-content-card" id="contenu-elearning">
              <h2>Contenu e-learning</h2>
              {t.courses.length ? (
                t.courses.map((course) => (
                  <div key={course.id}>
                    <p className="catalog-course-status ready">
                      Cours disponible · en validation pédagogique
                    </p>
                    <h3>{course.title}</h3>
                    <p>
                      Durée indicative : {course.estimatedMinutes} minutes. Ce{" "}
                      {regulatory ? (
                        "parcours comprend lectures, ateliers et évaluation. Les 14 heures correspondent à une session animée, hors pauses."
                      ) : (
                        <>
                          module couvre une partie du parcours {t.duration}{" "}
                          présenté sur le site officiel.
                        </>
                      )}
                    </p>
                    <ol className="catalog-syllabus">
                      {course.modules
                        .flatMap((m) => m.lessons)
                        .map((lesson, i) => (
                          <li key={i}>
                            <span>{lesson.title}</span>
                            <small>{lesson.durationMin} min</small>
                          </li>
                        ))}
                    </ol>
                    <p>
                      {regulatory
                        ? "Huit leçons, huit cas avec corrigés, cinq modèles et un quiz formatif de vingt questions à livre ouvert. Le dossier et la soutenance demandent une appréciation humaine distincte. Aucune certification officielle délivrée."
                        : "Exemples exécutables, atelier guidé, jeu de données synthétique, TP avec remise au formateur et quiz de dix questions. Le corrigé du TP devient accessible après le retour du formateur."}
                    </p>
                    <Link
                      className="button button-primary"
                      href="/apprentissage"
                    >
                      Accéder à mon module attribué
                    </Link>
                  </div>
                ))
              ) : (
                <>
                  <p className="catalog-course-status">
                    Cours e-learning à préparer
                  </p>
                  <p className="section-copy">
                    Les objectifs et prérequis sont disponibles. Les leçons,
                    supports et évaluations de ce parcours ne sont pas encore
                    intégrés dans cet espace. Le programme détaillé ci-dessus
                    décrit les apprentissages et les ateliers prévus.
                  </p>
                </>
              )}
            </section>

            <details className="detail-source">
              <summary>Origine des informations et statut du programme</summary>
              <p>
                {regulatory
                  ? "Programme original fondé sur des sources institutionnelles datées."
                  : "Durée, niveau, modalités, objectifs et tarif relevés sur le site officiel le 11 septembre 2026. Le déroulé détaillé a été enrichi par Beyond Expertise."}{" "}
                Validation pédagogique du formateur à réaliser avant animation.
              </p>
              {t.source?.sourceUrl && (
                <a
                  href={t.source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consulter la fiche du site officiel
                </a>
              )}
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
