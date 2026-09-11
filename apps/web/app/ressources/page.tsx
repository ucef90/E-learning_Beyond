import type { Metadata } from "next";
import Link from "next/link";
import { getSeoCategoryHubs } from "@/lib/api";

export const metadata: Metadata = {
  title: "Ressources | Beyond Expertise",
  description: "Ressources, themes prioritaires et points de vue Beyond Expertise autour de la data, l'IA, la securite et la transformation."
};

export default function ResourcesPage() {
  const hubs = getSeoCategoryHubs();

  return (
    <main className="section page-main-compact">
      <div className="page-shell">
        <span className="eyebrow">Ressources</span>
        <h1 className="section-title">Des contenus pour orienter les decisions formation sur les sujets qui montent vraiment.</h1>
        <p className="section-copy">
          Cette page sert de point d'entree pour les univers a fort potentiel commercial et pour les futurs contenus SEO, guides, analyses et comparatifs Beyond Expertise.
        </p>
        <div className="feature-grid" style={{ marginTop: 28 }}>
          {hubs.map((hub) => (
            <article key={hub.slug} className="card expertise-card" style={{ gridColumn: "span 4", padding: 24 }}>
              <span className="premium-category-accent">{hub.shortLabel}</span>
              <h2 style={{ margin: "14px 0 10px" }}>{hub.title}</h2>
              <p className="section-copy" style={{ marginTop: 0 }}>{hub.businessValue}</p>
              <Link href={`/expertises/${hub.slug}`} className="button button-secondary">
                Ouvrir la ressource
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
