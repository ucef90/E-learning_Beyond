import { featuredTrainings } from "@/lib/data";

const API_URL = process.env.API_INTERNAL_URL || "http://127.0.0.1:4200/api/v1";

const PRIORITY_TRAINING_TITLES = [
  "Data Analyst : Excel, Power Query et Power BI",
  "Data visualisation pour decideurs et managers",
  "SQL pour Data Analyst",
  "Power BI pour le controle de gestion",
  "Data Quality et gouvernance des donnees",
  "Data Warehouse et modelisation dimensionnelle",
  "ETL et integration de donnees moderne",
  "Python pour Data Analyst",
  "Statistiques appliquees pour Data Analyst",
  "Data Storytelling pour comites de direction",
  "Machine Learning pour Data Scientist Junior",
  "Feature Engineering et selection de variables",
  "MLOps pour equipes Data",
  "Generative AI pour Data Analyst",
  "AI Governance pour Data Office",
  "RAG et bases vectorielles pour l'entreprise",
  "KPI et pilotage de la performance projet",
  "PMO operationnel et gouvernance de portefeuille",
  "Product Owner : pilotage par la valeur",
  "Agile pour directions metier et sponsors",
  "Scrum Master : facilitation et rituels d'equipe",
  "Kanban pour equipes produit et support",
  "Business Analyst : cadrage des besoins et exigences",
  "Business Analyst : modelisation des processus et parcours",
  "Dashboard executif pour PMO et directions de projet",
  "Roadmap produit et priorisation strategique",
  "Data Literacy pour managers",
  "Tableaux de bord RH et People Analytics",
  "Analytics marketing et modeles d'attribution",
  "Forecasting et series temporelles pour le business",
  "Microsoft 365 Copilot pour managers et directions",
  "Copilot pour PMO, chefs de projet et equipes programme",
  "Prompt Engineering avance pour equipes metier",
  "AI Agents pour automatiser les processus metier",
  "Agent Boss : piloter une equipe hybride humains et agents IA",
  "AI Security : securiser les usages de l'IA generative",
  "Donnees pretes pour l'IA : gouvernance, qualite et knowledge management",
  "Lakehouse moderne avec Microsoft Fabric et Databricks",
  "Data Engineering cloud : pipelines ELT et orchestration",
  "Product Analytics et experimentation A/B testing",
  "Deep Learning applique avec PyTorch",
  "LLMOps : deployer, observer et gouverner les applications LLM",
] as const;

const PRIORITY_TRAINING_KEYS = new Set(
  PRIORITY_TRAINING_TITLES.map(normalizeValue),
);

export type PremiumCatalogGroup = {
  key: string;
  title: string;
  description: string;
  audience: string;
  accent: string;
  trainings: UiTraining[];
};

export type SeoCategoryHub = {
  slug: string;
  shortLabel: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  businessValue: string;
  audience: string;
  promise: string;
  primaryCta: string;
  secondaryCta: string;
  keywords: string[];
  editorialBlocks: Array<{
    title: string;
    body: string;
  }>;
};

