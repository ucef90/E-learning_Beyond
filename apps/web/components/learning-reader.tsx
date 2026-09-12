"use client";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { api, download, canLeaveNotebook } from "@/lib/learning-api";
import Notebook from "./learning-notebook";
import LessonContent from "./lesson-content";
export default function Reader({
  id,
  user,
  back,
  initialTab,
}: {
  id: string;
  user: any;
  back: () => void;
  initialTab?: string;
}) {
  const [course, setCourse] = useState<any>(null),
    [state, setState] = useState<any>(null),
    [tab, setTab] = useState("fiche"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [answers, setAnswers] = useState<Record<string, string>>({});
  function go(next: string) {
    if (canLeaveNotebook()) setTab(next);
  }
  function leave() {
    if (canLeaveNotebook()) back();
  }
  async function refresh() {
    setState(await api(`/courses/${id}/state`));
  }
  useEffect(() => {
    let active = true;
    Promise.all([api(`/courses/${id}`), api(`/courses/${id}/state`)])
      .then(([c, s]) => {
        if (active) {
          setCourse(c);
          setState(s);
          const first = c.modules
            .flatMap((m: any) => m.lessons)
            .find(
              (l: any) =>
                l.type === "TEXT" &&
                !s.progress.some(
                  (p: any) => p.lessonId === l.id && p.completed,
                ),
            );
          setTab(initialTab || first?.id || "fiche");
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      })
      .catch((e) => setMessage(e.message));
    return () => {
      active = false;
    };
  }, [id, initialTab]);
  async function action(fn: () => Promise<any>, success: string) {
    setBusy(true);
    try {
      await fn();
      await refresh();
      setMessage(success);
      return true;
    } catch (e) {
      setMessage((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  if (!course || !state)
    return (
      <>
        <button className="button button-secondary" onClick={leave}>
          Revenir aux modules
        </button>
        <p role="status">{message || "Chargement de votre parcours…"}</p>
      </>
    );
  const regulatoryCode =
    course.slug === "rgpd-protection-donnees-pratique-parcours-v1"
      ? "rgpd"
      : course.slug === "ai-act-maitrise-ia-gouvernance-parcours-v1"
        ? "ai-act"
        : null;
  const lessons = course.modules.flatMap((m: any) => m.lessons);
  const textLessons = lessons.filter((l: any) => l.type === "TEXT");
  const selected = lessons.find((l: any) => l.id === tab);
  const quiz = lessons.find((l: any) => l.quiz)?.quiz;
  const tp = lessons.find((l: any) => l.type === "PDF");
  const done = state.progress.filter((p: any) => p.completed).length;
  const finished = (lid: string) =>
    state.progress.some((p: any) => p.lessonId === lid && p.completed);
  return (
    <>
      <div className="learning-breadcrumb">
        <button onClick={leave}>Mes modules</button>
        <span>/</span>
        <span>{course.title}</span>
      </div>
      <div className="learning-course-heading">
        <div>
          <p className="learning-kicker">
            Parcours · {course.estimatedMinutes} min · Version {course.version}
          </p>
          <h1>{course.title}</h1>
        </div>
        <div className="learning-completion">
          <strong>
            {done}/{textLessons.length}
          </strong>
          <span>leçons déclarées lues</span>
          <progress
            max={textLessons.length}
            value={done}
            aria-label="Leçons déclarées lues"
          />
        </div>
      </div>
      <p role="status">{message}</p>
      {regulatoryCode && (
        <div className="regulatory-actions">
          <a
            href={
              "/formations/" +
              course.slug.replace("-parcours-v1", "") +
              "/support"
            }
          >
            Support intégral et sources officielles
          </a>
          <a
            href={"/reglementation/" + regulatoryCode + "-modeles.md"}
            download
          >
            Télécharger mon carnet de travail
          </a>
        </div>
      )}
      <div className="learning-reader">
        <aside className="learning-sidebar">
          <details open>
            <summary>Votre progression</summary>
            <nav aria-label="Contenu du module">
              <button
                aria-current={tab === "fiche" ? "page" : undefined}
                onClick={() => go("fiche")}
              >
                Fiche et objectifs
              </button>
              {textLessons.map((l: any, i: number) => (
                <button
                  key={l.id}
                  aria-current={tab === l.id ? "page" : undefined}
                  onClick={() => go(l.id)}
                >
                  <span>
                    {finished(l.id) ? "✓" : String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    {l.title}
                    <small>{l.durationMin} min</small>
                  </span>
                </button>
              ))}
              {course.resources.hasPractice && (
                <button
                  aria-current={tab === "practice" ? "page" : undefined}
                  onClick={() => go("practice")}
                >
                  Atelier guidé · Les six leçons
                </button>
              )}
              {course.resources.hasNotebook && (
                <button
                  aria-current={tab === "tp" ? "page" : undefined}
                  onClick={() => go("tp")}
                >
                  TP · Pratiquer sur les ventes
                </button>
              )}
              {quiz && (
                <button
                  aria-current={tab === "quiz" ? "page" : undefined}
                  onClick={() => go("quiz")}
                >
                  Quiz · Vérifier mes acquis
                </button>
              )}
              <button
                aria-current={tab === "resultats" ? "page" : undefined}
                onClick={() => go("resultats")}
              >
                Résultats et retours
              </button>
            </nav>
          </details>
        </aside>
        <article className="learning-content" id="lecon" tabIndex={-1}>
          {tab === "fiche" ? (
            <>
              <h2>Votre feuille de route</h2>
              <p>{course.summary}</p>
              <dl className="learning-brief">
                {Object.entries(course.brief || {}).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{String(v)}</dd>
                  </div>
                ))}
              </dl>
              <p className="learning-notice">
                Support en validation pédagogique. Ce parcours ne délivre pas de
                certification professionnelle.
              </p>
            </>
          ) : selected?.type === "TEXT" ? (
            <>
              <p className="learning-kicker">
                Leçon {textLessons.indexOf(selected) + 1} ·{" "}
                {selected.durationMin} min
              </p>
              <h2>{selected.title}</h2>
              <div className="lesson-prose">
                <LessonContent body={selected.content?.body || ""} />
              </div>
              {selected.videoUrl && (
                <details>
                  <summary>Ouvrir la ressource vidéo complémentaire</summary>
                  <a
                    href={selected.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lire la vidéo sur l’hébergeur autorisé
                  </a>
                  <p>{selected.content?.transcript}</p>
                </details>
              )}
              <div className="learning-actions">
                <button
                  className="button button-primary"
                  disabled={busy || !state.access}
                  onClick={() =>
                    void action(
                      () =>
                        api(
                          `/courses/${id}/lessons/${selected.id}/progress`,
                          "PUT",
                          { completed: !finished(selected.id) },
                        ),
                      "Progression sauvegardée sur le serveur.",
                    )
                  }
                >
                  {finished(selected.id)
                    ? "Marquer comme à relire"
                    : "Marquer la leçon comme lue"}
                </button>
                {textLessons.indexOf(selected) < textLessons.length - 1 && (
                  <button
                    className="button button-secondary"
                    onClick={() =>
                      go(textLessons[textLessons.indexOf(selected) + 1].id)
                    }
                  >
                    Leçon suivante
                  </button>
                )}
              </div>
              <p className="learning-note">
                {course.resources.hasNotebook
                  ? "Cette déclaration suit votre lecture ; les acquis seront évalués par le quiz et le TP."
                  : "Cette déclaration suit votre lecture. Le quiz est formatif ; le dossier et la soutenance demandent un retour distinct du formateur."}
              </p>
            </>
          ) : tab === "practice" ? (
            <Notebook
              key="practice"
              courseId={id}
              state={state}
              refresh={refresh}
              practice
            />
          ) : tab === "tp" ? (
            <>
              <div className="lesson-prose">
                <Markdown skipHtml>{tp?.content?.body || ""}</Markdown>
              </div>
              <Notebook
                key="tp"
                courseId={id}
                state={state}
                refresh={refresh}
              />
            </>
          ) : tab === "quiz" && quiz ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const saved = await action(
                  () =>
                    api(`/courses/${id}/quizzes/${quiz.id}/attempts`, "POST", {
                      answers: quiz.questions.map((q: any) => answers[q.id]),
                    }),
                  "Quiz évalué. Consultez vos résultats et les explications.",
                );
                if (saved) setTab("resultats");
              }}
            >
              <h2>{quiz.title}</h2>
              <p>
                Dix questions, environ 20 minutes. Seuil de réussite :{" "}
                {quiz.passingScore} %. Chaque tentative est conservée.
              </p>
              {quiz.questions.map((q: any, i: number) => (
                <fieldset className="quiz-question" key={q.id}>
                  <legend>
                    {i + 1}. {q.prompt}
                  </legend>
                  {q.answers.map((a: any) => (
                    <label key={a.id}>
                      <input
                        type="radio"
                        name={q.id}
                        value={a.id}
                        checked={answers[q.id] === a.id}
                        onChange={() =>
                          setAnswers({ ...answers, [q.id]: a.id })
                        }
                        required
                      />
                      {a.label}
                    </label>
                  ))}
                </fieldset>
              ))}
              <button
                className="button button-primary"
                disabled={busy || !state.access}
              >
                Valider mes réponses
              </button>
            </form>
          ) : tab === "resultats" ? (
            <>
              <h2>Vos résultats et retours</h2>
              <p>
                {course.resources.hasNotebook
                  ? "Réussite du module : toutes les leçons déclarées lues, quiz à 70 % minimum et TP à 70/100 minimum après correction humaine."
                  : "Suivi individuel : leçons déclarées lues et quiz formatif à 70 % minimum. Le dossier et la soutenance restent à évaluer séparément avec le formateur ; ce suivi ne vaut pas validation complète de la formation."}
              </p>
              <h3>Quiz</h3>
              {state.attempts.length ? (
                state.attempts.map((a: any) => (
                  <details key={a.id} className="learning-result">
                    <summary>
                      {a.score}% ·{" "}
                      {new Date(a.completedAt).toLocaleString("fr-FR")} ·{" "}
                      {a.score >= 70 ? "Seuil atteint" : "À retravailler"}
                    </summary>
                    {a.feedback?.map((f: any, i: number) => (
                      <div key={i}>
                        <h4>
                          {f.correct ? "✓" : "À revoir"} · {f.prompt}
                        </h4>
                        <p>Votre réponse : {f.answer}</p>
                        <p>{f.explanation}</p>
                      </div>
                    ))}
                  </details>
                ))
              ) : (
                <p>Aucune tentative. Ouvrez le quiz lorsque vous êtes prêt.</p>
              )}
              <h3>Travaux remis</h3>
              {state.submissions.length ? (
                state.submissions.map((s: any) => (
                  <section className="learning-result" key={s.id}>
                    <h4>
                      Remise du {new Date(s.createdAt).toLocaleString("fr-FR")}
                    </h4>
                    <p>
                      {s.reviewedAt
                        ? `${s.grade}/100 · Corrigé le ${new Date(s.reviewedAt).toLocaleString("fr-FR")}`
                        : "En attente du retour de votre formateur"}
                    </p>
                    <p className="preserve-lines">
                      {s.feedback ||
                        "Le formateur évaluera votre démarche selon la grille du TP."}
                    </p>
                    <button
                      className="button button-secondary"
                      onClick={() =>
                        void action(async () => {
                          const r = await api(
                            `/courses/${id}/submissions/${s.id}`,
                          );
                          download("travail-remis.ipynb", r.notebook);
                        }, "Copie de la remise exportée.")
                      }
                    >
                      Exporter cette remise
                    </button>
                  </section>
                ))
              ) : (
                <p>
                  {course.resources.hasNotebook
                    ? "Aucun travail remis. Le notebook peut être sauvegardé avant sa remise."
                    : "Les livrables de ce parcours sont à préparer dans votre carnet de travail et à présenter au formateur. Leur évaluation n’est pas enregistrée automatiquement par le quiz."}
                </p>
              )}
              {state.submissions.some((s: any) => s.reviewedAt) && (
                <button
                  className="button button-secondary"
                  onClick={() =>
                    void action(
                      async () =>
                        download(
                          "corrige.ipynb",
                          await api(`/courses/${id}/resources/solution`),
                        ),
                      "Corrigé exporté.",
                    )
                  }
                >
                  Télécharger le corrigé commenté
                </button>
              )}
              <button
                className="button button-secondary"
                onClick={() =>
                  void action(
                    async () =>
                      download(
                        "releve-pedagogique.json",
                        await api(`/courses/${id}/learners/${user.id}/export`),
                      ),
                    "Relevé pédagogique exporté.",
                  )
                }
              >
                Exporter mon relevé pédagogique
              </button>
            </>
          ) : null}
        </article>
      </div>
    </>
  );
}
