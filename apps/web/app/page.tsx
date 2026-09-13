import Link from "next/link";
import { ExecutiveHighlight } from "@/components/executive-home";
export const dynamic = "force-dynamic";
import { RegulatoryHighlight } from "@/components/regulatory-highlight";
import { TrustStrip, RatingStars } from "@/components/trust-elements";
import { ClientReferences } from "@/components/client-references";
import { trainingPresentation } from "@/lib/training-presentation";
import { HeroMedia } from "@/components/hero-media";
import {
  ArrowRight,
  Bot,
  Database,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { FAQ } from "@/components/faq";
import { TrainingCard } from "@/components/training-card";
import { faqItems } from "@/lib/data";
import {
  getHomepageFeaturedTrainings,
  getTrainings,
  groupTrainingsByPremiumCategory,
} from "@/lib/api";

const resourceHighlights = [
  {
    slug: "copilot",
    title:
      "Copilot en entreprise : cadrer les cas d'usage qui apportent vite de la valeur",
    excerpt:
      "Une lecture orientée directions, PMO et fonctions support pour identifier les gains réalistes et les garde-fous utiles.",
  },
  {
    slug: "ai-security",
    title:
      "IA et gouvernance : comment accélérer sans ouvrir de nouveaux risques",
    excerpt:
      "Une synthèse pour aligner innovation, conformité, sécurité et usages métier dans un même cadre de décision.",
  },
  {
    slug: "lakehouse",
    title:
      "Lakehouse, BI, IA : quels choix d'architecture pour une plateforme data moderne",
    excerpt:
      "Une ressource pour clarifier les arbitrages entre reporting, data engineering, IA et industrialisation des pipelines.",
  },
];

const advantages = [
  {
    label: "Formateurs",
    title: "Des experts qui pratiquent et transmettent",
    description:
      "Apprenez avec des professionnels qui relient les concepts aux situations rencontrées en entreprise.",
    bullets: [
      "Double expertise métier et pédagogique",
      "Animation inter, intra et dispositifs sur-mesure",
      "Approche orientée applicabilité immédiate",
    ],
  },
  {
    label: "Évaluations",
    title: "Un parcours clair, des acquis évalués",
    description:
      "Choisissez le bon niveau, pratiquez avec des objectifs précis et mesurez vos acquis au fil du parcours.",
    bullets: [
      "Fiches formation détaillées et lisibles",
      "Positionnement par niveau et objectifs",
      "Évaluation des acquis selon le parcours",
    ],
  },
  {
    label: "Entreprise",
    title: "Des formations adaptées à vos équipes",
    description:
      "Construisez avec le centre un programme et un calendrier qui répondent aux besoins de vos collaborateurs.",
    bullets: [
      "Un programme adapté à vos enjeux",
      "Des modalités et un calendrier partagés",
      "Échanges avec le centre avant inscription",
    ],
  },
];

export default async function HomePage() {
  const trainings = await getTrainings();
  const featuredTrainings = getHomepageFeaturedTrainings(trainings);
  const premiumGroups = groupTrainingsByPremiumCategory(trainings).slice(0, 4);

  const formatCount = new Set(trainings.map((training) => training.format))
    .size;
  const categoryCount = new Set(trainings.map((training) => training.category))
    .size;
  const heroTraining = featuredTrainings[0];
  const heroInfo = heroTraining ? trainingPresentation(heroTraining) : null;

  return (
    <main className="home-page-main" id="contenu">
      <section className="reference-hero">
        <HeroMedia />
        <div className="page-shell reference-hero-grid">
          <div>
            <span className="reference-badge">
              <ShieldCheck size={14} />
              Beyond Expertise · Formation professionnelle
            </span>
            <h1>
              La formation qui fait <span>progresser</span> vos équipes et vos
              priorités métier.
            </h1>
            <p>
              Data, BI, IA, gestion de projet, agile et business analysis :
              trouvez la formation adaptée à votre métier, en inter, intra ou
              parcours entreprise.
            </p>
            <form action="/formations" className="reference-search">
              <Search size={21} />
              <input
                name="q"
                aria-label="Rechercher une formation"
                placeholder="Rechercher : Power BI, IA, Scrum, SQL, PMO…"
              />
              <button type="submit">
                Rechercher
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="reference-chips">
              {[
                "Power BI",
                "Intelligence Artificielle",
                "Scrum",
                "SQL",
                "Copilot",
                "PMO",
              ].map((q) => (
                <Link key={q} href={`/formations?q=${encodeURIComponent(q)}`}>
                  {q}
                </Link>
              ))}
            </div>
            <div className="hero-reassurance">
              <Link href="/qualite#resultats">
                <RatingStars />
                <strong>4,8/5</strong> satisfaction
              </Link>
              <Link href="/financements">
                CPF & OPCO <ArrowRight size={13} />
              </Link>
            </div>
            <p className="hero-rating-source">
              Évaluations internes du centre · Financement selon éligibilité
            </p>
          </div>
          <div className="reference-hero-right">
            {heroTraining && heroInfo && (
              <article className="reference-feature">
                <div className="reference-feature-heading">
                  <span className="reference-badge">
                    {heroTraining.category}
                  </span>
                  <Link
                    href="/qualite#resultats"
                    className="reference-module-rating"
                    aria-label="Note de satisfaction du centre : 4,8 sur 5, évaluations internes"
                  >
                    <Star size={16} fill="currentColor" /> 4,8/5{" "}
                    <small>Centre</small>
                  </Link>
                </div>
                <h2>{heroTraining.title}</h2>
                <div className="reference-meta">
                  <span>{heroTraining.duration}</span>
                  <span>{heroTraining.level}</span>
                  <span>{heroTraining.format}</span>
                </div>
                <div className="reference-feature-bottom">
                  <div className="hero-price">
                    <span>{heroInfo.hasPrice ? "À partir de" : "Tarif"}</span>
                    <strong>{heroInfo.price}</strong>
                  </div>
                  <Link
                    className="button"
                    href={`/formations/${heroTraining.slug}`}
                  >
                    Voir la formation <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            )}
            <div className="reference-options">
              <Link href="/formations">
                <strong>{trainings.length}</strong>formations au catalogue
              </Link>
              <Link href="/connexion">
                <strong>Mon espace</strong>Accéder à mes cours{" "}
                <ArrowRight size={17} />
              </Link>
            </div>
            <Link href="/formations" className="reference-catalogue-cta">
              Explorer tout le catalogue <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <TrustStrip />
      <ExecutiveHighlight />

      {/* ── Featured Trainings ───────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">Notre sélection de formations</span>
              <h2 className="section-title section-title-wide">
                Des compétences à développer. Des projets à concrétiser.
              </h2>
            </div>
            <div className="section-cta-inline">
              <p className="section-copy section-copy-narrow">
                IA, data et pilotage : découvrez les programmes, les niveaux et
                les prochaines sessions proposées.
              </p>
              <Link href="/formations" className="button button-secondary">
                Découvrir tout le catalogue
              </Link>
            </div>
          </div>

          <div className="cards-grid">
            {featuredTrainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Panel ──────────────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="home-stats-panel">
            <div className="home-stats-grid">
              <article className="home-stat-card">
                <strong>{trainings.length}</strong>
                <h3>formations au catalogue</h3>
                <p>
                  Un socle structuré autour des usages data, IA, pilotage, agile
                  et business analysis.
                </p>
              </article>
              <article className="home-stat-card">
                <strong>{premiumGroups.length}</strong>
                <h3>univers métier prioritaires</h3>
                <p>
                  Des parcours pour les équipes métier, les analysts, les
                  managers et les spécialistes de la data.
                </p>
              </article>
              <article className="home-stat-card">
                <strong>{formatCount}</strong>
                <h3>modalités de suivi</h3>
                <p>
                  Présentiel, distanciel, hybride et e-learning selon le
                  contexte de déploiement.
                </p>
              </article>
              <article className="home-stat-card">
                <strong>{categoryCount}</strong>
                <h3>domaines et sous-domaines</h3>
                <p>
                  Un catalogue pensé pour couvrir la montée en compétence de
                  plusieurs fonctions et niveaux.
                </p>
              </article>
            </div>

            <div className="home-stats-copy">
              <span className="eyebrow eyebrow-dark">Chiffres clés</span>
              <h2 className="section-title">
                Les bonnes compétences, au bon moment.
              </h2>
              <p className="section-copy">
                Des premiers pas à la pratique avancée, construisez un parcours
                adapté à vos équipes. Des objectifs clairs, des exercices
                concrets et des formateurs qui connaissent votre réalité métier.
              </p>
              <Link href="/a-propos" className="button button-secondary">
                En savoir plus sur Beyond Expertise
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ClientReferences />

      {/* ── Advantages ───────────────────────────────────── */}
      <section className="section section-tight-top compact-advantages-section">
        <div className="page-shell">
          <div className="home-advantages-panel">
            <div className="home-advantages-head">
              <div>
                <span className="eyebrow eyebrow-dark">Nos atouts</span>
                <h2 className="section-title">
                  L’expertise du terrain.
                  <br />
                  Le goût de transmettre.
                </h2>
              </div>
              <p className="section-copy">
                Nos formateurs relient chaque notion à un usage professionnel.
                Vous apprenez, vous pratiquez et vous repartez avec des méthodes
                à appliquer.
              </p>
            </div>
            <div className="home-advantages-grid">
              {advantages.map((tab, index) => (
                <article
                  id={`atout-${index}`}
                  key={tab.label}
                  className="home-advantage-card"
                >
                  <span className="premium-category-accent">{tab.label}</span>
                  <h3>{tab.title}</h3>
                  <p>{tab.description}</p>
                  <ul className="home-advantage-list">
                    {tab.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium Categories ───────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">Univers métier</span>
              <h2 className="section-title section-title-wide">
                Quel est votre prochain défi professionnel ?
              </h2>
            </div>
            <p className="section-copy section-copy-narrow">
              Chaque univers regroupe les formations les plus utiles pour un
              métier, un niveau et un objectif de transformation.
            </p>
          </div>

          <div
            className="feature-grid feature-grid-tight"
            style={{ marginTop: 24 }}
          >
            {premiumGroups.map((group) => (
              <article
                key={group.key}
                className="card premium-category-card"
                style={{ gridColumn: "span 3", padding: 22 }}
              >
                <span className="premium-category-accent">{group.accent}</span>
                <h3 style={{ marginBottom: 10 }}>{group.title}</h3>
                <p className="section-copy" style={{ margin: 0 }}>
                  {group.description}
                </p>
                <p className="premium-category-audience">{group.audience}</p>
                <p className="premium-category-count">
                  {group.trainings.length} formations associées
                </p>
                <Link
                  className="home-resource-link"
                  href={`/formations?univers=${group.key}`}
                >
                  Explorer cet univers <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ─────────────────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="home-interest-band">
            <div className="home-interest-copy">
              <span
                className="eyebrow"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
              >
                Projet entreprise
              </span>
              <h2
                className="section-title"
                style={{ color: "white", maxWidth: "20ch" }}
              >
                Faites grandir les compétences de toute votre équipe.
              </h2>
              <p
                className="section-copy"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                Un projet data, une nouvelle organisation, des usages IA à
                encadrer ? Construisons ensemble un parcours qui répond à vos
                enjeux, à votre niveau et à vos contraintes de calendrier.
              </p>
              <div className="home-interest-actions">
                <Link href="/devis" className="button button-primary">
                  Construire un parcours entreprise
                </Link>
                <Link
                  href="/contact"
                  className="button button-secondary-inverted"
                >
                  Contacter notre équipe
                </Link>
              </div>
            </div>

            <div className="enterprise-path">
              <span className="reference-badge">
                Un accompagnement à chaque étape
              </span>
              <ol>
                <li>
                  <strong>01</strong>
                  <div>
                    <h3>Comprendre votre besoin</h3>
                    <p>Objectifs, publics, niveaux et contexte métier.</p>
                  </div>
                </li>
                <li>
                  <strong>02</strong>
                  <div>
                    <h3>Construire votre parcours</h3>
                    <p>Programme, modalités, calendrier et devis.</p>
                  </div>
                </li>
                <li>
                  <strong>03</strong>
                  <div>
                    <h3>Apprendre et mettre en pratique</h3>
                    <p>Exercices, échanges et évaluation des acquis.</p>
                  </div>
                </li>
              </ol>
              <Link href="/formations">
                {trainings.length} formations pour composer votre parcours{" "}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RegulatoryHighlight />

      {/* ── Resources ────────────────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">Ressources</span>
              <h2 className="section-title">
                Des analyses pour éclairer vos décisions.
              </h2>
            </div>
            <div className="section-cta-inline">
              <p className="section-copy section-copy-narrow">
                Retrouvez nos ressources sur la data, l’intelligence
                artificielle et les usages professionnels.
              </p>
              <Link href="/ressources" className="button button-secondary">
                Voir toutes les ressources
              </Link>
            </div>
          </div>

          <div className="home-resources-grid">
            <article className="home-resource-feature">
              <div className="home-resource-feature-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/media/atelier-equipe.jpg"
                  width={1200}
                  height={800}
                  loading="lazy"
                  alt="Photo d’illustration : une équipe échange autour de documents et d’un ordinateur."
                />
              </div>
              <div className="home-resource-feature-body">
                <span className="premium-category-accent">À la une</span>
                <h3>
                  RGPD et AI Act : passer des textes aux bonnes pratiques.
                </h3>
                <p>
                  Deux parcours avec cas pratiques, exercices et modèles pour
                  protéger les données et encadrer les usages de l’intelligence
                  artificielle.
                </p>
                <Link href="/rgpd-ai-act" className="home-resource-link">
                  Découvrir les deux parcours <ArrowRight size={16} />
                </Link>
              </div>
            </article>

            <div className="home-resource-list">
              {resourceHighlights.map((item) => (
                <article key={item.slug} className="home-resource-card">
                  <div className="home-resource-thumb" aria-hidden="true">
                    {item.slug === "copilot" ? (
                      <Bot size={34} />
                    ) : item.slug === "ai-security" ? (
                      <ShieldCheck size={34} />
                    ) : (
                      <Database size={34} />
                    )}
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <Link
                      href={`/expertises/${item.slug}`}
                      className="home-resource-link"
                    >
                      Lire la page expertise <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="home-faq-band">
            <div className="home-faq-copy">
              <span className="eyebrow eyebrow-dark">Questions fréquentes</span>
              <h2 className="section-title">
                Préparez votre formation en toute clarté.
              </h2>
              <p className="section-copy">
                Une question sur le choix d’une formation ou son organisation ?
                Le centre vous accompagne.
              </p>
              <Link href="/contact" className="button button-primary">
                Contactez-nous
              </Link>
            </div>
            <div className="home-faq-list">
              <FAQ items={faqItems} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
