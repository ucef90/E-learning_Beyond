"use client";
import { useEffect, useState, FormEvent } from "react";
import { api } from "@/lib/learning-api";
import LessonContent from "./lesson-content";

export function Positioning({
  courseId,
  state,
  refresh,
}: {
  courseId: string;
  state: any;
  refresh: () => Promise<void>;
}) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const values = state.access?.positioning || {};
  return (
    <section>
      <h2>Préparer mon parcours</h2>
      <p>
        Précisez votre objectif et votre expérience. Votre formateur pourra
        adapter son accompagnement.
      </p>
      <form
        key={state.access?.positioningAt || "initial"}
        className="learning-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setBusy(true);
          try {
            await api(
              "/courses/" + courseId + "/positioning",
              "PUT",
              Object.fromEntries(f),
            );
            await refresh();
            setMessage(
              "Votre positionnement est enregistré et accessible au formateur.",
            );
          } catch (e) {
            setMessage((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {[
          ["goals", "Ce que je souhaite savoir faire", 10],
          ["experience", "Mon expérience et mes prérequis", 5],
          ["equipment", "Mon matériel et les logiciels disponibles", 5],
          ["support", "L'accompagnement dont j'ai besoin", 0],
        ].map(([name, label, min]) => (
          <label key={name}>
            {label}
            <textarea
              name={String(name)}
              required={Number(min) > 0}
              minLength={Number(min)}
              maxLength={name === "support" ? 2000 : 3000}
              rows={4}
              defaultValue={values[String(name)] || ""}
            />
          </label>
        ))}
        <button
          className="button button-primary"
          disabled={busy || !state.access}
        >
          Enregistrer mon positionnement
        </button>
        <p role="status">{message}</p>
      </form>
    </section>
  );
}
export function PrivateResources({ courseId }: { courseId: string }) {
  const [assets, setAssets] = useState<any[]>([]),
    [message, setMessage] = useState("Chargement des supports…");
  useEffect(() => {
    let alive = true;
    api("/courses/" + courseId + "/assets")
      .then((a) => {
        if (alive) {
          setAssets(a);
          setMessage(
            a.length ? "" : "Aucun support complémentaire pour ce cours.",
          );
        }
      })
      .catch((e) => {
        if (alive) setMessage(e.message);
      });
    return () => {
      alive = false;
    };
  }, [courseId]);
  return (
    <section>
      <h2>Supports du cours</h2>
      <p role="status">{message}</p>
      <ul className="studio-assets">
        {assets.map((a) => (
          <li key={a.id}>
            <div>
              <strong>{a.title}</strong>
              <span>
                {a.filename} · {Math.ceil(a.size / 1024)} Ko
              </span>
            </div>
            <a
              className="button button-secondary"
              href={
                "/api/v1/courses/" + courseId + "/assets/" + a.id + "/download"
              }
            >
              Télécharger {a.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
export function WrittenAssessment({
  courseId,
  instructions,
  rubric,
  state,
  refresh,
}: {
  courseId: string;
  instructions: string;
  rubric: string;
  state: any;
  refresh: () => Promise<void>;
}) {
  const [text, setText] = useState(""),
    [comment, setComment] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty) return;
    const before = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const leave = (e: Event) => {
      if (
        !window.confirm(
          "Quitter sans remettre ce travail ? Le texte saisi sera perdu.",
        )
      )
        e.preventDefault();
    };
    window.addEventListener("beforeunload", before);
    window.addEventListener("notebook-before-leave", leave);
    return () => {
      window.removeEventListener("beforeunload", before);
      window.removeEventListener("notebook-before-leave", leave);
    };
  }, [dirty]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/courses/" + courseId + "/written-submissions", "POST", {
        writtenWork: text,
        comment,
      });
      setDirty(false);
      setText("");
      setComment("");
      await refresh();
      setMessage(
        "Travail remis. Vous retrouverez le retour du formateur dans vos résultats.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h2>Mon dossier à remettre</h2>
      <div className="lesson-prose">
        <LessonContent body={instructions} />
      </div>
      <h3>Grille d'évaluation</h3>
      <div className="lesson-prose">
        <LessonContent body={rubric} />
      </div>
      <form className="learning-form" onSubmit={submit}>
        <label>
          Mon travail et mes justifications
          <textarea
            rows={18}
            required
            minLength={30}
            maxLength={30000}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setDirty(true);
            }}
          />
        </label>
        <label>
          Commentaire au formateur
          <textarea
            rows={3}
            maxLength={3000}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setDirty(true);
            }}
          />
        </label>
        <button
          className="button button-primary"
          disabled={busy || !state.access}
        >
          Remettre mon travail au formateur
        </button>
        <p>
          Le texte est enregistré sur le serveur lorsque vous remettez votre
          travail. Chaque remise est conservée.
        </p>
        <p role="status">{message}</p>
      </form>
    </section>
  );
}
