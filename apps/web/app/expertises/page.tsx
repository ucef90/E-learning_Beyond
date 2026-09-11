import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSeoCategoryHubs, getTrainings, getTrainingsForSeoHub } from "@/lib/api";

export const metadata: Metadata = {
  title: "Expertises Formation | Beyond Expertise",
  description: "Explorez les expertises formation Beyond Expertise autour de Copilot, AI Agents, AI Security, Lakehouse et LLMOps."
};

export default async function ExpertiseIndexPage() {
  const trainings = await getTrainings();
  const hubs = getSeoCategoryHubs().map((hub) => ({
    ...hub,
    trainings: getTrainingsForSeoHub(trainings, hub.slug)
  }));

  return (
    <main className="section page-main-compact">
      <div className="page-shell">
        <span className="eyebrow">Expertises premium</span>
        <h1 className="section-title" style={{ maxWidth: "14ch" }}>
          Des pages SEO pensees pour les sujets formation les plus porteurs.
        </h1>
        <p className="section-copy">
          Beyond Expertise structure ses parcours autour des sujets a plus forte traction commerciale pour aider les directions formation, innovation, data et transformation a identifier rapidement les offres pertinentes.
        </p>

        <div className="feature-grid" style={{ marginTop: 28 }}>
          {hubs.map((hub) => (
            <article key={hub.slug} className="card expertise-card" style={{ gridColumn: "span 4", padding: 24 }}>
              <span className="premium-category-accent">{hub.shortLabel}</span>
              <h2 style={{ margin: "14px 0 10px", fontSize: "1.5rem" }}>{hub.title}</h2>
              <p className="section-copy" style={{ marginTop: 0 }}>{hub.heroDescription}</p>
              <p className="expertise-count">{hub.trainings.length} formations associees</p>
              <p className="expertise-audience">{hub.audience}</p>
              <div style={{ marginTop: 18 }}>
                <Link href={`/expertises/${hub.slug}`} className="button button-primary">
                  Voir la page categorie <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
