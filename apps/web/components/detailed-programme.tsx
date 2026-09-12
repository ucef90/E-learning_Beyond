import {
  ArrowDownToLine,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
} from "lucide-react";
import type { DetailedProgramme } from "@/lib/api";
import { ProgrammeDayNavigation } from "@/components/programme-day-navigation";

function duration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  return `${hours} h${minutes % 60 ? ` ${minutes % 60}` : ""}`;
}

export function DetailedProgrammeContent({
  programme: p,
}: {
  programme: DetailedProgramme;
}) {
  const days = [...new Set(p.modules.map((m) => m.day))];
  return (
    <section
      id="programme"
      className="detailed-programme"
      aria-labelledby="programme-title"
    >
      <div className="programme-heading">
        <div>
          <p className="detail-eyebrow">Votre progression, jour après jour</p>
          <h2 id="programme-title">Programme détaillé</h2>
          <p>
            {p.modules.length} séquences · {p.totalHours} heures indicatives ·
            ateliers et évaluation
          </p>
        </div>
        <a
          className="programme-download"
          href={`/programmes/${p.slug}.md`}
          download
        >
          <ArrowDownToLine size={18} aria-hidden="true" /> Télécharger le
          programme (.md)
        </a>
      </div>
      <div className="programme-case">
        <FlaskConical size={24} aria-hidden="true" />
        <div>
          <h3>Le cas fil rouge</h3>
          <p>{p.caseStudy}</p>
        </div>
      </div>
      <details className="programme-preparation">
        <summary>Préparer votre formation et découvrir la méthode</summary>
        <h3>Préparer la formation</h3>
        <p>{p.preparation}</p>
        <p>{p.methods}</p>
      </details>
      <ProgrammeDayNavigation days={days} />
      {days.map((day) => {
        const modules = p.modules.filter((m) => m.day === day);
        const minutes = modules.reduce((sum, m) => sum + m.durationMinutes, 0);
        return (
          <details
            className="programme-day"
            id={`programme-jour-${day}`}
            key={day}
            open={day === days[0]}
          >
            <summary aria-labelledby={`programme-day-title-${day}`}>
              <span className="programme-day-number">
                Jour <b>{String(day).padStart(2, "0")}</b>
              </span>
              <span className="programme-day-caption">
                <strong id={`programme-day-title-${day}`}>
                  {modules[0].title}
                </strong>
                <span>
                  {duration(minutes)} · {modules.length} séquences avec mise en
                  pratique
                </span>
              </span>
              <ChevronDown
                size={20}
                className="programme-chevron"
                aria-hidden="true"
              />
            </summary>
            <div className="programme-day-body">
              {modules.map((m) => (
                <article className="programme-sequence" key={m.title}>
                  <p className="programme-sequence-meta">
                    Séquence {p.modules.indexOf(m) + 1} ·{" "}
                    {duration(m.durationMinutes)}
                  </p>
                  <h4>{m.title}</h4>
                  <ul className="programme-topics">
                    {m.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                  <div className="programme-practice">
                    <p className="programme-workshop">
                      <strong>Atelier prévu</strong>
                      {m.workshop}
                    </p>
                    {m.deliverable && (
                      <p className="programme-deliverable">
                        <strong>
                          <ClipboardCheck size={16} aria-hidden="true" />{" "}
                          Livrable attendu
                        </strong>
                        {m.deliverable}
                      </p>
                    )}
                  </div>
                  {m.expertChallenge && (
                    <div className="programme-challenge">
                      <span>Pour aller plus loin</span>
                      <p>{m.expertChallenge}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </details>
        );
      })}
      <section
        className="programme-assessment"
        id="programme-evaluation"
        aria-labelledby="programme-assessment-title"
      >
        <p className="detail-eyebrow">Mettre vos acquis à l’épreuve</p>
        <h3 id="programme-assessment-title">Évaluation finale prévue</h3>
        <p>
          {p.assessment.format} Durée indicative :{" "}
          {p.assessment.durationMinutes} minutes.
        </p>
        <strong>Critères de réussite</strong>
        <ul>
          {p.assessment.criteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
      <div className="programme-editorial-note">
        <p>
          <strong>Adaptation et validation pédagogique.</strong> Version
          enrichie proposée, à valider par le formateur. {p.scheduleNote}
        </p>
        <p className="learning-note">{p.materialsStatus}</p>
      </div>
      {p.references.length > 0 && (
        <details className="programme-references">
          <summary>Références pour approfondir</summary>
          <p>
            Documentation des organismes et éditeurs. La progression et les
            ateliers sont une rédaction originale pour Beyond Expertise.
          </p>
          <ul>
            {p.references.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
