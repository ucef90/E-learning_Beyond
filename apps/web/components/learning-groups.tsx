"use client";
import { useEffect, useState, useRef, FormEvent } from "react";
import { api, download } from "@/lib/learning-api";
export default function Groups({
  initialId = "",
  summaries = [],
  onChange,
  isAdmin = false,
}: {
  initialId?: string;
  summaries?: any[];
  onChange?: () => Promise<void>;
  isAdmin?: boolean;
}) {
  const [groups, setGroups] = useState<any[]>([]),
    [active, setActive] = useState<any>(null),
    [state, setState] = useState<any>(null),
    [work, setWork] = useState<any>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [query, setQuery] = useState(""),
    [loading, setLoading] = useState(true);
  const requestId = useRef(0);
  useEffect(() => {
    api("/courses/groups")
      .then((rows) => {
        setGroups(rows);
        const first = rows.find((g: any) => g.id === initialId);
        if (first) void select(first);
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [initialId]);
  async function select(g: any) {
    const request = ++requestId.current;
    setActive(g);
    setWork(null);
    setState(null);
    try {
      const next = await api(
        "/courses/" + g.courseId + "/learners/" + g.userId + "/state",
      );
      if (request === requestId.current) setState(next);
    } catch (e) {
      if (request === requestId.current) setMessage((e as Error).message);
    }
  }
  async function updateAccess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await api(
        "/courses/" +
          active.courseId +
          "/learners/" +
          active.userId +
          "/access",
        "PUT",
        {
          status: f.get("status"),
          expiresAt: f.get("expiresAt")
            ? new Date(String(f.get("expiresAt"))).toISOString()
            : null,
          reason: f.get("reason"),
        },
      );
      const rows = await api("/courses/groups");
      setGroups(rows);
      await select(rows.find((g: any) => g.id === active.id));
      await onChange?.();
      setMessage(
        "Accès mis à jour. Les travaux et la progression sont conservés.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function review(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await api(
        `/courses/${active.courseId}/submissions/${work.id}/review`,
        "PUT",
        { grade: Number(f.get("grade")), feedback: f.get("feedback") },
      );
      setMessage("Correction enregistrée et disponible pour le stagiaire.");
      await select(active);
      await onChange?.();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function getWork(id: string) {
    try {
      setWork(await api(`/courses/${active.courseId}/submissions/${id}`));
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  async function exportEvidence() {
    try {
      download(
        "releve-pedagogique.json",
        await api(
          `/courses/${active.courseId}/learners/${active.userId}/export`,
        ),
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <section>
      <h1>Mes groupes et corrections</h1>
      <p>
        Seuls les stagiaires et les travaux attribués à votre compte sont
        accessibles.
      </p>
      <p role="status">{message}</p>
      <label className="academy-search">
        <input
          type="search"
          placeholder="Rechercher un apprenant ou un groupe"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un apprenant ou un groupe"
        />
      </label>
      {loading && <p role="status">Chargement de vos groupes…</p>}
      <div className="learning-group-layout">
        <nav aria-label="Stagiaires attribués">
          {groups.length ? (
            groups
              .filter((g) =>
                [g.user.profile?.fullName, g.groupName, g.course.title]
                  .join(" ")
                  .toLocaleLowerCase("fr")
                  .includes(query.toLocaleLowerCase("fr")),
              )
              .map((g) => (
                <button
                  className="learning-group"
                  key={g.id}
                  aria-current={active?.id === g.id ? "page" : undefined}
                  onClick={() => void select(g)}
                >
                  <strong>{g.user.profile?.fullName || g.user.email}</strong>
                  <span>{g.groupName}</span>
                  <small>{g.course.title}</small>
                  <small>
                    {summaries.find((s) => s.id === g.id)?.lessonsRead || 0}{" "}
                    leçons lues ·{" "}
                    {summaries
                      .find((s) => s.id === g.id)
                      ?.submissions.filter((s: any) => !s.reviewedAt).length ||
                      0}{" "}
                    travail à corriger
                  </small>
                </button>
              ))
          ) : (
            <p>Aucun groupe attribué.</p>
          )}
        </nav>
        <div>
          {active && state ? (
            <>
              <h2>{active.user.profile?.fullName}</h2>
              <p>{active.course.title}</p>
              <p>
                {state.progress.filter((p: any) => p.completed).length} leçon(s)
                déclarée(s) lue(s) · {state.attempts.length} tentative(s) de
                quiz
              </p>
              <button
                className="button button-secondary"
                onClick={() => void exportEvidence()}
              >
                Exporter le dossier pédagogique
              </button>
              <a
                className="button button-secondary"
                href={
                  "/apprentissage/releve/" +
                  active.courseId +
                  "?apprenant=" +
                  active.userId
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Ouvrir le relevé imprimable
              </a>
              <p>
                Accès :{" "}
                {active.revokedAt
                  ? "suspendu"
                  : active.expiresAt && new Date(active.expiresAt) <= new Date()
                    ? "expiré"
                    : "actif"}
                {active.expiresAt
                  ? " · échéance " +
                    new Date(active.expiresAt).toLocaleDateString("fr-FR")
                  : " · sans échéance définie"}
              </p>
              {isAdmin && (
                <details>
                  <summary>Gérer l'accès de cet apprenant</summary>
                  <form
                    key={
                      active.id +
                      "-" +
                      active.revokedAt +
                      "-" +
                      active.expiresAt
                    }
                    className="learning-form"
                    onSubmit={updateAccess}
                  >
                    <label>
                      État
                      <select
                        name="status"
                        defaultValue={active.revokedAt ? "REVOKED" : "ACTIVE"}
                      >
                        <option value="ACTIVE">Actif</option>
                        <option value="REVOKED">Suspendu</option>
                      </select>
                    </label>
                    <label>
                      Fin de l'accès, facultative
                      <input
                        type="datetime-local"
                        name="expiresAt"
                        defaultValue={
                          active.expiresAt
                            ? new Date(
                                new Date(active.expiresAt).getTime() -
                                  new Date(
                                    active.expiresAt,
                                  ).getTimezoneOffset() *
                                    60000,
                              )
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                      />
                    </label>
                    <label>
                      Motif de la décision
                      <textarea
                        name="reason"
                        required
                        minLength={5}
                        maxLength={1000}
                      />
                    </label>
                    <button className="button button-primary" disabled={busy}>
                      Enregistrer les droits d'accès
                    </button>
                  </form>
                </details>
              )}
              <details>
                <summary>Positionnement avant formation</summary>
                {state.access?.positioning ? (
                  <dl>
                    {Object.entries(state.access.positioning).map(([k, v]) => (
                      <div key={k}>
                        <dt>
                          {(
                            {
                              goals: "Objectifs",
                              experience: "Expérience",
                              equipment: "Matériel",
                              support: "Accompagnement",
                            } as Record<string, string>
                          )[k] || k}
                        </dt>
                        <dd>{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p>
                    Le stagiaire n'a pas encore renseigné son positionnement.
                  </p>
                )}
              </details>
              <h3>Travaux remis</h3>
              {state.submissions.length ? (
                state.submissions.map((s: any) => (
                  <div className="learning-result" key={s.id}>
                    <p>
                      {new Date(s.createdAt).toLocaleString("fr-FR")} ·{" "}
                      {s.reviewedAt ? `${s.grade}/100` : "À corriger"}
                    </p>
                    <button
                      className="button button-primary"
                      onClick={() => void getWork(s.id)}
                    >
                      Consulter et corriger
                    </button>
                  </div>
                ))
              ) : (
                <p>Le stagiaire n’a pas encore remis de travail.</p>
              )}
              {work && (
                <section className="learning-review">
                  <h3>Travail du stagiaire</h3>
                  <p>{work.comment || "Aucun commentaire joint."}</p>
                  <p className="learning-notice">
                    Lecture sans exécution automatique. Évaluez la démarche, les
                    calculs et les justifications avec la grille du TP.
                  </p>
                  <button
                    className="button button-secondary"
                    onClick={() =>
                      download(
                        work.notebook
                          ? "remise-stagiaire.ipynb"
                          : "remise-stagiaire.txt",
                        work.notebook || work.writtenWork,
                        work.notebook
                          ? "application/json"
                          : "text/plain;charset=utf-8",
                      )
                    }
                  >
                    Exporter le travail remis
                  </button>
                  {work.writtenWork && (
                    <div className="preserve-lines">{work.writtenWork}</div>
                  )}
                  {work.notebook && (
                    <details>
                      <summary>Lire les cellules du notebook</summary>
                      {work.notebook?.cells?.map((c: any, i: number) => (
                        <div key={i}>
                          <h4>
                            Cellule {i + 1} · {c.cell_type}
                          </h4>
                          <pre>
                            {Array.isArray(c.source)
                              ? c.source.join("")
                              : c.source}
                          </pre>
                          {c.outputs?.map((o: any, j: number) => (
                            <pre key={j}>
                              {Array.isArray(o.text) ? o.text.join("") : o.text}
                            </pre>
                          ))}
                        </div>
                      ))}
                    </details>
                  )}
                  <p className="preserve-lines">
                    {state.completion?.assessment?.rubric ||
                      "Barème : diagnostic 15, nettoyage 25, calculs 25, graphique 15, interprétation et reproductibilité 20."}
                  </p>
                  <form
                    key={work.id}
                    className="learning-form"
                    onSubmit={review}
                  >
                    <label>
                      Note sur 100
                      <input
                        type="number"
                        name="grade"
                        min={0}
                        max={100}
                        required
                        defaultValue={work.grade ?? ""}
                      />
                    </label>
                    <label>
                      Correction et conseils
                      <textarea
                        name="feedback"
                        minLength={10}
                        maxLength={10000}
                        rows={7}
                        required
                        defaultValue={work.feedback || ""}
                      />
                    </label>
                    <button className="button button-primary" disabled={busy}>
                      Enregistrer la correction
                    </button>
                  </form>
                </section>
              )}
            </>
          ) : (
            <p className="learning-empty">
              Choisissez un stagiaire pour consulter son suivi et ses remises.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