const PREMIUM_CATEGORY_CONFIG = [
  {
    key: "data-bi",
    title: "Data, BI & Pilotage",
    description:
      "Des formations orientees reporting, tableaux de bord, analyse decisionnelle et culture data pour les equipes metier et fonctions support.",
    audience:
      "Data analyst, controle de gestion, finance, RH et directions metier",
    accent: "Insight",
    matchers: [
      "power bi",
      "excel",
      "reporting",
      "tableau de bord",
      "analytics",
      "data analyst",
      "sql",
      "data literacy",
      "people analytics",
      "forecasting",
      "bi ",
      "fabric",
    ],
  },
  {
    key: "data-science-ml",
    title: "Data Science & Machine Learning",
    description:
      "Un parcours premium pour passer de la preparation des donnees aux modeles predictifs, aux pratiques MLOps et a la mise en production.",
    audience: "Data scientist, data engineer, equipe IA et pole innovation",
    accent: "Predict",
    matchers: [
      "machine learning",
      "mlops",
      "llmops",
      "deep learning",
      "pytorch",
      "feature engineering",
      "data scientist",
      "python",
      "data warehouse",
      "etl",
      "series temporelles",
      "lakehouse",
      "databricks",
      "data engineering cloud",
    ],
  },
  {
    key: "ai-genai",
    title: "IA, GenAI & Gouvernance",
    description:
      "Une offre concentree sur l'IA generative, la gouvernance, les usages responsables et les architectures modernes de type RAG.",
    audience:
      "Directions innovation, data office, equipes produits et fonctions transverses",
    accent: "Transform",
    matchers: [
      "generative ai",
      "intelligence artificielle",
      "ai governance",
      "rag",
      "vector",
      "chatgpt",
      "genai",
      "copilot",
      "prompt engineering",
      "ai agents",
      "agent boss",
      "ai security",
      "llm",
      "knowledge management",
    ],
  },
  {
    key: "project-agile-pmo",
    title: "Gestion de Projet, PMO & Agile",
    description:
      "Des formations pour structurer le pilotage, fluidifier l'execution, mieux prioriser et faire monter les organisations en maturite agile.",
    audience: "Chef de projet, PMO, scrum master, manager de programme",
    accent: "Execute",
    matchers: [
      "projet",
      "project",
      "agile",
      "scrum",
      "kanban",
      "pmo",
      "product owner",
      "roadmap",
      "performance projet",
      "equipes programme",
      "copilot pour pmo",
    ],
  },
  {
    key: "business-analysis-product",
    title: "Business Analysis & Product",
    description:
      "Un socle pour cadrer les besoins, modeliser les processus, prioriser par la valeur et mieux aligner metier, delivery et produit.",
    audience: "Business analyst, product owner, AMOA et directions metier",
    accent: "Align",
    matchers: [
      "business analyst",
      "product owner",
      "roadmap produit",
      "exigences",
      "processus",
      "valeur",
      "product analytics",
      "a b testing",
      "experimentation",
      "growth",
    ],
  },
] as const;

