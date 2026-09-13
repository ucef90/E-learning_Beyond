import Link from "next/link";
import { centre } from "@/lib/centre";
export const qualityLinks = [
  ["/qualite", "Démarche qualité"],
  ["/informations-pratiques", "Préparer ma formation"],
  ["/accessibilite", "Handicap et accessibilité"],
  ["/assistance", "Assistance"],
  ["/reclamations", "Réclamations"],
  ["/avis", "Donner mon avis"],
] as const;
export function CentreContact() {
  return (
    <div className="quality-contact">
      <a href={centre.phoneHref}>{centre.phone}</a>
      <a href={centre.emailHref}>{centre.email}</a>
    </div>
  );
}
export function QualityLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main id="contenu" className="section page-main-compact quality-page">
      <div className="page-shell">
        <div className="quality-heading">
          <span className="eyebrow eyebrow-dark">
            Beyond Expertise · À vos côtés
          </span>
          <h1>{title}</h1>
          <p className="section-copy">{intro}</p>
          <CentreContact />
        </div>
        <nav className="quality-nav" aria-label="Information et accompagnement">
          {qualityLinks.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="quality-content">{children}</div>
      </div>
    </main>
  );
}
export function QualityCard({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="quality-card" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
