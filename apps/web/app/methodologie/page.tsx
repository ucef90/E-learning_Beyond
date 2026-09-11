import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Méthodologie | Beyond Expertise",
  description: "La méthodologie Beyond Expertise pour cadrer les besoins, structurer les parcours et déployer des formations à forte valeur business."
};

const steps = [
  {
    num: "01",
    accent: false,
    title: "Cadrer",
    description: "Identifier les bons publics, les enjeux et les résultats attendus avant de choisir un contenu ou un format.",
    points: [
      "Audit des compétences existantes et des lacunes",
      "Définition des objectifs métier mesurables",
      "Identification des publics cibles et des prérequis"
    ]
  },
  {
    num: "02",
    accent: true,
    title: "Prioriser",
    description: "Choisir les formats, cas d'usage et modules les plus utiles au contexte — éviter le contenu inutile et les formations généralistes.",
    points: [
      "Sélection des formations les plus adaptées au niveau cible",
      "Arbitrage inter vs intra vs blended vs e-learning",
      "Planification réaliste compatible avec les contraintes terrain"
    ]
  },
  {
    num: "03",
    accent: false,
    title: "Exécuter",
    description: "Délivrer un parcours lisible, engageant et compatible avec les contraintes du terrain — des formateurs praticiens sur chaque session.",
    points: [
      "Animation par des experts actifs dans leur domaine",
      "Cas pratiques, mises en situation et ateliers métier",
      "Ressources pédagogiques post-session pour continuer à progresser"
    ]
  },
  {
    num: "04",
    accent: true,
    title: "Mesurer",
    description: "Suivre l'adoption, la satisfaction et la mise en pratique dans la durée — pas seulement la présence en salle.",
    points: [
      "Évaluation à chaud systématique (satisfaction, compréhension)",
      "Bilan à froid à J+30 sur la mise en pratique réelle",
      "Rapport de suivi et recommandations de formations complémentaires"
    ]
  }
];

export default function MethodologyPage() {
  return (
    <main className="section page-main-compact">
      <div className="page-shell">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="methodo-hero">
          <span className="eyebrow eyebrow-dark">Méthodologie</span>
          <h1 className="section-title" style={{ marginTop: 14, maxWidth: "none", fontSize: "clamp(1.8rem, 2.8vw, 2.8rem)" }}>
            Une méthodologie pensée pour la valeur business avant le volume de contenu.
          </h1>
          <p className="section-copy" style={{ marginBottom: 24 }}>
            Beyond Expertise structure ses dispositifs autour du cadrage des besoins, de la priorisation des cas d'usage,
            de la qualité pédagogique et de l'activation terrain après formation.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/devis" className="button button-primary">
              Démarrer un projet <ArrowRight size={17} />
            </Link>
            <Link href="/formations" className="button button-secondary">
              Voir le catalogue
            </Link>
          </div>
        </div>

        {/* ── Steps ─────────────────────────────────────────── */}
        <div className="methodo-steps">
          {steps.map((step) => (
            <article key={step.num} className="methodo-step">
              <div className={`methodo-step-num${step.accent ? " methodo-step-num-accent" : ""}`}>
                {step.num}
              </div>
              <div>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
                <div className="methodo-step-points">
                  {step.points.map((point) => (
                    <div key={point} className="methodo-step-point">{point}</div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Principes ─────────────────────────────────────── */}
        <section className="section section-tight">
          <div className="catalog-highlight">
            <div>
              <span className="eyebrow eyebrow-dark">Nos principes pédagogiques</span>
              <h2 style={{ marginTop: 16 }}>
                Des convictions claires sur ce qui fait qu'une formation crée de la valeur.
              </h2>
              <p className="section-copy">
                Nous pensons que la formation professionnelle ne doit pas viser la présence en salle, mais le changement de comportement et la mise en pratique réelle en situation de travail.
              </p>
            </div>
            <div className="catalog-highlight-list">
              {[
                { title: "Applicabilité immédiate", desc: "Chaque contenu doit pouvoir être mis en pratique dès le lendemain en contexte professionnel." },
                { title: "Formateurs praticiens", desc: "Nos intervenants exercent leur métier en parallèle de l'animation — pas de théoriciens déconnectés." },
                { title: "Évaluation continue", desc: "Mesure systématique de la satisfaction, de la compréhension et de la mise en pratique post-formation." }
              ].map((item) => (
                <div key={item.title} className="catalog-highlight-item">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="section section-tight" style={{ paddingBottom: 0, textAlign: "center" }}>
          <span className="eyebrow eyebrow-dark">Mettons-la en pratique</span>
          <h2 className="section-title" style={{ margin: "16px auto 12px", maxWidth: "none" }}>
            Prêt à construire un parcours selon cette logique ?
          </h2>
          <p className="section-copy" style={{ margin: "0 auto 24px", textAlign: "center" }}>
            Décrivez votre contexte et vos objectifs — nous vous proposons le bon dispositif, le bon niveau et le bon format.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/devis" className="button button-primary">
              Demander un devis <ArrowRight size={17} />
            </Link>
            <Link href="/contact" className="button button-secondary">
              Nous contacter
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