const SEO_CATEGORY_HUBS: SeoCategoryHub[] = [
  {
    slug: "copilot",
    shortLabel: "Copilot",
    title: "Formations Microsoft Copilot",
    seoTitle:
      "Formation Microsoft Copilot : usages entreprise, management et pilotage",
    seoDescription:
      "Des formations Microsoft Copilot orientees usages metier, management, PMO et productivite pour deployer l'IA de facon utile et securisee.",
    heroTitle:
      "Former vos equipes a Microsoft Copilot avec une logique de valeur metier.",
    heroDescription:
      "Cette page regroupe les formations Beyond Expertise pour transformer Copilot en levier concret de productivite, de synthese, de pilotage et de qualite documentaire.",
    businessValue:
      "Copilot est aujourd'hui l'un des sujets les plus demandes en entreprise car il touche directement la productivite individuelle, les routines de management et l'efficacite des fonctions support.",
    audience:
      "Managers, directions, PMO, chefs de projet, fonctions support et utilisateurs Microsoft 365.",
    promise:
      "Un parcours concret pour passer de l'effet de mode a des usages mesurables et securises.",
    primaryCta: "Demander un parcours Copilot",
    secondaryCta: "Voir toutes les formations IA",
    keywords: [
      "copilot",
      "microsoft 365 copilot",
      "prompt",
      "productivite",
      "management",
      "pmo",
      "teams",
      "excel",
      "word",
    ],
    editorialBlocks: [
      {
        title: "Pourquoi Copilot est un sujet prioritaire en 2026",
        body: "Les entreprises cherchent moins des demonstrations spectaculaires que des gains visibles sur la preparation des reunions, les syntheses, le reporting, la production documentaire et l'acceleration des flux de travail quotidiens.",
      },
      {
        title: "Comment bien deployer Copilot",
        body: "La reussite depend de trois dimensions : des cas d'usage bien choisis, des utilisateurs formes au prompting et a la verification, et un cadre clair sur la confidentialite, la qualite et les droits d'acces.",
      },
      {
        title: "Quels publics former en priorite",
        body: "Les managers, PMO, fonctions support, equipes projet et directions metier obtiennent souvent les premiers retours sur investissement parce qu'ils produisent beaucoup de syntheses, de supports et de coordination.",
      },
    ],
  },
  {
    slug: "ai-agents",
    shortLabel: "AI Agents",
    title: "Formations AI Agents",
    seoTitle:
      "Formation AI Agents : automatisation, orchestration et pilotage des agents IA",
    seoDescription:
      "Des formations sur les agents IA pour comprendre les cas d'usage, l'automatisation, la supervision humaine et le pilotage d'equipes hybrides.",
    heroTitle:
      "Construire des usages agents IA utiles, pilotables et credibles.",
    heroDescription:
      "Cette page rassemble les formations Beyond Expertise sur les AI Agents pour aider les organisations a identifier les bons cas d'usage, maitriser les risques et structurer le passage a l'echelle.",
    businessValue:
      "Les agents IA deviennent un sujet central car ils promettent d'automatiser des taches plus complexes que les assistants classiques, mais demandent une vraie maitrise du pilotage, de la supervision et de la gouvernance.",
    audience:
      "Directions innovation, transformation, operations, responsables produit, managers et leaders d'equipe.",
    promise:
      "Comprendre ou les agents sont utiles, ou ils sont risqués, et comment les deployer sans fragiliser l'organisation.",
    primaryCta: "Construire un programme AI Agents",
    secondaryCta: "Explorer le catalogue innovation",
    keywords: [
      "ai agents",
      "agents ia",
      "orchestration",
      "automatisation",
      "agent boss",
      "workflow",
      "supervision humaine",
    ],
    editorialBlocks: [
      {
        title: "Au-dela du simple assistant",
        body: "Les agents vont plus loin que la generation de texte : ils combinent instructions, outils, enchainements de taches et logique de decision. Cela ouvre des perspectives fortes mais impose une plus grande rigueur dans la conception.",
      },
      {
        title: "Les limites a connaitre",
        body: "Sans supervision, garde-fous et cadrage metier, un agent peut accelerer des erreurs, exposer des informations sensibles ou produire une automatisation trompeuse. La formation permet justement de distinguer les bons et les mauvais cas d'usage.",
      },
      {
        title: "Une transformation aussi organisationnelle que technique",
        body: "L'arrivee des agents questionne la repartition du travail, les controles, les responsabilites et le management. C'est pourquoi les directions et managers doivent etre formes autant que les equipes innovation.",
      },
    ],
  },
  {
    slug: "ai-security",
    shortLabel: "AI Security",
    title: "Formations AI Security",
    seoTitle:
      "Formation AI Security : securiser les usages de l'IA en entreprise",
    seoDescription:
      "Des formations AI Security pour encadrer l'IA generative, proteger les donnees, reduire les risques et aligner securite, conformite et innovation.",
    heroTitle:
      "Securiser les usages IA avant qu'ils ne deviennent un risque invisible.",
    heroDescription:
      "Cette page regroupe les formations Beyond Expertise sur la securite de l'IA pour aider les organisations a deployer GenAI, Copilot et applications LLM avec les bons garde-fous.",
    businessValue:
      "L'IA se diffuse plus vite que les politiques de securite. Les entreprises ont donc besoin de monter rapidement en competence sur les fuites de donnees, la gouvernance, la supervision des usages et les risques des outils tiers.",
    audience:
      "RSSI, DSI, responsables securite, conformite, data office, innovation et gouvernance.",
    promise:
      "Mettre l'IA sous controle sans freiner l'adoption utile par les metiers.",
    primaryCta: "Demander une formation AI Security",
    secondaryCta: "Parler a un conseiller",
    keywords: [
      "ai security",
      "securite ia",
      "ia generative",
      "risques",
      "confidentialite",
      "conformite",
      "gouvernance ia",
    ],
    editorialBlocks: [
      {
        title: "Un nouveau perimetre de risque",
        body: "Les usages IA exposent des problemes de fuite d'information, de dependance a des fournisseurs, de faible tracabilite, de difficultes de verification et de circulation non maitrisee des contenus sensibles.",
      },
      {
        title: "Former les bonnes populations",
        body: "La securisation de l'IA ne se traite pas uniquement dans les equipes cyber. Les managers, les fonctions support, les equipes data et les responsables produit doivent aussi comprendre les risques et les bons reflexes.",
      },
      {
        title: "Une securite compatible avec l'adoption",
        body: "L'objectif n'est pas de bloquer les usages, mais de definire des zones de confiance, des cas d'usage autorises, des donnees eligibles et des controles simples qui favorisent une adoption saine.",
      },
    ],
  },
  {
    slug: "lakehouse",
    shortLabel: "Lakehouse",
    title: "Formations Lakehouse",
    seoTitle:
      "Formation Lakehouse : architecture data moderne, Fabric et Databricks",
    seoDescription:
      "Des formations lakehouse pour comprendre les architectures data modernes, Microsoft Fabric, Databricks et l'industrialisation des pipelines analytiques.",
    heroTitle:
      "Faire les bons choix d'architecture data moderne avant d'investir lourdement.",
    heroDescription:
      "Cette page centralise les formations Beyond Expertise sur le lakehouse, les pipelines cloud et la structuration d'une data platform utile a la BI, au machine learning et a l'IA.",
    businessValue:
      "Le lakehouse s'impose dans de nombreux projets car il promet de rapprocher entrepot, data engineering, BI et IA. Mais le sujet est souvent mal compris et mal cadre, ce qui justifie des formations orientées decision et architecture.",
    audience:
      "Architectes data, data engineers, responsables plateforme data, chefs de projet data et DSI.",
    promise:
      "Clarifier les concepts, comparer les options et poser une trajectoire technique realiste.",
    primaryCta: "Monter un parcours Lakehouse",
    secondaryCta: "Voir les formations data engineering",
    keywords: [
      "lakehouse",
      "fabric",
      "databricks",
      "data platform",
      "elt",
      "pipeline",
      "architecture data",
      "analytics engineering",
    ],
    editorialBlocks: [
      {
        title: "Pourquoi le lakehouse attire autant",
        body: "Les organisations veulent une plateforme plus unifiee pour stocker, transformer, gouverner et exploiter les donnees dans des usages qui vont de la BI au machine learning.",
      },
      {
        title: "Les erreurs frequentes a eviter",
        body: "Beaucoup d'entreprises se concentrent trop vite sur les outils et pas assez sur la cible d'usage, la gouvernance, les couts d'exploitation, la qualite des pipelines et les competences disponibles.",
      },
      {
        title: "Une decision d'architecture qui engage",
        body: "Choisir Fabric, Databricks ou une trajectoire mixte n'est pas seulement un arbitrage technique. Cela touche les processus, les competences, l'operating model data et les priorites business.",
      },
    ],
  },
  {
    slug: "llmops",
    shortLabel: "LLMOps",
    title: "Formations LLMOps",
    seoTitle:
      "Formation LLMOps : industrialiser, monitorer et gouverner les applications LLM",
    seoDescription:
      "Des formations LLMOps pour passer des prototypes IA generative a des applications robustes, observables, governables et economiquement viables.",
    heroTitle:
      "Passer du prototype LLM a une application exploitable en entreprise.",
    heroDescription:
      "Cette page regroupe les formations Beyond Expertise pour aider les equipes data, IA et architecture a industrialiser les applications LLM avec observabilite, qualite, couts et gouvernance.",
    businessValue:
      "Les entreprises comprennent maintenant que la vraie difficulte n'est pas de faire une demo de LLM, mais de maintenir la qualite, les couts, la securite, l'evaluation et la supervision dans la duree.",
    audience:
      "Architectes IA, ML engineers, data scientists, platform teams, innovation et responsables techniques.",
    promise:
      "Structurer un cadre d'exploitation LLM durable, mesurable et gouvernable.",
    primaryCta: "Demander un parcours LLMOps",
    secondaryCta: "Explorer les formations IA avancees",
    keywords: [
      "llmops",
      "llm",
      "observabilite",
      "evaluation",
      "monitoring",
      "rag",
      "gouvernance llm",
      "application llm",
    ],
    editorialBlocks: [
      {
        title: "Le vrai sujet n'est plus seulement le prompt",
        body: "Quand les usages se multiplient, il faut versionner, observer, mesurer, monitorer et faire evoluer les applications LLM comme de vrais produits techniques et non comme de simples experimentations.",
      },
      {
        title: "Qualite, couts et supervision",
        body: "Les equipes doivent apprendre a suivre les performances, les couts d'inference, les taux d'erreur, les derives de comportement et les boucles de feedback pour maintenir la fiabilite des systemes.",
      },
      {
        title: "Un sujet cle pour les plateformes IA",
        body: "Le LLMOps relie architecture, securite, data, evaluation et exploitation. C'est une competence de plus en plus demandee dans les organisations qui veulent industrialiser leurs usages IA.",
      },
    ],
  },
] as const;

