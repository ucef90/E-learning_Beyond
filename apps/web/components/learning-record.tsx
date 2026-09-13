"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/learning-api";
export default function LearningRecord({ courseId }: { courseId: string }) {
  const [record, setRecord] = useState<any>(null),
    [message, setMessage] = useState("Chargement du relevé…"),
    [name, setName] = useState("");
  useEffect(() => {
    let alive = true;
    (async () => {
      const me = await api("/auth/me");
      const who =
        new URLSearchParams(window.location.search).get("apprenant") || me.id;
      const r = await api(
        "/courses/" +
          courseId +
          "/learners/" +
          encodeURIComponent(who) +
          "/export",
      );
      if (alive) {
        setRecord(r);
        setName(r.learnerName || (who === me.id ? me.fullName : who));
      }
    })().catch((e) => {
      if (alive) setMessage(e.message);
    });
    return () => {
      alive = false;
    };
  }, [courseId]);
  if (!record)
    return (
      <main className="learning" id="contenu">
        <h1>Relevé pédagogique</h1>
        <p role="status">{message}</p>
      </main>
    );
  return (
    <main className="learning" id="contenu">
      <p>Beyond Expertise</p>
      <h1>Relevé pédagogique</h1>
      <p>Édité le {new Date(record.exportedAt).toLocaleString("fr-FR")}</p>
      <h2>{record.course.title}</h2>
      <dl>
        <dt>Apprenant</dt>
        <dd>{name}</dd>
        <dt>Version du cours</dt>
        <dd>{record.course.version}</dd>
        <dt>Groupe</dt>
        <dd>{record.access?.groupName || "Sans groupe"}</dd>
        <dt>Attribution</dt>
        <dd>
          {record.access?.createdAt
            ? new Date(record.access.createdAt).toLocaleDateString("fr-FR")
            : "Non renseignée"}
        </dd>
      </dl>
      <h2>Résultats enregistrés</h2>
      <p>
        <strong>
          {record.completed
            ? "Critères du module atteints"
            : "Parcours en cours, critères non tous atteints"}
        </strong>
      </p>
      <p>{record.rules}</p>
      <h3>Leçons</h3>
      <ul>
        {record.course.modules
          .flatMap((m: any) => m.lessons)
          .filter((l: any) => l.type === "TEXT")
          .map((l: any) => (
            <li key={l.id}>
              {l.title} :{" "}
              {record.progress.some(
                (p: any) => p.lessonId === l.id && p.completed,
              )
                ? "déclarée lue"
                : "à poursuivre"}
            </li>
          ))}
      </ul>
      <h3>Quiz</h3>
      <ul>
        {record.completion.quizResults.map((q: any) => (
          <li key={q.id}>
            {q.title} :{" "}
            {q.bestScore === null ? "non réalisé" : q.bestScore + " %"} · seuil{" "}
            {q.passingScore} %
          </li>
        ))}
      </ul>
      <h3>Travaux et appréciations</h3>
      {record.submissions.length ? (
        record.submissions.map((s: any) => (
          <section key={s.id} className="learning-result">
            <p>
              Remis le {new Date(s.createdAt).toLocaleDateString("fr-FR")} ·{" "}
              {s.reviewedAt ? s.grade + "/100" : "en attente de correction"}
            </p>
            <p className="preserve-lines">
              {s.feedback || "Aucun retour enregistré."}
            </p>
          </section>
        ))
      ) : (
        <p>Aucun travail remis.</p>
      )}
      <p>
        {record.certification}. Ce relevé présente les activités et résultats
        enregistrés ; il ne constitue pas à lui seul une preuve de présence ou
        une certification de compétences.
      </p>
      <button className="button button-primary" onClick={() => window.print()}>
        Imprimer ou enregistrer en PDF
      </button>
      <p className="learning-note">
        Dans la fenêtre d'impression, choisissez « Enregistrer au format PDF »
        pour conserver ce document.
      </p>
    </main>
  );
}
