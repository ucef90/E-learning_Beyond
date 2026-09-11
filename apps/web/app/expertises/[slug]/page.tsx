import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TrainingCard } from "@/components/training-card";
import { getSeoCategoryHubBySlug, getSeoCategoryHubs, getTrainings, getTrainingsForSeoHub } from "@/lib/api";

export async function generateStaticParams() {
  return getSeoCategoryHubs().map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hub = getSeoCategoryHubBySlug(slug);

  if (!hub) {
    return {
      title: "Expertise | Beyond Expertise"
    };
  }

  return {
    title: `${hub.seoTitle} | Beyond Expertise`,
    description: hub.seoDescription
  };
}

export default async function ExpertiseDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = getSeoCategoryHubBySlug(slug);

  if (!hub) {
    notFound();
  }

  const trainings = getTrainingsForSeoHub(await getTrainings(), slug);

  return (
    <main className="section page-main-compact">
      <div className="page-shell">
        <div className="expertise-hero">
          <div>
            <span className="eyebrow">{hub.shortLabel}</span>
            <h1 className="section-title" style={{ maxWidth: "12ch" }}>{hub.heroTitle}</h1>
            <p className="section-copy">{hub.heroDescription}</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 24 }}>
              <Link href="/devis" className="button button-primary">
                {hub.primaryCta}
              </Link>
              <Link href="/formations" className="button button-secondary">
                {hub.secondaryCta}
              </Link>
            </div>
          </div>

          <aside className="expertise-sidecard">
            <strong>{trainings.length}</strong>
            <span>formations associees a cette expertise</span>
            <p>{hub.audience}</p>
            <p>{hub.promise}</p>
          </aside>
        </div>

        <section className="expertise-summary-band" style={{ marginTop: 34 }}>
          <article className="card" style={{ padding: 24 }}>
            <span className="premium-category-accent">Business Value</span>
            <h2 style={{ margin: "14px 0 10px" }}>Pourquoi ce sujet est prioritaire</h2>
            <p className="section-copy" style={{ marginBottom: 0 }}>{hub.businessValue}</p>
          </article>
          <article className="card" style={{ padding: 24 }}>
            <span className="premium-category-accent">Audience</span>
            <h2 style={{ margin: "14px 0 10px" }}>Publics concernes</h2>
            <p className="section-copy" style={{ marginBottom: 0 }}>{hub.audience}</p>
          </article>
          <article className="card" style={{ padding: 24 }}>
            <span className="premium-category-accent">Promise</span>
            <h2 style={{ margin: "14px 0 10px" }}>Promesse Beyond Expertise</h2>
            <p className="section-copy" style={{ marginBottom: 0 }}>{hub.promise}</p>
          </article>
        </section>

        <section style={{ marginTop: 48 }}>
          <span className="eyebrow">Contenu editorial</span>
          <h2 style={{ margin: "16px 0 24px", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
            Une page categorie orientee SEO, conversion et cadrage metier
          </h2>
          <div className="feature-grid">
            {hub.editorialBlocks.map((block) => (
              <article key={block.title} className="card expertise-card" style={{ gridColumn: "span 4", padding: 24 }}>
                <h3 style={{ marginTop: 0 }}>{block.title}</h3>
                <p className="section-copy" style={{ marginBottom: 0 }}>{block.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 48 }}>
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">Formations associees</span>
              <h2 style={{ margin: "16px 0 10px", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                Les formations les plus pertinentes sur {hub.shortLabel}
              </h2>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Une selection reliee directement au catalogue Beyond Expertise pour capter les recherches intentionnelles et orienter vers les bonnes fiches.
              </p>
            </div>
            <Link href="/formations" className="button button-secondary">
              Voir tout le catalogue <ArrowRight size={18} />
            </Link>
          </div>

          <div className="cards-grid" style={{ marginTop: 24 }}>
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        </section>

        <section className="catalog-highlight" style={{ marginTop: 48 }}>
          <div>
            <span className="eyebrow">Besoin entreprise</span>
            <h2 className="section-title" style={{ maxWidth: "12ch" }}>Construire un parcours sur-mesure autour de {hub.shortLabel}.</h2>
            <p className="section-copy">
              Beyond Expertise peut transformer cette expertise en parcours intra, programme blended, academie metier ou offre combinee catalogue + coaching + ressources e-learning.
            </p>
          </div>
          <div className="catalog-highlight-list">
            <Link href="/devis" className="catalog-highlight-item">
              <strong>Demander un devis entreprise</strong>
              <span>Construire un parcours adapte a votre maturite, vos profils et vos objectifs.</span>
            </Link>
            <Link href="/contact" className="catalog-highlight-item">
              <strong>Parler a un conseiller</strong>
              <span>Qualifier vos besoins et orienter les bons publics vers les bonnes formations.</span>
            </Link>
            <Link href="/expertises" className="catalog-highlight-item">
              <strong>Explorer les autres expertises</strong>
              <span>Copilot, AI Agents, AI Security, Lakehouse, LLMOps et autres univers premium.</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