type CoursePreview = {
  id: string;
  title: string;
  estimatedMinutes: number | null;
  modules: Array<{
    lessons: Array<{ title: string; type: string; durationMin: number | null }>;
  }>;
};
export type DetailedProgramme = {
  slug: string;
  version: number;
  status: "DRAFT_FOR_TRAINER_REVIEW";
  authoredAt: string;
  totalHours: number;
  overview?: string;
  audience?: string;
  prerequisites?: string;
  caseStudy: string;
  preparation: string;
  methods: string;
  scheduleNote: string;
  materialsStatus: string;
  modules: Array<{
    day: number;
    title: string;
    durationMinutes: number;
    topics: string[];
    workshop: string;
    technicalDetails?: string[];
    practicalCheck?: string;
    expertChallenge?: string;
    deliverable?: string;
  }>;
  assessment: { format: string; durationMinutes: number; criteria: string[] };
  references: Array<{ title: string; url: string }>;
};
type CatalogueSource = {
  kind?: string;
  sourceUrl?: string;
  observedAt?: string;
  observedPrice?: string;
  observedSessions?: string;
  programStatus?: string;
  syllabus?: DetailedProgramme;
  syllabusSummary?: { totalHours: number; moduleCount: number; status: string };
};

type ApiTraining = {
  program?: CatalogueSource;
  courses?: CoursePreview[];
  id: string;
  slug: string;
  title: string;
  summary: string;
  objectives?: string[];
  audience?: string | null;
  prerequisites?: string | null;
  durationDays: number;
  format: string;
  level: string;
  priceFromCents?: number | null;
  category: string;
  nextSessionDate?: string | null;
  sessions?: Array<{
    id: string;
    startDate: string;
    endDate: string;
    city?: string | null;
    status: string;
  }>;
};

