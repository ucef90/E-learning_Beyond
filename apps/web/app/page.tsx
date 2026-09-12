import Link from "next/link";
import { RegulatoryHighlight } from "@/components/regulatory-highlight";
import { HeroMedia } from "@/components/hero-media";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Search,
  ShieldCheck,
  Star,
  ThumbsUp,
  Zap,
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

const advantageTabs = [
  {
    label: "Formateurs",
    title: "Des formateurs experts et praticiens",
    description:
      "Nos parcours sont portés par des intervenants capables de relier théorie, cas concrets et contraintes d'exécution en entreprise.",
    bullets: [
      "Double expertise métier et pédagogique",
      "Animation inter, intra et dispositifs sur-mesure",
      "Approche orientée applicabilité immédiate",
    ],
  },
  {
    label: "Évaluations",
    title: "Des parcours structurés avec niveaux, prérequis et validation",
    description:
      "Le catalogue est pensé pour aider chaque profil à choisir le bon niveau, la bonne modalité et un dispositif cohérent pour monter en compétence.",
    bullets: [
      "Fiches formation détaillées et lisibles",
      "Positionnement par niveau et objectifs",
      "Évaluation des acquis selon le parcours",
    ],
  },
  {
    label: "Entreprise",
    title: "Préparer un parcours pour votre entreprise",
    description:
      "Décrivez les besoins de vos équipes pour préparer avec le centre une proposition, un calendrier et les modalités de suivi.",
    bullets: [
      "Tunnel commercial clair et rapide",
      "Suivi des demandes et validations",
      "Échanges avec le centre avant inscription",
    ],
  },
];

const expertiseLabels = [
  "Data",
  "Business Intelligence",
  "IA",
  "Python",
  "SQL",
  "Gestion de projet",
  "Agile",
  "Product",
];

export default async function HomePage() {
  const trainings = await getTrainings();
  const featuredTrainings = getHomepageFeaturedTrainings(trainings);
  const premiumGroups = groupTrainingsByPremiumCategory(trainings).slice(0, 4);

  const formatCount = new Set(trainings.map((training) => training.format))
    .size;
  const categoryCount = new Set(trainings.map((training) => training.category))
    .size;
  const upcomingCount = trainings.filter(
    (training) => training.nextSession !== "Planification à venir",
  ).length;

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
          </div>
          <div>
            <article className="reference-feature">
              <span className="reference-badge">À découvrir</span>
              <h2>Python pour Data Analyst</h2>
              <div className="reference-meta">
                <span>3 jours</span>
                <span>Intermédiaire</span>
                <span>Hybride</span>
              </div>
              <div className="reference-feature-bottom">
                <span>Programme et module pilote</span>
                <Link
                  className="button"
                  href="/formations/python-pour-data-analyst"
                >
                  Découvrir
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
            <div className="reference-options">
              <Link href="/formations">
                <strong>{trainings.length}</strong>formations au catalogue
              </Link>
              <Link href="/connexion">
                <strong>Mon espace</strong>Accéder à mes cours
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <RegulatoryHighlight />

      <section className="section-tight">
        <div className="page-shell">
          <p>
            Démarche de certification Qualiopi en cours. La certification n’est
            pas encore acquise. Les modalités de financement sont étudiées selon
            chaque situation.
          </p>
        </div>
      </section>

      {/* ── Featured Trainings ───────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">Formations les plus demandées</span>
              <h2 className="section-title section-title-wide">
                Une sélection immédiate pour les sujets les plus porteurs du
                catalogue.
              </h2>
            </div>
            <div className="section-cta-inline">
              <p className="section-copy section-copy-narrow">
                SQL, Power BI, PMO, Scrum, Copilot, AI Agents et data : les
                parcours les plus visibles pour les demandes inter et
                entreprise.
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
                  Des catégories premium pour accélérer l'orientation des
                  directions, PMO, analysts et équipes data.
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
                Une base de catalogue sérieuse pour cadrer vite un projet de
                formation.
              </h2>
              <p className="section-copy">
                Beyond Expertise combine catalogue, tunnel commercial, espace
                client et projection LMS dans une architecture claire, avec de
                vraies fiches formation, des parcours prioritaires et une
                logique de portail entreprise.
              </p>
              <Link href="/a-propos" className="button button-secondary">
                En savoir plus sur Beyond Expertise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Client Logos ─────────────────────────────────── */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="page-shell">
          <div className="home-logos-band">
            <div className="home-logos-head">
              <p className="home-logos-title">
                Des compétences pour vos projets
              </p>
              <Link
                href="/expertises"
                className="button button-secondary"
                style={{ fontSize: "0.82rem", padding: "8px 14px" }}
              >
                Découvrir les expertises
              </Link>
            </div>
            <div className="home-logos-grid">
              {expertiseLabels.map((logo) => (
                <div key={logo} className="home-logo-item">
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Advantages ───────────────────────────────────── */}
      <section className="section section-tight-top">
        <div className="page-shell">
          <div className="home-advantages-panel">
            <div className="home-advantages-head">
              <div>
                <span className="eyebrow eyebrow-dark">Nos atouts</span>
                <h2 className="section-title">
                  Les fondamentaux d'un organisme de formation premium, lisible
                  et moderne.
                </h2>
                <p className="section-copy">
                  Le site n'expose pas seulement un catalogue : il structure une
                  offre pédagogique, commerciale et LMS capable de monter en
                  maturité.
                </p>
              </div>
              <div className="home-advantage-tabs" aria-hidden="true">
                {advantageTabs.map((tab, index) => (
                  <span
                    key={tab.label}
                    className={`home-advantage-tab${index === 0 ? " is-active" : ""}`}
                  >
                    {tab.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="home-advantages-grid">
              {advantageTabs.map((tab) => (
                <article key={tab.label} className="home-advantage-card">
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
                Des catégories premium pour orienter rapidement chaque équipe
                vers le bon parcours.
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
                Un même socle pour le catalogue, le devis, l'inscription,
                l'espace client et les espaces LMS.
              </h2>
              <p
                className="section-copy"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                Beyond Expertise peut servir de base pour un site organisme de
                formation moderne, un portail client de suivi et une future
                plateforme e-learning plus riche, sans casser le parcours
                commercial.
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

            <div className="home-interest-mosaic">
              <div className="home-interest-mosaic-card home-interest-mosaic-media" />
              <div className="home-interest-mosaic-card home-interest-mosaic-stat">
                <strong>{upcomingCount}+</strong>
                <span>prochaines sessions visibles</span>
              </div>
              <div className="home-interest-mosaic-card home-interest-mosaic-media-alt" />
              <div className="home-interest-mosaic-card home-interest-mosaic-gradient" />
            </div>
          </div>
        </div>
      </section>

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
              <div className="home-resource-feature-media" />
              <div className="home-resource-feature-body">
                <span className="premium-category-accent">À la une</span>
                <h3>
                  Comment structurer une offre formation premium autour de la
                  data, de l'IA et du pilotage ?
                </h3>
                <p>
                  Une ligne éditoriale orientée usage, ROI, gouvernance et
                  transformation permet d'installer Beyond Expertise comme
                  acteur crédible sur les sujets les plus demandés du marché.
                </p>
              </div>
            </article>

            <div className="home-resource-list">
              {resourceHighlights.map((item) => (
                <article key={item.slug} className="home-resource-card">
                  <div className="home-resource-thumb" />
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
                Tout ce qu'il faut clarifier avant d'activer une demande, un
                devis ou un parcours entreprise.
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
