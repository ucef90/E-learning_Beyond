import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrainingBySlug } from "@/lib/api";
export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTrainingBySlug(slug);
  if (!t) notFound();
  return (
    <main id="contenu" className="section page-main-compact">
      <div className="page-shell">
        <div className="breadcrumb-row">
          <Link href="/formations">Catalogue</Link>
          <span>/</span>
          <span>{t.category}</span>
        </div>
        <div className="training-detail-hero">
          <section>
            <h1 className="section-title training-detail-title">{t.title}</h1>
            <p className="section-copy">{t.summary}</p>
            <div className="training-kpis">
              <span>{t.duration}</span>
              <span>{t.level}</span>
              <span>{t.format}</span>
            </div>
            <div className="training-content-stack">
              <section className="training-content-card">
                <h2>Objectifs pédagogiques</h2>
                <ul className="catalog-objectives">
                  {t.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </section>
              <div className="training-audience-grid">
                <section className="training-content-card">
                  <h2>Public cible</h2>
                  <p className="section-copy">
                    {t.audience || "Public à préciser."}
                  </p>
                </section>
                <section className="training-content-card">
                  <h2>Prérequis</h2>
                  <p className="section-copy">
                    {t.prerequisites || "Prérequis à préciser."}
                  </p>
                </section>
              </div>
              <section className="training-content-card">
                <h2>Contenu e-learning</h2>
                {t.courses.length ? (
                  t.courses.map((course) => (
                    <div key={course.id}>
                      <p className="catalog-course-status ready">
                        Module pilote · en validation pédagogique
                      </p>
                      <h3>{course.title}</h3>
                      <p>
                        Durée indicative : {course.estimatedMinutes} minutes. Ce
                        module couvre une partie du parcours {t.duration}{" "}
                        présenté sur le site officiel.
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
                        Exemples exécutables, atelier guidé, jeu de données
                        synthétique, TP avec remise au formateur et quiz de dix
                        questions. Le corrigé du TP devient accessible après le
                        retour du formateur.
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
                      intégrés dans cet espace. Le programme pédagogique
                      détaillé reste à rédiger et à valider.
                    </p>
                  </>
                )}
              </section>
            </div>
          </section>
          <aside className="training-sidepanel">
            <div className="card training-sidecard">
              <h2>Fiche de référence</h2>
              <p>
                Informations relevées sur le site officiel le 11 septembre 2026.
              </p>
              <dl className="catalog-reference">
                <dt>Durée de l’offre</dt>
                <dd>{t.duration}</dd>
                <dt>Modalité annoncée</dt>
                <dd>{t.format}</dd>
                <dt>Tarif affiché sur le site officiel</dt>
                <dd>{t.source?.observedPrice || t.priceFrom}</dd>
              </dl>
              <p className="learning-note">
                Tarif et calendrier à confirmer auprès de Beyond Expertise.
                Aucune session commerciale n’est ouverte dans cette version
                locale.
              </p>
              {t.source?.sourceUrl && (
                <a
                  className="button button-secondary"
                  href={t.source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir la fiche officielle
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
