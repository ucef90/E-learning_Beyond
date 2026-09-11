import Link from "next/link";
import type { UiTraining } from "@/lib/api";
export function TrainingCard({ training }: { training: UiTraining }) {
  return (
    <article className="card training-card" style={{ gridColumn: "span 4" }}>
      <div className="training-card-head">
        <p className="eyebrow" style={{ margin: 0 }}>
          {training.category}
        </p>
      </div>
      <h3 className="training-card-title">{training.title}</h3>
      <p className="section-copy training-card-summary">{training.summary}</p>
      <div className="training-card-meta-grid">
        <span>
          {training.duration} · {training.format}
        </span>
        <span>Niveau : {training.level}</span>
      </div>
      <div className="training-card-bottom">
        <p
          className={
            training.courses.length
              ? "catalog-course-status ready"
              : "catalog-course-status"
          }
        >
          {training.courses.length
            ? "Module pilote disponible sur attribution"
            : "Cours e-learning à préparer"}
        </p>
        <Link
          className="button button-primary"
          href={`/formations/${training.slug}`}
        >
          Voir les objectifs et le contenu
        </Link>
      </div>
    </article>
  );
}
