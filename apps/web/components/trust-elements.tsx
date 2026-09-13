import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  GraduationCap,
  Star,
  WalletCards,
} from "lucide-react";

export function RatingStars() {
  return (
    <span className="rating-stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} size={14} fill="currentColor" />
      ))}
    </span>
  );
}
export function QualityBadge({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/qualite#qualiopi"
      className={"quality-progress-badge" + (compact ? " compact" : "")}
    >
      <BadgeCheck size={compact ? 23 : 34} aria-hidden="true" />
      <span>
        <strong>Démarche Qualiopi</strong>
        <small>Finalisation en cours</small>
      </span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
export function TrustStrip() {
  return (
    <section
      className="home-trust-section"
      aria-label="Satisfaction, qualité et financements"
    >
      <div className="page-shell">
        <div className="restored-trust-strip">
          <Link href="/qualite#resultats" className="trust-rating">
            <RatingStars />
            <strong>
              4,8<span>/5</span>
            </strong>
            <span>Satisfaction apprenants</span>
            <small>Évaluations internes du centre</small>
          </Link>
          <QualityBadge />
          <Link href="/financements" className="trust-funding">
            <WalletCards size={25} aria-hidden="true" />
            <strong>CPF & OPCO</strong>
            <span>Étudier votre financement</span>
            <small>Selon éligibilité et accord du financeur</small>
          </Link>
          <Link href="/methodologie" className="trust-practice">
            <GraduationCap size={27} aria-hidden="true" />
            <strong>Des experts de terrain</strong>
            <span>Des cas concrets, un suivi humain</span>
            <small>Inter · Intra · Sur mesure</small>
          </Link>
        </div>
      </div>
    </section>
  );
}
