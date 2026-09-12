"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  Settings2,
  Users,
  UserRound,
  Clock3,
  ArrowUpRight,
} from "lucide-react";
import { api, canLeaveNotebook, download } from "@/lib/learning-api";
import Reader from "./learning-reader";
import Groups from "./learning-groups";
import Admin from "./learning-admin";
import QualityAdmin from "./quality-admin";

const date = (value: string) =>
  new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const name = (e: any) => e.user.profile?.fullName || "Apprenant";
const pct = (e: any) =>
  e?.totalLessons ? Math.round((e.lessonsRead * 100) / e.totalLessons) : 0;

export default function LearningDashboard() {
  const [user, setUser] = useState<any>(null),
    [data, setData] = useState<any>(null);
  const [view, setView] = useState("overview"),
    [selected, setSelected] = useState<any>(null),
    [groupId, setGroupId] = useState("");
  const [query, setQuery] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [loaded, setLoaded] = useState(false),
    [downloading, setDownloading] = useState("");
  const staff = user?.roles.some((r: string) =>
    ["ADMIN", "TRAINER"].includes(r),
  );
  const admin = user?.roles.includes("ADMIN");
  async function refresh() {
    setData(await api("/courses/dashboard"));
  }
  useEffect(() => {
    let alive = true;
    api("/auth/me")
      .then(async (u) => {
        if (alive) setUser(u);
        const d = await api("/courses/dashboard");
        if (alive) setData(d);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);
  function navigate(next: string) {
    if (!canLeaveNotebook()) return;
    setSelected(null);
    setView(next);
    setQuery("");
    setNotice("");
    refresh().catch((e) => setError(e.message));
  }
  function open(id: string, tab?: string) {
    if (canLeaveNotebook()) {
      setSelected({ id, tab });
      setError("");
    }
  }
  function inspect(id: string) {
    setGroupId(id);
    navigate("groups");
  }
  async function getResource(c: any, resource: string) {
    const key = c.id + resource;
    setDownloading(key);
    setNotice("");
    try {
      const file = await api(`/courses/${c.id}/resources/${resource}`);
      download(
        resource === "csv"
          ? "ventes.csv"
          : `${resource === "solution" ? "corrige" : resource === "practice" ? "atelier-guide" : "notebook-depart"}.ipynb`,
        resource === "csv" ? file.content : file,
        resource === "csv" ? "text/csv;charset=utf-8" : "application/json",
      );
      setNotice("Le téléchargement est prêt dans votre navigateur.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDownloading("");
    }
  }
  if (!loaded)
    return (
      <main className="academy-loading" id="contenu" aria-busy="true">
        <span className="academy-loading-mark">
          <GraduationCap size={32} />
        </span>
        <h1>Ouverture de votre espace</h1>
        <p role="status">Nous retrouvons vos cours et votre progression.</p>
      </main>
    );
  if (!user)
    return (
      <main className="learning login-shell" id="contenu">
        <h1>Connectez-vous à votre espace</h1>
        <p>Retrouvez vos cours ou les apprenants que vous accompagnez.</p>
        <Link href="/connexion" className="button button-primary">
          Se connecter <ArrowRight size={18} />
        </Link>
      </main>
    );
  const courses = data?.courses || [],
    enrollments = data?.enrollments || [];
  const mine = enrollments.filter((e: any) => e.userId === user.id);
  const supervised = enrollments.filter(
    (e: any) => admin || e.trainerId === user.id,
  );
  const relevant = staff ? supervised : mine;
  const works = relevant.flatMap((e: any) =>
    e.submissions.map((s: any) => ({ ...s, enrollment: e })),
  );
  const pending = works.filter((s: any) => !s.reviewedAt);
  const reviewed = works.filter((s: any) => s.reviewedAt);
  const resume = mine.find((e: any) => e.nextLesson) || mine[0];
  const course = (id: string) => courses.find((c: any) => c.id === id);
  const labels: Record<string, string> = {
    overview: "Vue d’ensemble",
    courses: "Mes cours",
    work: staff ? "Corrections" : "Travaux et résultats",
    resources: "Ressources",
    groups: "Mes groupes",
    admin: "Administration",
    quality: "Suivi qualité",
    profile: "Mon compte",
  };
  const nav = [
    ["overview", LayoutDashboard],
    ["courses", BookOpen],
    ...(staff ? [["groups", Users]] : []),
    ["work", ClipboardCheck],
    ["resources", FolderOpen],
    ...(admin
      ? [
          ["admin", Settings2],
          ["quality", ClipboardCheck],
        ]
      : []),
  ] as const;
  const filtered = courses.filter((c: any) =>
    c.title.toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr")),
  );
  function progress(e: any) {
    return (
      <div className="academy-progress">
        <div>
          <span>Leçons lues</span>
          <strong>
            {e?.lessonsRead || 0}/{e?.totalLessons || 0}
          </strong>
        </div>
        <progress
          value={pct(e)}
          max={100}
          aria-label="Progression de lecture"
        />
      </div>
    );
  }
  function courseRow(c: any) {
    const e = mine.find((e: any) => e.courseId === c.id);
    const count = supervised.filter((e: any) => e.courseId === c.id).length;
    return (
      <article key={c.id} className="academy-course-row">
        <div className="academy-course-symbol">
          <BookOpen size={25} />
        </div>
        <div className="academy-course-info">
          <span className="academy-caption">
            {c.estimatedMinutes} min · {c.lessons.length} leçons
          </span>
          <h3>{c.title}</h3>
          <p>
            {staff
              ? `${count} attribution${count > 1 ? "s" : ""} à suivre · Version ${c.version}`
              : e?.trainer.profile?.fullName
                ? `Votre formateur : ${e.trainer.profile.fullName}`
                : c.summary}
          </p>
          {e && progress(e)}
        </div>
        <button className="button button-primary" onClick={() => open(c.id)}>
          {staff
            ? "Consulter le cours"
            : e?.lessonsRead || e?.draft
              ? "Reprendre le cours"
              : "Commencer le cours"}
          <ArrowRight size={17} />
        </button>
      </article>
    );
  }
  function workRows(items: any[]) {
    return items.map((s: any) => (
      <article className="academy-work-row" key={s.id}>
        <span
          className={`academy-status ${s.reviewedAt ? "success" : "waiting"}`}
        >
          {s.reviewedAt ? "Corrigé" : "À corriger"}
        </span>
        <div>
          <h3>{staff ? name(s.enrollment) : "TP de synthèse"}</h3>
          <p>{course(s.enrollment.courseId)?.title}</p>
          <small>
            Remis le {date(s.createdAt)}
            {s.reviewedAt ? ` · Note : ${s.grade}/100` : ""}
          </small>
        </div>
        <button
          className="button button-secondary"
          onClick={() =>
            staff
              ? inspect(s.enrollment.id)
              : open(s.enrollment.courseId, "resultats")
          }
        >
          {staff ? "Consulter et corriger" : "Lire le retour"}
          <ArrowRight size={16} />
        </button>
      </article>
    ));
  }
  return (
    <div className="academy-shell learning">
      <aside className="academy-sidebar">
        <Link href="/" className="academy-brand">
          <img
            src="/logo-beyond.png"
            width="130"
            height="47"
            alt="Beyond Expertise"
          />
        </Link>
        <div className="academy-space-label">
          {admin
            ? "Administration"
            : staff
              ? "Espace formateur"
              : "Espace apprenant"}
        </div>
        <nav aria-label="Espace de formation">
          {nav.map(([id, Icon]: any) => (
            <button
              key={id}
              aria-current={!selected && view === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={20} />
              <span>{labels[id]}</span>
              {id === "work" && pending.length > 0 && <b>{pending.length}</b>}
            </button>
          ))}
        </nav>
        <div className="academy-sidebar-bottom">
          <Link
            href="/assistance"
            onClick={(e) => {
              if (!canLeaveNotebook()) e.preventDefault();
            }}
          >
            Assistance et accompagnement
          </Link>
          <Link
            href="/avis"
            onClick={(e) => {
              if (!canLeaveNotebook()) e.preventDefault();
            }}
          >
            Donner mon avis
          </Link>
          <button
            onClick={() => navigate("profile")}
            aria-current={view === "profile" ? "page" : undefined}
          >
            <UserRound size={19} />
            Mon compte
          </button>
          <Link
            href="/formations"
            onClick={(e) => {
              if (!canLeaveNotebook()) e.preventDefault();
            }}
          >
            <ArrowUpRight size={19} />
            Voir le catalogue
          </Link>
        </div>
      </aside>
      <div className="academy-workspace">
        <header className="academy-topbar">
          <div>
            <span>Beyond Expertise / </span>
            <strong>{selected ? "Mon cours" : labels[view]}</strong>
          </div>
          <div className="academy-account">
            <span className="academy-avatar">
              {user.fullName
                ?.split(" ")
                .map((s: string) => s[0])
                .slice(0, 2)
                .join("") || "BE"}
            </span>
            <span>{user.fullName}</span>
            <button
              aria-label="Se déconnecter"
              title="Se déconnecter"
              onClick={() => {
                if (canLeaveNotebook())
                  api("/auth/logout", "POST", {})
                    .then(() => window.location.assign("/connexion"))
                    .catch((e) => setError(e.message));
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="academy-main" id="contenu">
          {error && (
            <div className="academy-error" role="alert">
              {error}
              <button
                onClick={() => {
                  setError("");
                  refresh().catch((e) => setError(e.message));
                }}
              >
                Réessayer
              </button>
            </div>
          )}
          {notice && (
            <p role="status" className="learning-notice">
              {notice}
            </p>
          )}
          {!data ? (
            <p role="status">
              Vos données ne sont pas encore disponibles. Utilisez « Réessayer
              ».
            </p>
          ) : selected ? (
            <Reader
              key={`${selected.id}-${selected.tab || "resume"}`}
              id={selected.id}
              user={user}
              initialTab={selected.tab}
              back={() => {
                setSelected(null);
                refresh().catch((e) => setError(e.message));
              }}
            />
          ) : view === "quality" && admin ? (
            <QualityAdmin />
          ) : view === "admin" ? (
            <Admin courses={courses} refresh={refresh} />
          ) : view === "groups" ? (
            <Groups
              initialId={groupId}
              summaries={supervised}
              onChange={refresh}
            />
          ) : (
            <>
              <div className="academy-page-heading">
                <div>
                  <p className="academy-caption">
                    {staff
                      ? "Accompagnement pédagogique"
                      : "Votre espace de formation"}
                  </p>
                  <h1>
                    {view === "overview"
                      ? `Bonjour ${user.fullName?.split(" ")[0] || "et bienvenue"}`
                      : labels[view]}
                  </h1>
                  <p>
                    {view === "overview"
                      ? staff
                        ? "Retrouvez vos groupes et les travaux qui attendent votre retour."
                        : "Reprenez votre apprentissage et retrouvez vos derniers résultats."
                      : view === "courses"
                        ? "Tous les contenus accessibles avec votre compte."
                        : view === "resources"
                          ? "Téléchargez les supports de vos cours pour préparer vos activités."
                          : view === "work"
                            ? staff
                              ? "Les remises de vos apprenants, avec leur état de correction."
                              : "Préparez vos travaux, passez les quiz et consultez les retours."
                            : "Les informations associées à votre accès."}
                  </p>
                </div>
                {view === "overview" && (
                  <span className="academy-date">
                    {new Date().toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                )}
              </div>
              {view === "overview" && (
                <>
                  <div className="academy-summary">
                    {(staff
                      ? [
                          [
                            "Apprenants suivis",
                            new Set(supervised.map((e: any) => e.userId)).size,
                            Users,
                            "groups",
                          ],
                          [
                            "Travaux à corriger",
                            pending.length,
                            ClipboardCheck,
                            "work",
                          ],
                          [
                            "Cours accessibles",
                            courses.length,
                            BookOpen,
                            "courses",
                          ],
                        ]
                      : [
                          ["Mes cours", courses.length, BookOpen, "courses"],
                          [
                            "Leçons lues",
                            mine.reduce(
                              (n: number, e: any) => n + e.lessonsRead,
                              0,
                            ),
                            CheckCircle2,
                            "courses",
                          ],
                          [
                            "Retours du formateur",
                            reviewed.length,
                            ClipboardCheck,
                            "work",
                          ],
                        ]
                    ).map(([label, value, Icon, id]: any) => (
                      <button key={id + label} onClick={() => navigate(id)}>
                        <Icon size={22} />
                        <div>
                          <strong>{value}</strong>
                          <span>{label}</span>
                        </div>
                        <ArrowUpRight size={16} />
                      </button>
                    ))}
                  </div>
                  {!staff && resume && (
                    <section className="academy-resume">
                      <div>
                        <span className="academy-resume-label">
                          <BookOpen size={17} />
                          Votre prochaine étape
                        </span>
                        <h2>{course(resume.courseId)?.title}</h2>
                        <p>
                          {resume.nextLesson
                            ? `À poursuivre : ${resume.nextLesson.title}`
                            : "Les leçons sont lues. Retrouvez votre TP, votre quiz et vos résultats."}
                        </p>
                        {progress(resume)}
                        <button
                          className="button button-accent"
                          onClick={() =>
                            open(
                              resume.courseId,
                              resume.nextLesson?.id || "resultats",
                            )
                          }
                        >
                          Reprendre mon apprentissage
                          <ArrowRight size={18} />
                        </button>
                      </div>
                      <div className="academy-resume-side">
                        <GraduationCap size={64} strokeWidth={1} />
                        <strong>
                          {course(resume.courseId)?.estimatedMinutes} min
                        </strong>
                        <span>Durée pédagogique indicative</span>
                        <small>{resume.groupName}</small>
                      </div>
                    </section>
                  )}
                  <div className="academy-columns">
                    <section>
                      <div className="academy-section-heading">
                        <h2>{staff ? "À traiter en priorité" : "Mes cours"}</h2>
                        <button
                          className="academy-text-button"
                          onClick={() => navigate(staff ? "work" : "courses")}
                        >
                          Tout voir <ArrowRight size={16} />
                        </button>
                      </div>
                      {staff ? (
                        pending.length ? (
                          workRows(pending.slice(0, 4))
                        ) : (
                          <div className="academy-empty">
                            <CheckCircle2 size={28} />
                            <h3>Aucune remise en attente</h3>
                            <p>
                              Les prochains travaux de vos apprenants
                              apparaîtront ici.
                            </p>
                            <button
                              className="button button-secondary"
                              onClick={() => navigate("groups")}
                            >
                              Consulter mes groupes
                            </button>
                          </div>
                        )
                      ) : courses.length ? (
                        courses.slice(0, 3).map(courseRow)
                      ) : (
                        <div className="academy-empty">
                          <BookOpen size={28} />
                          <h3>Votre premier cours vous attend</h3>
                          <p>
                            Un administrateur doit vous attribuer un cours. Il
                            apparaîtra ici dès son attribution.
                          </p>
                        </div>
                      )}
                    </section>
                    <section className="academy-side-section">
                      <h2>{staff ? "Mes groupes" : "Mon accompagnement"}</h2>
                      {staff ? (
                        supervised.length ? (
                          [
                            ...new Set(supervised.map((e: any) => e.groupName)),
                          ].map((g: any) => (
                            <button
                              className="academy-group-shortcut"
                              key={g}
                              onClick={() => {
                                setGroupId("");
                                navigate("groups");
                              }}
                            >
                              <Users size={20} />
                              <span>
                                <strong>{g}</strong>
                                <small>
                                  {
                                    supervised.filter(
                                      (e: any) => e.groupName === g,
                                    ).length
                                  }{" "}
                                  attribution(s)
                                </small>
                              </span>
                              <ArrowRight size={16} />
                            </button>
                          ))
                        ) : (
                          <p>
                            Les groupes attribués par l’administrateur
                            apparaîtront ici.
                          </p>
                        )
                      ) : (
                        mine.map((e: any) => (
                          <div className="academy-mentor" key={e.id}>
                            <span className="academy-avatar">
                              <Users size={19} />
                            </span>
                            <div>
                              <strong>
                                {e.trainer.profile?.fullName ||
                                  "Votre formateur"}
                              </strong>
                              <p>{e.groupName}</p>
                              <button
                                className="academy-text-button"
                                onClick={() => open(e.courseId, "resultats")}
                              >
                                Consulter ses retours <ArrowRight size={15} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                      <div className="academy-side-link">
                        <FolderOpen size={21} />
                        <h3>Vos supports de cours</h3>
                        <p>
                          Notebooks, jeux de données et ressources pédagogiques
                          disponibles.
                        </p>
                        <button
                          className="academy-text-button"
                          onClick={() => navigate("resources")}
                        >
                          Ouvrir les ressources <ArrowRight size={16} />
                        </button>
                      </div>
                    </section>
                  </div>
                </>
              )}
              {view === "courses" && (
                <>
                  <label className="academy-search">
                    <Search size={19} />
                    <input
                      type="search"
                      placeholder="Rechercher dans mes cours"
                      aria-label="Rechercher dans mes cours"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <div className="academy-course-list">
                    {filtered.map(courseRow)}
                    {!filtered.length && (
                      <p className="academy-empty">
                        {courses.length
                          ? "Aucun cours ne correspond à cette recherche."
                          : "Aucun cours attribué pour le moment."}
                      </p>
                    )}
                  </div>
                </>
              )}
              {view === "work" &&
                (staff ? (
                  <>
                    <h2>En attente de correction ({pending.length})</h2>
                    {pending.length ? (
                      workRows(pending)
                    ) : (
                      <p className="academy-empty">
                        Aucun travail en attente. Les remises apparaissent ici
                        automatiquement.
                      </p>
                    )}
                    <h2>Travaux corrigés ({reviewed.length})</h2>
                    {workRows(reviewed)}
                  </>
                ) : (
                  <div className="academy-course-list">
                    {mine.map((e: any) => {
                      const c = course(e.courseId);
                      return (
                        <section key={e.id} className="academy-assessment">
                          <h2>{c.title}</h2>
                          {c.hasNotebook && (
                            <div className="academy-assessment-row">
                              <ClipboardCheck size={23} />
                              <div>
                                <h3>TP de synthèse</h3>
                                <p>
                                  {e.submissions.length
                                    ? `${e.submissions.length} remise(s) · ${e.submissions.filter((s: any) => s.reviewedAt).length} corrigée(s)`
                                    : e.draft
                                      ? `Brouillon enregistré le ${date(e.draft.updatedAt)}`
                                      : "Votre travail n’a pas encore été remis."}
                                </p>
                              </div>
                              <button
                                className="button button-primary"
                                onClick={() => open(c.id, "tp")}
                              >
                                {e.draft ? "Reprendre mon TP" : "Ouvrir le TP"}
                              </button>
                            </div>
                          )}
                          {c.hasQuiz && (
                            <div className="academy-assessment-row">
                              <CheckCircle2 size={23} />
                              <div>
                                <h3>Quiz de connaissances</h3>
                                <p>
                                  {e.latestQuiz
                                    ? `Dernier résultat : ${e.latestQuiz.score} % · ${date(e.latestQuiz.completedAt)}`
                                    : "Aucune tentative enregistrée."}
                                </p>
                              </div>
                              <button
                                className="button button-secondary"
                                onClick={() => open(c.id, "quiz")}
                              >
                                {e.latestQuiz
                                  ? "Repasser le quiz"
                                  : "Passer le quiz"}
                              </button>
                            </div>
                          )}
                          <button
                            className="academy-text-button"
                            onClick={() => open(c.id, "resultats")}
                          >
                            Voir mes notes, corrections et retours
                            <ArrowRight size={16} />
                          </button>
                        </section>
                      );
                    })}
                    {!mine.length && (
                      <p className="academy-empty">
                        Vos activités apparaîtront après l’attribution d’un
                        cours.
                      </p>
                    )}
                  </div>
                ))}
              {view === "resources" && (
                <div className="academy-resource-list">
                  {courses.map((c: any) => {
                    const e = mine.find((e: any) => e.courseId === c.id);
                    const resources = [
                      ...(c.hasNotebook
                        ? [
                            [
                              "starter",
                              "Notebook de départ",
                              "Le fichier à compléter pour le TP",
                            ],
                          ]
                        : []),
                      ...(c.hasCsv
                        ? [
                            [
                              "csv",
                              "Jeu de données",
                              "Les données nécessaires aux exercices",
                            ],
                          ]
                        : []),
                      ...(c.hasPractice
                        ? [
                            [
                              "practice",
                              "Atelier guidé",
                              "Un notebook pour vous entraîner",
                            ],
                          ]
                        : []),
                      ...(c.hasSolution
                        ? [
                            [
                              "solution",
                              "Corrigé commenté",
                              staff
                                ? "Support réservé au formateur"
                                : "Accessible après une correction du formateur",
                            ],
                          ]
                        : []),
                    ];
                    return (
                      <section key={c.id}>
                        <h2>{c.title}</h2>
                        {resources.length ? (
                          resources.map(([key, label, desc]) => {
                            const locked =
                              key === "solution" &&
                              !staff &&
                              !e?.submissions.some((s: any) => s.reviewedAt);
                            return (
                              <div className="academy-resource" key={key}>
                                <FolderOpen size={22} />
                                <div>
                                  <h3>{label}</h3>
                                  <p>{desc}</p>
                                </div>
                                <button
                                  className="button button-secondary"
                                  disabled={locked || !!downloading}
                                  onClick={() => void getResource(c, key)}
                                >
                                  <Download size={17} />
                                  {downloading === c.id + key
                                    ? "Préparation…"
                                    : locked
                                      ? "Après correction"
                                      : "Télécharger"}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <p>
                            Les leçons de ce cours sont consultables dans le
                            lecteur.
                          </p>
                        )}
                      </section>
                    );
                  })}
                  {!courses.length && (
                    <p className="academy-empty">
                      Les ressources de vos cours seront regroupées ici après
                      attribution.
                    </p>
                  )}
                </div>
              )}
              {view === "profile" && (
                <section className="academy-profile">
                  <span className="academy-avatar large">
                    <UserRound size={32} />
                  </span>
                  <h2>{user.fullName}</h2>
                  <dl>
                    <div>
                      <dt>Adresse e-mail</dt>
                      <dd>{user.email}</dd>
                    </div>
                    <div>
                      <dt>Espace</dt>
                      <dd>
                        {admin
                          ? "Administrateur"
                          : staff
                            ? "Formateur"
                            : "Apprenant"}
                      </dd>
                    </div>
                  </dl>
                  <p>
                    Pour modifier votre identité ou récupérer un accès,
                    contactez l’administrateur du centre.
                  </p>
                  <Link
                    className="button button-secondary"
                    href="/recuperation"
                  >
                    Récupérer mon accès
                  </Link>
                </section>
              )}
            </>
          )}
        </main>
        <footer className="academy-footer">
          Beyond Expertise · Espace de formation{" "}
          <span>Vos travaux et résultats sont enregistrés sur ce serveur.</span>
        </footer>
      </div>
    </div>
  );
}
