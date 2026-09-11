"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, canLeaveNotebook } from "@/lib/learning-api";
import Reader from "@/components/learning-reader";
import Admin from "@/components/learning-admin";
import Groups from "@/components/learning-groups";
export default function Learning() {
  const [user, setUser] = useState<any>(null),
    [courses, setCourses] = useState<any[]>([]),
    [screen, setScreen] = useState("modules"),
    [selected, setSelected] = useState(""),
    [error, setError] = useState(""),
    [loaded, setLoaded] = useState(false);
  async function refresh() {
    setCourses(await api("/courses/me"));
  }
  useEffect(() => {
    api("/auth/me")
      .then(async (u) => {
        setUser(u);
        await refresh();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoaded(true));
  }, []);
  if (!loaded)
    return (
      <main className="learning" id="contenu">
        <p role="status">Ouverture de votre espace…</p>
      </main>
    );
  if (!user)
    return (
      <main className="learning login-shell" id="contenu">
        <h1>Votre espace de formation</h1>
        <p role="alert">{error}</p>
        <Link className="button button-primary" href="/connexion">
          Se connecter
        </Link>
      </main>
    );
  return (
    <main className="learning" id="contenu">
      <header className="learning-topbar">
        <div>
          <strong>{user.fullName}</strong>
          <span>
            {user.roles.includes("ADMIN")
              ? "Administration"
              : user.roles.includes("TRAINER")
                ? "Espace formateur"
                : "Espace stagiaire"}
          </span>
        </div>
        <nav aria-label="Espace de formation">
          <button
            aria-current={screen === "modules" ? "page" : undefined}
            onClick={() => {
              if (!canLeaveNotebook()) return;
              setSelected("");
              setScreen("modules");
            }}
          >
            Mes modules
          </button>
          {user.roles.some((r: string) => ["ADMIN", "TRAINER"].includes(r)) && (
            <button
              aria-current={screen === "groupes" ? "page" : undefined}
              onClick={() => {
                if (!canLeaveNotebook()) return;
                setSelected("");
                setScreen("groupes");
              }}
            >
              Groupes et corrections
            </button>
          )}
          {user.roles.includes("ADMIN") && (
            <button
              aria-current={screen === "admin" ? "page" : undefined}
              onClick={() => {
                if (!canLeaveNotebook()) return;
                setSelected("");
                setScreen("admin");
              }}
            >
              Administration
            </button>
          )}
          <button
            onClick={() =>
              canLeaveNotebook() &&
              api("/auth/logout", "POST", {})
                .then(() => window.location.assign("/connexion"))
                .catch((e) => setError(e.message))
            }
          >
            Se déconnecter
          </button>
        </nav>
      </header>
      {error && <p role="alert">{error}</p>}
      {selected ? (
        <Reader
          key={selected}
          id={selected}
          user={user}
          back={() => setSelected("")}
        />
      ) : screen === "admin" ? (
        <Admin courses={courses} refresh={refresh} />
      ) : screen === "groupes" ? (
        <Groups />
      ) : (
        <>
          <div className="learning-intro">
            <p className="learning-kicker">Apprendre, pratiquer, progresser</p>
            <h1>
              {user.roles.includes("LEARNER")
                ? "Votre prochain pas commence ici."
                : "Les modules de votre espace."}
            </h1>
            <p>
              Retrouvez les contenus attribués et reprenez votre travail là où
              vous l’avez laissé.
            </p>
          </div>
          <div className="learning-course-list">
            {courses.length ? (
              courses.map((c) => (
                <article key={c.id} className="learning-course-card">
                  <div className="learning-course-mark" aria-hidden="true">
                    Py
                  </div>
                  <div>
                    <p className="learning-kicker">
                      Python · Analyse de données · {c.estimatedMinutes || "—"}{" "}
                      min
                    </p>
                    <h2>{c.title}</h2>
                    <p>{c.summary}</p>
                    <p className="learning-note">
                      Version {c.version}
                      {!c.isPublished
                        ? " · Pilote pédagogique, accès sur attribution"
                        : ""}
                    </p>
                  </div>
                  <button
                    className="button button-primary"
                    onClick={() => setSelected(c.id)}
                  >
                    {user.roles.includes("LEARNER")
                      ? "Ouvrir mon module"
                      : "Consulter le contenu"}
                  </button>
                </article>
              ))
            ) : (
              <div className="learning-empty">
                <h2>Aucun module attribué pour le moment</h2>
                <p>
                  Votre compte est prêt. L’administrateur doit encore vous
                  attribuer un module et un formateur.
                </p>
              </div>
            )}
          </div>
          <p className="learning-notice">
            Préproduction du module pilote. Vos lectures, sauvegardes,
            tentatives et remises sont conservées pour le test pédagogique.
          </p>
        </>
      )}
    </main>
  );
}
