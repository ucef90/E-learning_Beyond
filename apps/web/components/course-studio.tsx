"use client";
import { useEffect, useState, FormEvent } from "react";
import { api } from "@/lib/learning-api";
import LessonContent from "./lesson-content";
const labels: Record<string, string> = {
  objectifs: "Objectifs observables",
  public: "Public concerné",
  prerequis: "Prérequis",
  duree: "Durée et organisation",
  modalites: "Modalités pédagogiques",
  evaluation: "Évaluations",
  assistance: "Assistance pédagogique et technique",
  accessibilite: "Accessibilité et adaptations",
  acces: "Modalités et délais d'accès",
  revision: "Révision pédagogique",
};
const status: Record<string, string> = {
  DRAFT: "Brouillon",
  IN_REVIEW: "À relire",
  APPROVED: "Validé",
};
const emptyLesson = (type = "TEXT") => ({
  title: "",
  type,
  body: "",
  durationMin: 10,
  videoUrl: "",
  transcript: "",
  ...(type === "QUIZ"
    ? {
        quiz: {
          title: "Quiz de validation",
          passingScore: 70,
          questions: [
            {
              prompt: "",
              explanation: "",
              answers: [
                { label: "", isCorrect: true },
                { label: "", isCorrect: false },
              ],
            },
          ],
        },
      }
    : {}),
});
const empty = () => ({
  revision: 1,
  title: "",
  summary: "",
  trainingId: "",
  brief: Object.fromEntries(Object.keys(labels).map((k) => [k, ""])),
  modules: [{ title: "", lessons: [emptyLesson()] }],
  assessmentMode: "NONE",
  assessmentScore: 70,
  rubric: "",
});
function toForm(c: any) {
  return {
    revision: c.version,
    title: c.title,
    summary: c.summary || "",
    trainingId: c.trainingId || "",
    brief: { ...empty().brief, ...c.brief },
    assessmentMode: c.assessment.mode,
    assessmentScore: c.assessment.passingScore,
    rubric: c.assessment.rubric || "",
    modules: c.modules.map((m: any) => ({
      title: m.title,
      lessons: m.lessons.map((l: any) => ({
        title: l.title,
        type: l.type,
        body: l.content?.body || "",
        durationMin: l.durationMin || 10,
        videoUrl: l.videoUrl || "",
        transcript: l.content?.transcript || "",
        ...(l.quiz
          ? {
              quiz: {
                title: l.quiz.title,
                passingScore: l.quiz.passingScore ?? 70,
                questions: l.quiz.questions.map((q: any) => ({
                  prompt: q.prompt,
                  explanation: q.explanation,
                  answers: q.answers.map((a: any) => ({
                    label: a.label,
                    isCorrect: a.isCorrect,
                  })),
                })),
              },
            }
          : {}),
      })),
    })),
  };
}
export default function CourseStudio({
  isAdmin,
  onChanged,
}: {
  isAdmin: boolean;
  onChanged: () => Promise<void>;
}) {
  const [courses, setCourses] = useState<any[]>([]),
    [trainings, setTrainings] = useState<any[]>([]),
    [trainers, setTrainers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null),
    [form, setForm] = useState<any>(null),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [filter, setFilter] = useState(""),
    [panel, setPanel] = useState("content"),
    [note, setNote] = useState("");
  async function load() {
    setCourses(await api("/courses/authoring/list"));
  }
  useEffect(() => {
    void load().catch((e) => setError(e.message));
    if (isAdmin) {
      void api("/trainings")
        .then(setTrainings)
        .catch((e) => setError(e.message));
      void api("/courses/admin/users")
        .then((u) =>
          setTrainers(
            u.filter(
              (x: any) =>
                x.status === "ACTIVE" &&
                x.roles.some((r: any) => r.role.code === "TRAINER"),
            ),
          ),
        )
        .catch((e) => setError(e.message));
    }
  }, [isAdmin]);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const navigate = (e: Event) => {
      if (
        !window.confirm("Quitter sans enregistrer les modifications du cours ?")
      )
        e.preventDefault();
    };
    window.addEventListener("beforeunload", prevent);
    window.addEventListener("notebook-before-leave", navigate);
    return () => {
      window.removeEventListener("beforeunload", prevent);
      window.removeEventListener("notebook-before-leave", navigate);
    };
  }, [dirty]);
  function change(update: (draft: any) => void) {
    const copy = structuredClone(form);
    update(copy);
    setForm(copy);
    setDirty(true);
  }
  async function open(id: string, force = false) {
    if (
      dirty &&
      !force &&
      !window.confirm("Quitter sans enregistrer les modifications du cours ?")
    )
      return;
    setBusy(true);
    setError("");
    try {
      const c = await api("/courses/" + id + "/authoring");
      setSelected(c);
      setForm(toForm(c));
      setDirty(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function act(fn: () => Promise<any>, success: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await fn();
      await load();
      await onChanged();
      if (selected) await open(selected.id, true);
      setMessage(success);
      return result;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const c = await api(
        selected
          ? "/courses/" + selected.id + "/authoring"
          : "/courses/authoring",
        selected ? "PUT" : "POST",
        form,
      );
      setDirty(false);
      await load();
      await onChanged();
      await open(c.id, true);
      setMessage(
        "Brouillon enregistré. La validation pédagogique reste une étape distincte.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const locked =
    !!selected && (selected.isPublished || selected._count.learning > 0);
  const canManage = !!selected && !dirty && !busy;
  function newCourse() {
    if (
      dirty &&
      !window.confirm("Quitter sans enregistrer les modifications du cours ?")
    )
      return;
    setSelected(null);
    setForm(empty());
    setDirty(false);
    setPanel("content");
    setMessage("");
    setError("");
  }
  async function uploadResource(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget),
      file = data.get("file") as File,
      name = String(data.get("name"));
    if (!file?.size || file.size > 1500000) {
      setError("Choisissez un fichier de 1,5 Mo maximum.");
      return;
    }
    try {
      const text = await file.text();
      const payload =
        name === "csv" ? { csv: text } : { notebook: JSON.parse(text) };
      await act(
        () =>
          api("/courses/" + selected.id + "/authoring/resource", "PUT", {
            revision: selected.version,
            name,
            ...payload,
          }),
        "Ressource enregistrée dans le cours privé.",
      );
    } catch {
      setError("Ce fichier n'est pas un notebook JSON valide.");
    }
  }
  async function uploadAsset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget),
      file = data.get("file") as File;
    if (!file?.size || file.size > 1048576) {
      setError("Choisissez un fichier de 1 Mo maximum.");
      return;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    await act(
      () =>
        api("/courses/" + selected.id + "/assets", "POST", {
          revision: selected.version,
          title: data.get("title"),
          filename: file.name,
          base64: btoa(binary),
          visibility: data.get("visibility"),
        }),
      "Fichier ajouté. Ses droits sont contrôlés à chaque téléchargement.",
    );
  }
  function move(items: any[], index: number, delta: number) {
    const j = index + delta;
    if (j < 0 || j >= items.length) return;
    [items[index], items[j]] = [items[j], items[index]];
  }
  return (
    <section className="course-studio">
      <div className="studio-heading">
        <div>
          <h1>Contenus pédagogiques</h1>
          <p>
            Préparez les leçons, les activités et les ressources. Faites relire
            chaque version avant sa publication.
          </p>
        </div>
        <button
          className="button button-primary"
          onClick={newCourse}
          disabled={busy}
        >
          Créer un cours
        </button>
      </div>
      {error && (
        <p role="alert" className="studio-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="learning-notice">
          {message}
        </p>
      )}
      <div className="studio-layout">
        <aside className="studio-list">
          <label>
            Rechercher un cours
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </label>
          <nav aria-label="Cours à préparer">
            {courses
              .filter((c) =>
                c.title
                  .toLocaleLowerCase("fr")
                  .includes(filter.toLocaleLowerCase("fr")),
              )
              .map((c) => (
                <button
                  key={c.id}
                  aria-current={selected?.id === c.id ? "page" : undefined}
                  onClick={() => void open(c.id)}
                  disabled={busy}
                >
                  <strong>{c.title}</strong>
                  <span>
                    {status[c.editorialStatus] || "En validation"} · v
                    {c.version}
                  </span>
                  <small>
                    {c._count.learning} attribution(s)
                    {c.isPublished ? " · Visible au catalogue" : ""}
                  </small>
                </button>
              ))}
          </nav>
          {!courses.length && (
            <p>
              Aucun cours confié à votre compte. Vous pouvez préparer un premier
              brouillon.
            </p>
          )}
        </aside>
        <div className="studio-workspace">
          {form ? (
            <>
              <div className="studio-toolbar">
                <strong>
                  {selected ? "Version " + selected.version : "Nouveau cours"}
                  {dirty ? " · Modifications non enregistrées" : ""}
                </strong>
                <div className="learning-actions">
                  {["content", "resources", "review"].map((p) => (
                    <button
                      key={p}
                      aria-pressed={panel === p}
                      className="button button-secondary"
                      onClick={() => setPanel(p)}
                    >
                      {p === "content"
                        ? "Leçons et quiz"
                        : p === "resources"
                          ? "Fichiers"
                          : "Validation"}
                    </button>
                  ))}
                </div>
              </div>
              {locked && (
                <p className="learning-notice">
                  Cette version est figée pour conserver les parcours existants.{" "}
                  <button
                    className="button button-secondary"
                    disabled={busy}
                    onClick={() =>
                      void act(
                        () =>
                          api("/courses/" + selected.id + "/clone", "POST", {}),
                        "Nouvelle version créée dans la liste.",
                      )
                    }
                  >
                    Dupliquer pour modifier
                  </button>
                </p>
              )}
              {panel === "content" && (
                <form className="learning-form" onSubmit={save}>
                  <fieldset disabled={busy || locked}>
                    <legend>Fiche du cours</legend>
                    <label>
                      Titre du cours
                      <input
                        required
                        minLength={3}
                        maxLength={200}
                        value={form.title}
                        onChange={(e) =>
                          change((f) => {
                            f.title = e.target.value;
                          })
                        }
                      />
                    </label>
                    <label>
                      Présentation
                      <textarea
                        required
                        minLength={10}
                        maxLength={2000}
                        value={form.summary}
                        onChange={(e) =>
                          change((f) => {
                            f.summary = e.target.value;
                          })
                        }
                      />
                    </label>
                    {isAdmin && (
                      <label>
                        Formation du catalogue
                        <select
                          value={form.trainingId}
                          onChange={(e) =>
                            change((f) => {
                              f.trainingId = e.target.value;
                            })
                          }
                        >
                          <option value="">
                            Cours privé sans rattachement
                          </option>
                          {trainings.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <details>
                      <summary>Objectifs, public et modalités</summary>
                      <div className="learning-fields">
                        {Object.entries(labels).map(([key, label]) => (
                          <label key={key}>
                            {label}
                            <textarea
                              rows={3}
                              maxLength={3000}
                              value={form.brief[key] || ""}
                              onChange={(e) =>
                                change((f) => {
                                  f.brief[key] = e.target.value;
                                })
                              }
                            />
                          </label>
                        ))}
                      </div>
                    </details>
                  </fieldset>
                  {form.modules.map((m: any, mi: number) => (
                    <fieldset key={mi} disabled={busy || locked}>
                      <legend>Module {mi + 1}</legend>
                      <label>
                        Titre du module
                        <input
                          required
                          minLength={3}
                          maxLength={200}
                          value={m.title}
                          onChange={(e) =>
                            change((f) => {
                              f.modules[mi].title = e.target.value;
                            })
                          }
                        />
                      </label>
                      <div className="learning-actions">
                        <button
                          type="button"
                          className="button button-secondary"
                          disabled={mi === 0}
                          onClick={() => change((f) => move(f.modules, mi, -1))}
                        >
                          Monter le module
                        </button>
                        <button
                          type="button"
                          className="button button-secondary"
                          disabled={mi === form.modules.length - 1}
                          onClick={() => change((f) => move(f.modules, mi, 1))}
                        >
                          Descendre le module
                        </button>
                        <button
                          type="button"
                          className="button button-secondary"
                          disabled={form.modules.length === 1}
                          onClick={() =>
                            change((f) => {
                              f.modules.splice(mi, 1);
                            })
                          }
                        >
                          Retirer le module
                        </button>
                      </div>
                      {m.lessons.map((l: any, li: number) => (
                        <details
                          key={li}
                          className="studio-activity"
                          open={m.lessons.length === 1}
                        >
                          <summary>
                            {li + 1}. {l.title || "Nouvelle activité"} ·{" "}
                            {l.type === "QUIZ"
                              ? "Quiz"
                              : l.type === "PDF"
                                ? "Travail à remettre"
                                : "Leçon"}
                          </summary>
                          <div className="learning-form">
                            <label>
                              Titre de l'activité
                              <input
                                required
                                minLength={3}
                                maxLength={200}
                                value={l.title}
                                onChange={(e) =>
                                  change((f) => {
                                    f.modules[mi].lessons[li].title =
                                      e.target.value;
                                  })
                                }
                              />
                            </label>
                            <label>
                              Durée estimée en minutes
                              <input
                                type="number"
                                min={1}
                                max={240}
                                required
                                value={l.durationMin}
                                onChange={(e) =>
                                  change((f) => {
                                    f.modules[mi].lessons[li].durationMin =
                                      Number(e.target.value);
                                  })
                                }
                              />
                            </label>
                            {l.type !== "QUIZ" ? (
                              <>
                                <label>
                                  {l.type === "PDF"
                                    ? "Énoncé et livrable attendu"
                                    : "Explications, exemples et exercices"}
                                  <textarea
                                    required
                                    minLength={20}
                                    maxLength={30000}
                                    rows={10}
                                    value={l.body}
                                    onChange={(e) =>
                                      change((f) => {
                                        f.modules[mi].lessons[li].body =
                                          e.target.value;
                                      })
                                    }
                                  />
                                </label>
                                <details>
                                  <summary>Aperçu de la leçon</summary>
                                  <div className="lesson-prose">
                                    <LessonContent body={l.body} />
                                  </div>
                                </details>
                                {l.type === "TEXT" && (
                                  <details>
                                    <summary>
                                      Ajouter une vidéo facultative
                                    </summary>
                                    <label>
                                      Adresse HTTPS de la vidéo
                                      <input
                                        type="url"
                                        value={l.videoUrl}
                                        onChange={(e) =>
                                          change((f) => {
                                            f.modules[mi].lessons[li].videoUrl =
                                              e.target.value;
                                          })
                                        }
                                      />
                                    </label>
                                    <label>
                                      Transcription
                                      <textarea
                                        rows={5}
                                        value={l.transcript}
                                        onChange={(e) =>
                                          change((f) => {
                                            f.modules[mi].lessons[
                                              li
                                            ].transcript = e.target.value;
                                          })
                                        }
                                      />
                                    </label>
                                    <p>
                                      La vidéo doit provenir d'un hébergeur
                                      autorisé. La leçon reste utilisable avec
                                      son texte.
                                    </p>
                                  </details>
                                )}
                              </>
                            ) : (
                              <>
                                <label>
                                  Titre du quiz
                                  <input
                                    required
                                    minLength={3}
                                    value={l.quiz.title}
                                    onChange={(e) =>
                                      change((f) => {
                                        f.modules[mi].lessons[li].quiz.title =
                                          e.target.value;
                                      })
                                    }
                                  />
                                </label>
                                <label>
                                  Seuil de réussite en pourcentage
                                  <input
                                    required
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={l.quiz.passingScore}
                                    onChange={(e) =>
                                      change((f) => {
                                        f.modules[mi].lessons[
                                          li
                                        ].quiz.passingScore = Number(
                                          e.target.value,
                                        );
                                      })
                                    }
                                  />
                                </label>
                                {l.quiz.questions.map((q: any, qi: number) => (
                                  <fieldset key={qi}>
                                    <legend>Question {qi + 1}</legend>
                                    <label>
                                      Question
                                      <textarea
                                        required
                                        minLength={5}
                                        maxLength={3000}
                                        value={q.prompt}
                                        onChange={(e) =>
                                          change((f) => {
                                            f.modules[mi].lessons[
                                              li
                                            ].quiz.questions[qi].prompt =
                                              e.target.value;
                                          })
                                        }
                                      />
                                    </label>
                                    {q.answers.map((a: any, ai: number) => (
                                      <div className="studio-answer" key={ai}>
                                        <label>
                                          Réponse {ai + 1}
                                          <input
                                            required
                                            maxLength={2000}
                                            value={a.label}
                                            onChange={(e) =>
                                              change((f) => {
                                                f.modules[mi].lessons[
                                                  li
                                                ].quiz.questions[qi].answers[
                                                  ai
                                                ].label = e.target.value;
                                              })
                                            }
                                          />
                                        </label>
                                        <label className="studio-radio">
                                          <input
                                            type="radio"
                                            name={
                                              "correct-" +
                                              mi +
                                              "-" +
                                              li +
                                              "-" +
                                              qi
                                            }
                                            checked={a.isCorrect}
                                            onChange={() =>
                                              change((f) => {
                                                f.modules[mi].lessons[
                                                  li
                                                ].quiz.questions[
                                                  qi
                                                ].answers.forEach(
                                                  (x: any, i: number) => {
                                                    x.isCorrect = i === ai;
                                                  },
                                                );
                                              })
                                            }
                                          />
                                          Bonne réponse
                                        </label>
                                        {q.answers.length > 2 && (
                                          <button
                                            type="button"
                                            className="button button-secondary"
                                            onClick={() =>
                                              change((f) => {
                                                f.modules[mi].lessons[
                                                  li
                                                ].quiz.questions[
                                                  qi
                                                ].answers.splice(ai, 1);
                                              })
                                            }
                                          >
                                            Retirer la réponse {ai + 1}
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      className="button button-secondary"
                                      disabled={q.answers.length >= 6}
                                      onClick={() =>
                                        change((f) => {
                                          f.modules[mi].lessons[
                                            li
                                          ].quiz.questions[qi].answers.push({
                                            label: "",
                                            isCorrect: false,
                                          });
                                        })
                                      }
                                    >
                                      Ajouter une réponse
                                    </button>
                                    <label>
                                      Explication après la tentative
                                      <textarea
                                        required
                                        minLength={10}
                                        maxLength={5000}
                                        value={q.explanation}
                                        onChange={(e) =>
                                          change((f) => {
                                            f.modules[mi].lessons[
                                              li
                                            ].quiz.questions[qi].explanation =
                                              e.target.value;
                                          })
                                        }
                                      />
                                    </label>
                                    <button
                                      type="button"
                                      className="button button-secondary"
                                      disabled={l.quiz.questions.length <= 1}
                                      onClick={() =>
                                        change((f) => {
                                          f.modules[mi].lessons[
                                            li
                                          ].quiz.questions.splice(qi, 1);
                                        })
                                      }
                                    >
                                      Retirer cette question
                                    </button>
                                  </fieldset>
                                ))}
                                <button
                                  type="button"
                                  className="button button-secondary"
                                  disabled={l.quiz.questions.length >= 50}
                                  onClick={() =>
                                    change((f) => {
                                      f.modules[mi].lessons[
                                        li
                                      ].quiz.questions.push({
                                        prompt: "",
                                        explanation: "",
                                        answers: [
                                          { label: "", isCorrect: true },
                                          { label: "", isCorrect: false },
                                        ],
                                      });
                                    })
                                  }
                                >
                                  Ajouter une question
                                </button>
                              </>
                            )}
                            <div className="learning-actions">
                              <button
                                type="button"
                                className="button button-secondary"
                                disabled={li === 0}
                                onClick={() =>
                                  change((f) =>
                                    move(f.modules[mi].lessons, li, -1),
                                  )
                                }
                              >
                                Monter l'activité
                              </button>
                              <button
                                type="button"
                                className="button button-secondary"
                                disabled={li === m.lessons.length - 1}
                                onClick={() =>
                                  change((f) =>
                                    move(f.modules[mi].lessons, li, 1),
                                  )
                                }
                              >
                                Descendre l'activité
                              </button>
                              <button
                                type="button"
                                className="button button-secondary"
                                disabled={m.lessons.length === 1}
                                onClick={() =>
                                  change((f) => {
                                    f.modules[mi].lessons.splice(li, 1);
                                  })
                                }
                              >
                                Retirer cette activité
                              </button>
                            </div>
                          </div>
                        </details>
                      ))}
                      <div className="learning-actions">
                        {[
                          ["TEXT", "Ajouter une leçon"],
                          ["QUIZ", "Ajouter un quiz"],
                          ["PDF", "Ajouter un travail"],
                        ].map(([type, label]) => (
                          <button
                            key={type}
                            type="button"
                            className="button button-secondary"
                            disabled={m.lessons.length >= 50}
                            onClick={() =>
                              change((f) => {
                                f.modules[mi].lessons.push(emptyLesson(type));
                              })
                            }
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <button
                    type="button"
                    className="button button-secondary"
                    disabled={busy || locked || form.modules.length >= 24}
                    onClick={() =>
                      change((f) => {
                        f.modules.push({ title: "", lessons: [emptyLesson()] });
                      })
                    }
                  >
                    Ajouter un module
                  </button>
                  <fieldset disabled={busy || locked}>
                    <legend>Évaluation par le formateur</legend>
                    <label>
                      Format du travail
                      <select
                        value={form.assessmentMode}
                        onChange={(e) =>
                          change((f) => {
                            f.assessmentMode = e.target.value;
                          })
                        }
                      >
                        <option value="NONE">
                          Pas de validation complète, lecture et quiz formatifs
                        </option>
                        <option value="NOTEBOOK">Notebook à remettre</option>
                        <option value="WRITTEN">
                          Dossier écrit à remettre
                        </option>
                      </select>
                    </label>
                    {form.assessmentMode !== "NONE" && (
                      <>
                        <label>
                          Seuil de réussite sur 100
                          <input
                            type="number"
                            min={1}
                            max={100}
                            required
                            value={form.assessmentScore}
                            onChange={(e) =>
                              change((f) => {
                                f.assessmentScore = Number(e.target.value);
                              })
                            }
                          />
                        </label>
                        <label>
                          Grille d'évaluation
                          <textarea
                            required
                            rows={6}
                            maxLength={5000}
                            value={form.rubric}
                            onChange={(e) =>
                              change((f) => {
                                f.rubric = e.target.value;
                              })
                            }
                          />
                        </label>
                      </>
                    )}
                  </fieldset>
                  <div className="studio-save">
                    <span>
                      {dirty
                        ? "Modifications à enregistrer"
                        : "Brouillon enregistré"}
                    </span>
                    <button
                      className="button button-primary"
                      disabled={busy || locked}
                    >
                      {busy ? "Enregistrement…" : "Enregistrer le brouillon"}
                    </button>
                  </div>
                </form>
              )}
              {panel === "resources" && (
                <div className="learning-form">
                  {!selected ? (
                    <p>
                      Enregistrez d'abord le cours pour y ajouter ses fichiers.
                    </p>
                  ) : (
                    <>
                      <p>
                        {dirty
                          ? "Enregistrez les modifications avant de gérer les fichiers."
                          : "Les notebooks et les corrigés sont conservés dans l'espace privé."}
                      </p>
                      <form className="learning-form" onSubmit={uploadResource}>
                        <fieldset disabled={!canManage || locked}>
                          <legend>Laboratoire Python</legend>
                          <label>
                            Ressource
                            <select name="name">
                              <option value="starter">
                                Notebook de départ
                              </option>
                              <option value="practice">Atelier guidé</option>
                              <option value="solution">
                                Corrigé après retour du formateur
                              </option>
                              <option value="csv">Jeu de données CSV</option>
                            </select>
                          </label>
                          <label>
                            Fichier IPYNB ou CSV
                            <input
                              type="file"
                              name="file"
                              accept=".ipynb,.csv"
                              required
                            />
                          </label>
                          <button className="button button-primary">
                            Enregistrer la ressource
                          </button>
                        </fieldset>
                      </form>
                      <p>
                        Départ :{" "}
                        {selected.resources.hasStarter
                          ? "présent"
                          : "à ajouter"}{" "}
                        · Atelier :{" "}
                        {selected.resources.hasPractice
                          ? "présent"
                          : "à ajouter"}{" "}
                        · Corrigé :{" "}
                        {selected.resources.hasSolution
                          ? "présent"
                          : "à ajouter"}{" "}
                        · CSV :{" "}
                        {selected.resources.hasCsv ? "présent" : "à ajouter"}
                      </p>
                      <form className="learning-form" onSubmit={uploadAsset}>
                        <fieldset disabled={!canManage || locked}>
                          <legend>Supports complémentaires</legend>
                          <label>
                            Titre du support
                            <input
                              name="title"
                              required
                              minLength={3}
                              maxLength={200}
                            />
                          </label>
                          <label>
                            Fichier, 1 Mo maximum
                            <input
                              type="file"
                              name="file"
                              accept=".pdf,.csv,.txt,.ipynb,.json"
                              required
                            />
                          </label>
                          <label>
                            Qui peut le télécharger ?
                            <select name="visibility">
                              <option value="LEARNER">
                                Apprenants inscrits et formateurs autorisés
                              </option>
                              <option value="AFTER_REVIEW">
                                Apprenants après correction de leur travail
                              </option>
                              <option value="STAFF">
                                Formateurs autorisés uniquement
                              </option>
                            </select>
                          </label>
                          <button className="button button-primary">
                            Ajouter le support
                          </button>
                        </fieldset>
                      </form>
                      <ul className="studio-assets">
                        {selected.assets.map((a: any) => (
                          <li key={a.id}>
                            <div>
                              <strong>{a.title}</strong>
                              <span>
                                {a.filename} · {Math.ceil(a.size / 1024)} Ko ·{" "}
                                {a.visibility === "STAFF"
                                  ? "Formateurs"
                                  : a.visibility === "AFTER_REVIEW"
                                    ? "Après correction"
                                    : "Inscrits"}
                              </span>
                            </div>
                            <a
                              href={
                                "/api/v1/courses/" +
                                selected.id +
                                "/assets/" +
                                a.id +
                                "/download"
                              }
                            >
                              Télécharger
                            </a>
                            <button
                              className="button button-secondary"
                              disabled={!canManage || locked}
                              onClick={() =>
                                void act(
                                  () =>
                                    api(
                                      "/courses/" +
                                        selected.id +
                                        "/assets/" +
                                        a.id,
                                      "DELETE",
                                      { revision: selected.version },
                                    ),
                                  "Support retiré du brouillon.",
                                )
                              }
                            >
                              Retirer
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
              {panel === "review" &&
                (!selected ? (
                  <p>
                    Enregistrez d'abord le brouillon pour demander sa relecture.
                  </p>
                ) : (
                  <div className="learning-form">
                    <h2>{status[selected.editorialStatus] || "Brouillon"}</h2>
                    <p>
                      {selected.isPublished
                        ? "Ce cours est affiché dans le catalogue."
                        : "Ce cours n'est pas publié au catalogue."}
                    </p>
                    {selected.reviewedAt && (
                      <p>
                        Validation enregistrée le{" "}
                        {new Date(selected.reviewedAt).toLocaleString("fr-FR")}.
                      </p>
                    )}
                    {selected.reviewNote && (
                      <blockquote>{selected.reviewNote}</blockquote>
                    )}
                    <label>
                      Note de relecture ou de décision
                      <textarea
                        minLength={10}
                        maxLength={5000}
                        rows={4}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Précisez les vérifications réalisées ou les corrections attendues."
                      />
                    </label>
                    <div className="learning-actions">
                      {[
                        ["SUBMIT", "Demander une relecture"],
                        ...(isAdmin
                          ? [
                              ["APPROVE", "Valider la relecture"],
                              ["CHANGES", "Demander des corrections"],
                              ["PUBLISH", "Publier au catalogue"],
                              ["UNPUBLISH", "Retirer du catalogue"],
                            ]
                          : []),
                      ].map(([action, label]) => (
                        <button
                          key={action}
                          className="button button-secondary"
                          disabled={
                            !canManage ||
                            note.trim().length < 10 ||
                            (action === "SUBMIT" &&
                              selected.editorialStatus !== "DRAFT") ||
                            (action === "APPROVE" &&
                              selected.editorialStatus !== "IN_REVIEW") ||
                            (action === "PUBLISH" &&
                              (selected.editorialStatus !== "APPROVED" ||
                                !selected.trainingId ||
                                selected.isPublished)) ||
                            (action === "UNPUBLISH" && !selected.isPublished)
                          }
                          onClick={() =>
                            void act(
                              () =>
                                api(
                                  "/courses/" +
                                    selected.id +
                                    "/authoring/review",
                                  "PUT",
                                  { revision: selected.version, action, note },
                                ),
                              "Décision enregistrée dans l'historique.",
                            )
                          }
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p>
                      La validation doit être effectuée par la personne ayant
                      réellement relu les leçons, exécuté les exercices et
                      vérifié les corrigés.
                    </p>
                    {isAdmin && (
                      <form
                        className="learning-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const f = new FormData(e.currentTarget);
                          void act(
                            () =>
                              api(
                                "/courses/" +
                                  selected.id +
                                  "/authoring/editors",
                                "PUT",
                                {
                                  revision: selected.version,
                                  editorIds: f.getAll("editorIds"),
                                },
                              ),
                            "Formateurs responsables mis à jour.",
                          );
                        }}
                      >
                        <fieldset disabled={!canManage}>
                          <legend>
                            Formateurs autorisés à préparer ce cours
                          </legend>
                          {trainers.map((t) => (
                            <label
                              className="studio-radio"
                              key={
                                selected.id +
                                "-" +
                                selected.version +
                                "-" +
                                t.id
                              }
                            >
                              <input
                                name="editorIds"
                                type="checkbox"
                                value={t.id}
                                defaultChecked={selected.editorIds.includes(
                                  t.id,
                                )}
                              />
                              {t.profile?.fullName || t.email}
                            </label>
                          ))}
                          <button className="button button-secondary">
                            Enregistrer les responsables
                          </button>
                        </fieldset>
                      </form>
                    )}
                    <details>
                      <summary>Historique des versions et décisions</summary>
                      <ol>
                        {selected.history.map((h: any) => (
                          <li key={h.id}>
                            {new Date(h.createdAt).toLocaleString("fr-FR")} ·{" "}
                            {h.action
                              .replace("COURSE_", "")
                              .toLowerCase()
                              .replaceAll("_", " ")}
                            {h.details?.note && <p>{h.details.note}</p>}
                          </li>
                        ))}
                      </ol>
                    </details>
                  </div>
                ))}
            </>
          ) : (
            <div className="learning-empty">
              <h2>Choisissez un cours à préparer</h2>
              <p>
                Retrouvez ses leçons, quiz, supports et décisions de relecture.
                Une version déjà attribuée reste conservée.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
