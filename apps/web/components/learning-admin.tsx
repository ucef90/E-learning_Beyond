"use client";
import { useEffect, useState, FormEvent } from "react";
import { api } from "@/lib/learning-api";
const blank = () => ({
  title: "",
  summary: "",
  moduleTitle: "",
  brief: {
    objectifs: "",
    public: "",
    prerequis: "",
    duree: "",
    modalites: "",
    evaluation: "",
    assistance: "",
    accessibilite: "",
    acces: "",
    revision: "Brouillon à valider",
  } as Record<string, string>,
  lessons: [
    { title: "", body: "", durationMin: 10, videoUrl: "", transcript: "" },
  ],
});
export default function Admin({
  courses,
  refresh,
}: {
  courses: any[];
  refresh: () => Promise<void>;
}) {
  const [users, setUsers] = useState<any[]>([]),
    [message, setMessage] = useState(""),
    [link, setLink] = useState(""),
    [busy, setBusy] = useState(false),
    [editor, setEditor] = useState<any>(null),
    [editId, setEditId] = useState("");
  const learners = users.filter((u) =>
      u.roles.some((r: any) => r.role.code === "LEARNER"),
    ),
    trainers = users.filter((u) =>
      u.roles.some((r: any) => r.role.code === "TRAINER"),
    );
  async function load() {
    setUsers(await api("/courses/admin/users"));
  }
  useEffect(() => {
    void load().catch((e) => setMessage(e.message));
  }, []);
  async function action(fn: () => Promise<any>, success: string) {
    setBusy(true);
    setLink("");
    try {
      const r = await fn();
      if (r?.url) setLink(r.url);
      setMessage(success);
      await refresh();
      await load();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function open(id: string) {
    setBusy(true);
    try {
      const c = await api(`/courses/${id}`);
      setEditId(id);
      setEditor({
        title: c.title,
        summary: c.summary,
        moduleTitle: c.modules[0].title,
        brief: c.brief || blank().brief,
        lessons: c.modules[0].lessons
          .filter((l: any) => l.type === "TEXT")
          .map((l: any) => ({
            title: l.title,
            body: l.content?.body || "",
            durationMin: l.durationMin || 10,
            videoUrl: l.videoUrl || "",
            transcript: l.content?.transcript || "",
          })),
      });
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function updateLesson(i: number, key: string, value: any) {
    setEditor({
      ...editor,
      lessons: editor.lessons.map((l: any, j: number) =>
        i === j ? { ...l, [key]: value } : l,
      ),
    });
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    await action(
      () =>
        api(
          editId ? `/courses/${editId}` : "/courses",
          editId ? "PUT" : "POST",
          editor,
        ),
      "Contenu sauvegardé en brouillon.",
    );
  }
  return (
    <div>
      <h1>Administrer le pilote</h1>
      <p>
        Préparez les contenus, créez les comptes et attribuez un module avec son
        formateur. Les contenus restent en validation pédagogique.
      </p>
      <p role="status" className="learning-notice">
        {message ||
          "Les attributions donnent un accès nominatif, sans publication commerciale."}
      </p>
      {link && (
        <div className="learning-notice">
          <strong>Lien personnel valable une heure</strong>
          <p>
            À transmettre au destinataire après vérification de son identité,
            par un canal sûr.
          </p>
          <input
            aria-label="Lien personnel de récupération"
            value={link}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
      <div className="learning-admin-grid">
        <section>
          <h2>1. Préparer le contenu</h2>
          <button
            className="button button-primary"
            onClick={() => {
              setEditId("");
              setEditor(blank());
            }}
          >
            Créer un module
          </button>
          <div className="learning-manage-list">
            {courses.map((c) => (
              <div key={c.id}>
                <strong>{c.title}</strong>
                <small>
                  Version {c.version} · {c._count.learning} attribution(s)
                </small>
                <div className="learning-actions">
                  <button
                    className="button button-secondary"
                    disabled={busy || c._count.learning > 0}
                    onClick={() => void open(c.id)}
                  >
                    Modifier le contenu
                  </button>
                  <button
                    className="button button-secondary"
                    disabled={busy}
                    onClick={() =>
                      void action(
                        () => api(`/courses/${c.id}/clone`, "POST", {}),
                        "Copie créée. Vous pouvez modifier cette nouvelle version.",
                      )
                    }
                  >
                    Dupliquer la version
                  </button>
                </div>
                {c._count.learning > 0 && (
                  <p className="learning-note">
                    Cette version est figée pour préserver les parcours déjà
                    attribués.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2>2. Créer un compte</h2>
          <form
            className="learning-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              void action(
                () =>
                  api("/courses/admin/users", "POST", Object.fromEntries(f)),
                "Compte créé. Le destinataire définit son mot de passe avec le lien personnel.",
              );
            }}
          >
            <label>
              Nom complet
              <input name="fullName" required minLength={2} maxLength={150} />
            </label>
            <label>
              Adresse e-mail
              <input name="email" type="email" required />
            </label>
            <label>
              Rôle
              <select name="role">
                <option value="LEARNER">Stagiaire</option>
                <option value="TRAINER">Formateur</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </label>
            <button className="button button-primary" disabled={busy}>
              Créer le compte
            </button>
          </form>
          <details>
            <summary>Récupérer l’accès d’un compte existant</summary>
            <form
              className="learning-form"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void action(
                  () =>
                    api(
                      `/courses/admin/users/${f.get("userId")}/reset-link`,
                      "POST",
                      {},
                    ),
                  "Lien de récupération créé.",
                );
              }}
            >
              <label>
                Compte
                <select name="userId" required>
                  <option value="">Choisir un compte</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.profile?.fullName} · {u.email}
                    </option>
                  ))}
                </select>
              </label>
              <button className="button button-secondary" disabled={busy}>
                Créer un lien personnel
              </button>
            </form>
          </details>
        </section>
        <section>
          <h2>3. Attribuer un module</h2>
          <form
            className="learning-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              void action(
                () =>
                  api(`/courses/${f.get("courseId")}/assign`, "POST", {
                    userId: f.get("userId"),
                    trainerId: f.get("trainerId"),
                    groupName: f.get("groupName"),
                  }),
                "Module attribué. Le stagiaire et le formateur peuvent y accéder.",
              );
            }}
          >
            <label>
              Module
              <select name="courseId" required>
                <option value="">Choisir un module</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} · v{c.version}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Stagiaire
              <select name="userId" required>
                <option value="">Choisir un stagiaire</option>
                {learners.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.profile?.fullName} · {u.email}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Formateur
              <select name="trainerId" required>
                <option value="">Choisir un formateur</option>
                {trainers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.profile?.fullName} · {u.email}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nom du groupe
              <input
                name="groupName"
                required
                minLength={2}
                maxLength={100}
                defaultValue="Groupe pilote"
              />
            </label>
            <button className="button button-primary" disabled={busy}>
              Attribuer le module
            </button>
          </form>
          <p className="learning-note">
            Attribuer de nouveau le même module met à jour le groupe et le
            formateur, sans effacer les travaux.
          </p>
        </section>
      </div>
      {editor && (
        <section className="learning-editor">
          <h2>{editId ? "Modifier le module" : "Nouveau module"}</h2>
          <form className="learning-form" onSubmit={save}>
            <label>
              Titre du parcours
              <input
                required
                minLength={3}
                maxLength={200}
                value={editor.title}
                onChange={(e) =>
                  setEditor({ ...editor, title: e.target.value })
                }
              />
            </label>
            <label>
              Présentation
              <textarea
                required
                minLength={10}
                maxLength={2000}
                value={editor.summary}
                onChange={(e) =>
                  setEditor({ ...editor, summary: e.target.value })
                }
              />
            </label>
            <label>
              Titre du module
              <input
                required
                minLength={3}
                maxLength={200}
                value={editor.moduleTitle}
                onChange={(e) =>
                  setEditor({ ...editor, moduleTitle: e.target.value })
                }
              />
            </label>
            <details open>
              <summary>Fiche pédagogique</summary>
              <div className="learning-fields">
                {Object.entries(editor.brief).map(([key, value]) => (
                  <label key={key}>
                    {key}
                    <textarea
                      value={String(value)}
                      rows={3}
                      onChange={(e) =>
                        setEditor({
                          ...editor,
                          brief: { ...editor.brief, [key]: e.target.value },
                        })
                      }
                    />
                  </label>
                ))}
              </div>
            </details>
            {editor.lessons.map((l: any, i: number) => (
              <fieldset key={i}>
                <legend>Leçon {i + 1}</legend>
                <label>
                  Titre de la leçon
                  <input
                    required
                    minLength={3}
                    maxLength={200}
                    value={l.title}
                    onChange={(e) => updateLesson(i, "title", e.target.value)}
                  />
                </label>
                <label>
                  Durée estimée en minutes
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={l.durationMin}
                    onChange={(e) =>
                      updateLesson(i, "durationMin", Number(e.target.value))
                    }
                  />
                </label>
                <label>
                  Contenu · Markdown accepté
                  <textarea
                    required
                    minLength={20}
                    maxLength={30000}
                    rows={12}
                    value={l.body}
                    onChange={(e) => updateLesson(i, "body", e.target.value)}
                  />
                </label>
                <details>
                  <summary>Vidéo facultative</summary>
                  <p>
                    Le contenu textuel doit rester complet. L’hébergeur HTTPS
                    doit être autorisé dans la configuration du site.
                  </p>
                  <label>
                    Adresse de la vidéo
                    <input
                      type="url"
                      value={l.videoUrl}
                      onChange={(e) =>
                        updateLesson(i, "videoUrl", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Transcription
                    <textarea
                      rows={4}
                      value={l.transcript}
                      onChange={(e) =>
                        updateLesson(i, "transcript", e.target.value)
                      }
                    />
                  </label>
                </details>
              </fieldset>
            ))}
            {!editId && (
              <button
                type="button"
                className="button button-secondary"
                disabled={editor.lessons.length >= 30}
                onClick={() =>
                  setEditor({
                    ...editor,
                    lessons: [
                      ...editor.lessons,
                      {
                        title: "",
                        body: "",
                        durationMin: 10,
                        videoUrl: "",
                        transcript: "",
                      },
                    ],
                  })
                }
              >
                Ajouter une leçon
              </button>
            )}
            <div className="learning-actions">
              <button className="button button-primary" disabled={busy}>
                Sauvegarder le contenu
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setEditor(null)}
              >
                Fermer l’éditeur
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
