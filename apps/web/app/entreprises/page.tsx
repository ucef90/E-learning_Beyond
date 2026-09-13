import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  Building2,
  CheckCircle2,
  Layers3,
  RefreshCw,
  Rocket,
  Users2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions Entreprises | Beyond Expertise",
  description:
    "Parcours intra, académies métier et dispositifs de formation adaptés aux besoins. Beyond Expertise accompagne les entreprises dans la montée en compétence de leurs équipes.",
};

const useCases = [
  {
    icon: <Building2 size={22} />,
    title: "Parcours intra",
    description:
      "Sessions dédiées à une équipe, contextualisées sur vos cas d'usage métier, vos outils et vos objectifs de transformation.",
  },
  {
    icon: <Layers3 size={22} />,
    title: "Académies métier",
    description:
      "Programmes structurés en cohortes pour créer des montées en compétence durables sur la data, l'IA ou la gestion de projet.",
  },
  {
    icon: <RefreshCw size={22} />,
    title: "Blended learning",
    description:
      "Combinaison de sessions live, ressources e-learning, coaching et évaluation pour un ancrage maximal en situation de travail.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Plan de développement",
    description:
      "Cartographie des compétences, priorisation des besoins et construction d'un plan de formation pluriannuel cohérent.",
  },
  {
    icon: <BookMarked size={22} />,
    title: "Objectifs de validation",
    description:
      "Les besoins de préparation à une certification sont étudiés séparément, après vérification des programmes, partenaires et modalités applicables.",
  },
  {
    icon: <Rocket size={22} />,
    title: "Lancement rapide",
    description:
      "Le calendrier est défini avec vous après étude du besoin et des disponibilités.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Cadrage du besoin",
    description:
      "Échange de 30 min pour qualifier le contexte, les publics, le niveau cible et les contraintes d'organisation.",
  },
  {
    num: "02",
    title: "Proposition sur-mesure",
    description:
      "Sélection des formations adaptées, choix du format, devis détaillé et planning de déploiement à convenir après analyse du besoin.",
  },
  {
    num: "03",
    title: "Déploiement",
    description:
      "Animation par des formateurs praticiens, ressources pédagogiques dédiées, suivi de présence et engagement.",
  },
  {
    num: "04",
    title: "Mesure & suivi",
    description:
      "Évaluation des acquis, recueil des appréciations et bilan pédagogique à organiser selon le parcours convenu.",
  },
];

const fundingOptions = [
  {
    title: "OPCO — Financement employeur",
    description:
      "Les possibilités de financement doivent être vérifiées selon l’organisme, la prestation et votre situation. Aucune prise en charge n’est garantie.",
  },
  {
    title: "CPF — Compte Personnel de Formation",
    description:
      "Aucune éligibilité CPF n’est annoncée pour le pilote. Une éventuelle offre éligible nécessitera les vérifications et habilitations correspondantes.",
  },
  {
    title: "Plan de développement",
    description:
      "Budget formation interne (plan de développement des compétences). Facturation directe à l'entreprise avec convention.",
  },
];

