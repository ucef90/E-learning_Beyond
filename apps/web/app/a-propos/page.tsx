import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Lightbulb,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "À propos | Beyond Expertise",
  description:
    "Découvrez Beyond Expertise — organisme de formation premium spécialisé data, IA, pilotage et transformation. Démarche de certification Qualiopi en cours.",
};

const values = [
  {
    icon: <Target size={22} />,
    title: "Excellence opérationnelle",
    description:
      "Chaque parcours est pensé pour délivrer une valeur immédiatement applicable en entreprise, pas seulement théorique.",
  },
  {
    icon: <Users size={22} />,
    title: "Formateurs praticiens",
    description:
      "Nos intervenants sont des experts actifs dans leur domaine, capables de relier contenus, cas concrets et contraintes terrain.",
  },
  {
    icon: <Lightbulb size={22} />,
    title: "Pédagogie active",
    description:
      "Ateliers, mises en situation, cas d'usage réels et suivi post-formation pour garantir l'ancrage des compétences.",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Catalogue structuré",
    description:
      "Un socle de formations lisible, organisé par domaines et niveaux pour faciliter la découverte et la décision rapide.",
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Évaluations pédagogiques",
    description:
      "Des objectifs et des évaluations précisés pour chaque parcours. Les éventuelles préparations à des certifications font l’objet d’une vérification distincte.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Démarche qualité",
    description:
      "Démarche de certification Qualiopi en cours. Certification non acquise ; aucune éligibilité CPF n’est annoncée sans vérification.",
  },
];

export default function AboutPage() {
  return (
    <main className="section page-main-compact">
      <div className="page-shell">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="about-hero">
          <div>
            <span className="eyebrow">À propos</span>
            <h1 className="about-hero-title">
              Une marque de formation construite pour allier expertise,
              exécution et impact.
            </h1>
            <p className="about-hero-copy">
              Beyond Expertise accompagne les organisations qui veulent
              professionnaliser leurs parcours de formation, accélérer les
              compétences critiques et faire converger contenu, conversion et
              expérience apprenant dans une même plateforme.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              <Link href="/formations" className="button button-primary">
                Voir le catalogue <ArrowRight size={17} />
              </Link>
              <Link
                href="/contact"
                className="button button-secondary-inverted"
              >
                Nous contacter
              </Link>
            </div>
          </div>

          <div className="about-hero-side">
            <p>Formation et conseil au service de vos usages professionnels.</p>
          </div>
        </section>

        {/* ── Mission ───────────────────────────────────────── */}
        <section className="section section-tight">
          <div className="catalog-highlight">
            <div>
              <span className="eyebrow eyebrow-dark">Notre mission</span>
              <h2 style={{ marginTop: 16 }}>
                Rendre la formation professionnelle plus accessible, plus
                lisible et plus orientée résultats.
              </h2>
              <p className="section-copy">
                Dans un marché où les besoins en compétences évoluent rapidement
                — data, IA générative, pilotage agile, transformation digitale —
                Beyond Expertise a été conçu pour aider les individus et les
                organisations à choisir vite, bien et à monter en compétence de
                façon durable.
              </p>
              <p className="section-copy" style={{ marginBottom: 0 }}>
                Notre approche repose sur trois piliers : des formateurs
                praticiens, un catalogue structuré par niveau et usage métier,
                et une plateforme pensée pour la logique entreprise (devis,
                inscriptions, espace client, LMS).
              </p>
            </div>
            <div className="catalog-highlight-list">
              {[
                {
                  title: "Formation inter",
                  desc: "Sessions ouvertes à tous les professionnels, avec des groupes diversifiés pour enrichir les échanges.",
                },
                {
                  title: "Formation intra",
                  desc: "Dispositifs dédiés à une équipe ou une entreprise, contextualisés sur vos cas d'usage réels.",
                },
                {
                  title: "Blended learning",
                  desc: "Combinaison de sessions live, ressources en ligne, coaching et suivi post-formation pour un ancrage maximal.",
                },
              ].map((item) => (
                <div key={item.title} className="catalog-highlight-item">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Valeurs ───────────────────────────────────────── */}
        <section className="section section-tight">
          <span className="eyebrow eyebrow-dark">Nos valeurs</span>
          <h2
            className="section-title"
            style={{ marginTop: 14, marginBottom: 28 }}
          >
            Ce qui nous différencie sur le marché de la formation.
          </h2>
          <div className="about-values-grid">
            {values.map((v) => (
              <article key={v.title} className="about-value-card">
                <div className="about-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Domaines ──────────────────────────────────────── */}
        <section className="section section-tight">
          <div className="home-interest-band">
            <div className="home-interest-copy">
              <span
                className="eyebrow"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
              >
                Domaines d'expertise
              </span>
              <h2
                className="section-title"
                style={{ color: "white", maxWidth: "20ch" }}
              >
                Data, IA, pilotage, agile et transformation : nos domaines
                prioritaires.
              </h2>
              <p
                className="section-copy"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                Le catalogue Beyond Expertise est construit autour des
                compétences les plus recherchées par les entreprises qui
                accélèrent leur transformation digitale et leur maturité data.
              </p>
              <div className="home-interest-actions">
                <Link href="/formations" className="button button-primary">
                  Explorer le catalogue <ArrowRight size={17} />
                </Link>
                <Link
                  href="/expertises"
                  className="button button-secondary-inverted"
                >
                  Voir les expertises
                </Link>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Data & Business Intelligence",
                "IA Générative & Copilot",
                "PMO & Gestion de projet",
                "Agile & Scrum",
                "Business Analysis",
                "Cloud & Architecture",
              ].map((domain) => (
                <div
                  key={domain}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                  }}
                >
                  {domain}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section
          className="section section-tight"
          style={{ textAlign: "center" }}
        >
          <span className="eyebrow eyebrow-dark">Prêt à démarrer ?</span>
          <h2
            className="section-title"
            style={{ margin: "16px auto 12px", maxWidth: "none" }}
          >
            Construisons votre projet formation ensemble.
          </h2>
          <p
            className="section-copy"
            style={{ margin: "0 auto 24px", textAlign: "center" }}
          >
            Catalogue, devis, académie d'entreprise ou espace apprenant — notre
            équipe est disponible pour qualifier rapidement votre besoin.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
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
