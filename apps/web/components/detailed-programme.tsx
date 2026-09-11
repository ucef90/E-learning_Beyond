import type { DetailedProgramme } from "@/lib/api";

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
          <h2 id="programme-title">Programme détaillé</h2>
          <p>
            {p.modules.length} séquences · {p.totalHours} heures indicatives
          </p>
        </div>
        <a
          className="button button-secondary"
          href={`/programmes/${p.slug}.md`}
          download
        >
          Télécharger le programme (.md)
        </a>
      </div>
      <p className="learning-note">
        Version enrichie proposée, à valider par le formateur. {p.scheduleNote}
      </p>
      <h3>Le cas fil rouge</h3>
      <p>{p.caseStudy}</p>
      <h3>Préparer la formation</h3>
      <p>{p.preparation}</p>
      <p>{p.methods}</p>
      <nav className="programme-days-nav" aria-label="Journées du programme">
        {days.map((day) => (
          <a key={day} href={`#programme-jour-${day}`}>
            Jour {day}
          </a>
        ))}
        <a href="#programme-evaluation">Évaluation</a>
      </nav>
      {days.map((day) => (
        <section
          className="programme-day"
          id={`programme-jour-${day}`}
          key={day}
          aria-labelledby={`programme-day-title-${day}`}
        >
          <h3 id={`programme-day-title-${day}`}>
            Jour {day} <span>7 heures</span>
          </h3>
          {p.modules
            .filter((m) => m.day === day)
            .map((m) => (
              <article className="programme-sequence" key={m.title}>
                <p className="programme-sequence-meta">
                  Séquence {p.modules.findIndex((s) => s === m) + 1} ·{" "}
                  {duration(m.durationMinutes)}
                </p>
                <h4>{m.title}</h4>
                <ul>
                  {m.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <p className="programme-workshop">
                  <strong>Atelier prévu.</strong> {m.workshop}
                </p>
              </article>
            ))}
        </section>
      ))}
      <section
        className="programme-assessment"
        id="programme-evaluation"
        aria-labelledby="programme-assessment-title"
      >
        <h3 id="programme-assessment-title">Évaluation finale prévue</h3>
        <p>
          {p.assessment.format} Durée indicative :{" "}
          {p.assessment.durationMinutes} minutes.
        </p>
        <p>
          <strong>Critères de réussite</strong>
        </p>
        <ul>
          {p.assessment.criteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
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
      <p className="learning-note">{p.materialsStatus}</p>
    </section>
  );
}