export default function CompaniesPage() {
  return (
    <main className="section page-main-compact">
      <div className="page-shell">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="entreprises-hero">
          <div>
            <span className="eyebrow">Entreprises</span>
            <h1 className="entreprises-hero-title">
              Des dispositifs formation adaptés aux enjeux des organisations
              ambitieuses.
            </h1>
            <p className="entreprises-hero-copy">
              Beyond Expertise construit des parcours intra et des offres
              sur-mesure pour les entreprises qui veulent faire monter
              rapidement leurs équipes sur la data, l'IA, le pilotage et la
              transformation.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/devis" className="button button-primary">
                Demander une proposition <ArrowRight size={17} />
              </Link>
              <Link
                href="/contact"
                className="button button-secondary-inverted"
              >
                Parler à un expert
              </Link>
            </div>
          </div>

          <div className="entreprises-hero-side">
            <div className="entreprises-hero-panel">
              <h3>Ce que nous couvrons</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  "Data & Business Intelligence",
                  "IA Générative & Copilot",
                  "PMO & Gestion de projet",
                  "Agile, Scrum & SAFe",
                  "Business Analysis",
                  "Cloud & Architecture data",
                ].map((domain) => (
                  <div
                    key={domain}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CheckCircle2
                      size={15}
                      style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.88)",
                        fontSize: "0.86rem",
                      }}
                    >
                      {domain}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="entreprises-hero-panel">
              <h3>Financement</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["OPCO", "CPF", "Plan de dev.", "Atlas", "AKTO"].map((f) => (
                  <span
                    key={f}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Cas d'usage ───────────────────────────────────── */}
        <section className="section section-tight">
          <span className="eyebrow eyebrow-dark">Nos dispositifs</span>
          <h2
            className="section-title"
            style={{ marginTop: 14, marginBottom: 28 }}
          >
            Des formats adaptés à chaque contexte d'entreprise.
          </h2>
          <div className="entreprises-use-cases">
            {useCases.map((item) => (
              <article key={item.title} className="entreprises-use-case">
                <div className="entreprises-use-case-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Process ───────────────────────────────────────── */}
        <section className="section section-tight">
          <div
            style={{
              padding: "32px",
              borderRadius: 28,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(231,234,241,0.78))",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow)",
            }}
          >
            <span className="eyebrow eyebrow-dark">Notre approche</span>
            <h2
              className="section-title"
              style={{ marginTop: 14, marginBottom: 32 }}
            >
              De la demande à la formation en 4 étapes claires.
            </h2>
            <div className="entreprises-process">
              {processSteps.map((step) => (
                <div key={step.num} className="entreprises-process-step">
                  <div className="entreprises-process-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Financement ───────────────────────────────────── */}
        <section className="section section-tight">
          <div className="entreprises-funding">
            <span className="eyebrow eyebrow-dark">Financement</span>
            <h2 className="section-title" style={{ marginTop: 14 }}>
              Plusieurs leviers pour financer vos formations.
            </h2>
            <p className="section-copy" style={{ marginBottom: 0 }}>
              Nos formations sont éligibles aux principaux dispositifs de
              financement. Nous vous accompagnons dans les démarches.
            </p>
            <div className="entreprises-funding-grid">
              {fundingOptions.map((item) => (
                <div key={item.title} className="entreprises-funding-item">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="section section-tight">
          <div className="home-interest-band">
            <div className="home-interest-copy">
              <span
                className="eyebrow"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
              >
                Démarrer un projet
              </span>
              <h2
                className="section-title"
                style={{ color: "white", maxWidth: "22ch" }}
              >
                Prêt à construire un parcours formation pour vos équipes ?
              </h2>
              <p
                className="section-copy"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                Partagez votre besoin — nous revenons vers vous avec une
                recommandation claire, un devis détaillé et un planning de
                déploiement à confirmer après étude de votre besoin.
              </p>
              <div className="home-interest-actions">
                <Link href="/devis" className="button button-primary">
                  Demander un devis <ArrowRight size={17} />
                </Link>
                <Link
                  href="/contact"
                  className="button button-secondary-inverted"
                >
                  Parler à un conseiller
                </Link>
              </div>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                {
                  icon: <Users2 size={18} />,
                  title: "Un parcours adapté à votre équipe",
                  desc: "Effectif et moyens pédagogiques à valider pour chaque projet.",
                },
                {
                  icon: <Rocket size={18} />,
                  title: "Démarrage rapide possible",
                  desc: "Délai de réponse et date de démarrage à confirmer avec le centre.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "18px 20px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 12,
                    alignItems: "start",
                  }}
                >
                  <div style={{ color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                    {item.icon}
                  </div>
                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "white",
                        fontSize: "0.92rem",
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </strong>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.76)",
                        fontSize: "0.82rem",
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="section"><div className="page-shell executive-assurance"><h2>Développer vos activités en Afrique</h2><p>Découvrez nos parcours MBA, les cohortes dédiées et nos offres de conseil, de transformation et d’expertise à temps partagé.</p><Link href="/entreprises/afrique" className="button button-primary">Formation et accompagnement en Afrique</Link></div></section>
    </main>
  );
}