export type UiTraining = {
  source?: CatalogueSource;
  courses: CoursePreview[];
  id: string;
  slug: string;
  title: string;
  category: string;
  format: string;
  level: string;
  duration: string;
  priceFrom: string;
  nextSession: string;
  summary: string;
  goals: string[];
  audience?: string | null;
  prerequisites?: string | null;
  sessions?: ApiTraining["sessions"];
  isPriority?: boolean;
};

function normalizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function formatLevel(level: string) {
  const map: Record<string, string> = {
    FOUNDATION: "Fondamental",
    INTERMEDIATE: "Intermédiaire",
    ADVANCED: "Avancé",
    EXPERT: "Expert",
  };

  return map[level] ?? level;
}

function formatMode(format: string) {
  const map: Record<string, string> = {
    ONSITE: "Présentiel",
    REMOTE: "Distanciel",
    HYBRID: "Hybride",
    ELEARNING: "E-learning",
    BLENDED: "Blended",
  };

  return map[format] ?? format;
}

function formatDuration(days: number) {
  return `${days} jour${days > 1 ? "s" : ""}`;
}

function formatPrice(cents?: number | null) {
  if (!cents) {
    return "Sur demande";
  }

  return (
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(cents / 100) + " HT"
  );
}

function formatDate(date?: string | null) {
  if (!date) {
    return "Planification à venir";
  }

  return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

function mapTraining(training: ApiTraining): UiTraining {
  const normalizedTitle = normalizeValue(training.title);

  return {
    source: training.program,
    courses: training.courses ?? [],
    id: training.id,
    slug: training.slug,
    title: training.title,
    category: training.category,
    format: formatMode(training.format),
    level: formatLevel(training.level),
    duration: formatDuration(training.durationDays),
    priceFrom: formatPrice(training.priceFromCents),
    nextSession: formatDate(
      training.nextSessionDate ?? training.sessions?.[0]?.startDate,
    ),
    summary: training.summary,
    goals: training.objectives ?? [],
    audience: training.audience,
    prerequisites: training.prerequisites,
    sessions: training.sessions,
    isPriority: PRIORITY_TRAINING_KEYS.has(normalizedTitle),
  };
}

export function getPriorityTrainings(trainings: UiTraining[]) {
  return trainings.filter((training) => training.isPriority);
}

export function groupTrainingsByPremiumCategory(
  trainings: UiTraining[],
): PremiumCatalogGroup[] {
  const grouped = PREMIUM_CATEGORY_CONFIG.map((config) => {
    const trainingsForGroup = trainings.filter((training) => {
      const haystack = normalizeValue(
        [
          training.title,
          training.category,
          training.summary,
          training.goals.join(" "),
        ].join(" "),
      );

      return config.matchers.some((matcher) =>
        haystack.includes(normalizeValue(matcher)),
      );
    });

    return {
      key: config.key,
      title: config.title,
      description: config.description,
      audience: config.audience,
      accent: config.accent,
      trainings: trainingsForGroup,
    };
  });

  return grouped.filter((group) => group.trainings.length > 0);
}

export function getHomepageFeaturedTrainings(trainings: UiTraining[]) {
  const slugs = [
    "llmops-deployer-observer-et-gouverner-les-applications-llm",
    "deep-learning-applique-avec-pytorch",
    "product-analytics-et-experimentation-ab-testing",
    "data-engineering-cloud-pipelines-elt-et-orchestration",
    "lakehouse-moderne-avec-microsoft-fabric-et-databricks",
    "donnees-pretes-pour-l-ia-gouvernance-qualite-et-knowledge-management",
  ];
  const selected = slugs.flatMap((slug) => {
    const training = trainings.find((t) => t.slug === slug);
    return training ? [training] : [];
  });
  return [
    ...selected,
    ...trainings.filter((t) => !slugs.includes(t.slug)),
  ].slice(0, 6);
}

export function getSeoCategoryHubs() {
  return SEO_CATEGORY_HUBS;
}

export function getSeoCategoryHubBySlug(slug: string) {
  return SEO_CATEGORY_HUBS.find((hub) => hub.slug === slug) ?? null;
}

export function getTrainingsForSeoHub(trainings: UiTraining[], slug: string) {
  const hub = getSeoCategoryHubBySlug(slug);

  if (!hub) {
    return [];
  }

  return trainings.filter((training) => {
    const haystack = normalizeValue(
      [
        training.title,
        training.category,
        training.summary,
        training.goals.join(" "),
      ].join(" "),
    );

    return hub.keywords.some((keyword) =>
      haystack.includes(normalizeValue(keyword)),
    );
  });
}

export async function getTrainings(): Promise<UiTraining[]> {
  try {
    const response = await fetch(`${API_URL}/trainings`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trainings");
    }

    const trainings = (await response.json()) as ApiTraining[];
    return trainings.map(mapTraining);
  } catch {
    throw new Error(
      "Catalogue temporairement indisponible. Réessayez ou contactez l’organisme.",
    );
  }
}

export async function getTrainingBySlug(
  slug: string,
): Promise<UiTraining | null> {
  try {
    const response = await fetch(`${API_URL}/trainings/${slug}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Fiche temporairement indisponible.");
    }

    const training = (await response.json()) as ApiTraining;
    return mapTraining(training);
  } catch {
    throw new Error(
      "Fiche temporairement indisponible. Réessayez ultérieurement.",
    );
  }
}
