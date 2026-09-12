import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  GraduationCap,
  Monitor,
} from "lucide-react";
import type { UiTraining } from "@/lib/api";
import { trainingPresentation } from "@/lib/training-presentation";
export function TrainingCard({ training }: { training: UiTraining }) {
  const info = trainingPresentation(training);
  return (
    <article
      className="card training-card restored-training-card"
      style={{ gridColumn: "span 4" }}
    >
      <div className="training-card-head">
        <p className="eyebrow">{training.category}</p>
      </div>
      <h3 className="training-card-title">
        <Link href={`/formations/${training.slug}`}>{training.title}</Link>
      </h3>
      <p className="section-copy training-card-summary">{training.summary}</p>
      <div className="training-card-meta-grid">
        <span>
          <Clock3 size={15} aria-hidden="true" />
          {training.duration}
        </span>
        <span>
          <GraduationCap size={15} aria-hidden="true" />
          {training.level}
        </span>
        <span>
          <Monitor size={15} aria-hidden="true" />
          {training.format}
        </span>
      </div>
      <div className="training-commercial">
        <div className="training-price">
          <span>{info.hasPrice ? "À partir de" : "Tarif"}</span>
          <strong>{info.price}</strong>
        </div>
        <div className="training-next-session">
          <CalendarDays size={18} aria-hidden="true" />
          <div>
            <span>Prochaine session{info.proposed ? " proposée" : ""}</span>
            <strong>{info.session}</strong>
          </div>
        </div>
        {info.indicative && (
          <small>Date et disponibilité à confirmer avec le centre.</small>
        )}
      </div>
      <div className="training-card-bottom">
        {training.source?.syllabusSummary && (
          <p className="programme-card-summary">
            Programme détaillé · {training.source.syllabusSummary.moduleCount}{" "}
            séquences
          </p>
        )}
        <p
          className={
            training.courses.length
              ? "catalog-course-status ready"
              : "catalog-course-status"
          }
        >
          {training.courses.length
            ? "Cours disponible sur attribution"
            : "Cours e-learning à préparer"}
        </p>
        <div className="restored-card-actions">
          <Link
            className="button button-primary"
            href={`/formations/${training.slug}`}
          >
            Voir la formation <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            className="button button-secondary"
            href={`/devis?formation=${encodeURIComponent(training.title)}`}
          >
            Demander un devis
          </Link>
        </div>
      </div>
    </article>
  );
}
