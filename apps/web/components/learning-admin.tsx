"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/learning-api";
export default function Admin({
  courses,
  refresh,
  onOpenStudio,
}: {
  courses: any[];
  refresh: () => Promise<void>;
  onOpenStudio: () => void;
}) {
  const [users, setUsers] = useState<any[]>([]),
    [message, setMessage] = useState(""),
    [link, setLink] = useState(""),
    [busy, setBusy] = useState(false);
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
  return (
    <div>
      <h1>Comptes et attributions</h1>
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
          <h2>Préparer les cours</h2>
          <p>
            Gérez les modules, leçons, quiz, supports privés et validations dans
            l'espace de contenus pédagogiques.
          </p>
          <button className="button button-primary" onClick={onOpenStudio}>
            Ouvrir les contenus pédagogiques
          </button>
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
    </div>
  );
}
