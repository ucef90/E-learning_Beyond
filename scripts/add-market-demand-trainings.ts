import { PrismaClient, TrainingFormatCode, TrainingLevelCode } from "@prisma/client";

const prisma = new PrismaClient();

type MarketTraining = {
  slug: string;
  reference: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  objectives: string[];
  audience: string;
  prerequisites: string;
  durationDays: number;
  level: TrainingLevelCode;
  format: TrainingFormatCode;
  priceFromCents: number;
  sessionDate: string;
  city: string;
};

const marketDemandTrainings: MarketTraining[] = [
  {
    slug: "microsoft-365-copilot-pour-managers-et-directions",
    reference: "BE-MKT-301",
    title: "Microsoft 365 Copilot pour managers et directions",
    category: "intelligence artificielle",
    summary: "Transformer la productivite individuelle et collective avec Microsoft 365 Copilot dans les usages de management, preparation, synthese et prise de decision.",
    description: "Cette formation montre comment tirer parti de Copilot dans Outlook, Teams, Word, PowerPoint et Excel pour gagner du temps, fiabiliser les syntheses et mieux piloter les activites d'une equipe.",
    objectives: [
      "Identifier les cas d'usage Copilot a plus forte valeur pour les managers",
      "Rediger des prompts efficaces pour les reunions, syntheses et decisions",
      "Mettre en place des garde-fous de qualite, de confidentialite et de validation"
    ],
    audience: "Directions, managers, responsables d'equipe, fonctions support et managers transverses.",
    prerequisites: "Utiliser Microsoft 365 dans un contexte professionnel.",
    durationDays: 1,
    level: TrainingLevelCode.FOUNDATION,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 109000,
    sessionDate: "2027-03-23",
    city: "Casablanca"
  },
  {
    slug: "copilot-pour-pmo-chefs-de-projet-et-equipes-programme",
    reference: "BE-MKT-302",
    title: "Copilot pour PMO, chefs de projet et equipes programme",
    category: "gestion de projet",
    summary: "Utiliser Copilot pour accelerer les reportings, syntheses, plans d'action, comptes rendus et dashboards projet.",
    description: "Une formation tres concrete pour integrer l'IA generative dans les routines PMO et projet sans perdre en fiabilite, en tracabilite ni en qualite de pilotage.",
    objectives: [
      "Automatiser les taches repetitives de documentation projet",
      "Produire plus vite des syntheses et supports de comite de pilotage",
      "Garder la maitrise sur la qualite et la validation des livrables"
    ],
    audience: "PMO, chefs de projet, responsables programme, directions transformation.",
    prerequisites: "Avoir deja pratique la gestion de projet ou la production de reportings projet.",
    durationDays: 1,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 119000,
    sessionDate: "2027-03-30",
    city: "Paris"
  },
  {
    slug: "prompt-engineering-avance-pour-equipes-metier",
    reference: "BE-MKT-303",
    title: "Prompt Engineering avance pour equipes metier",
    category: "intelligence artificielle",
    summary: "Passer d'un usage opportuniste de l'IA a une pratique solide, reproductible et orientee resultats.",
    description: "La formation structure les bonnes pratiques de prompting pour l'analyse, la synthese, la creation de contenu, la preparation de presentations et la resolution de problemes metier.",
    objectives: [
      "Concevoir des prompts robustes et reutilisables",
      "Choisir les bonnes strategies selon le type de tache",
      "Evaluer les sorties et reduire les hallucinations"
    ],
    audience: "Equipes metier, consultants, analysts, managers, fonctions support et innovation.",
    prerequisites: "Avoir deja utilise ChatGPT, Copilot ou un assistant IA comparable.",
    durationDays: 1,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 99000,
    sessionDate: "2027-04-06",
    city: "Distanciel"
  },
  {
    slug: "ai-agents-pour-automatiser-les-processus-metier",
    reference: "BE-MKT-304",
    title: "AI Agents pour automatiser les processus metier",
    category: "intelligence artificielle",
    summary: "Comprendre ou les agents IA apportent une vraie valeur et concevoir des cas d'usage fiables pour l'entreprise.",
    description: "La formation couvre les principes des agents IA, l'orchestration de taches, la supervision humaine, les cas d'usage transverses et les limites a connaitre avant de passer a l'echelle.",
    objectives: [
      "Identifier les processus metier adaptables a une logique d'agents",
      "Comprendre les briques d'un systeme d'agents et leurs risques",
      "Construire une feuille de route d'automatisation realiste"
    ],
    audience: "Directions innovation, transformation, produit, operations et SI.",
    prerequisites: "Connaissance generale des usages IA generative en entreprise.",
    durationDays: 2,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 189000,
    sessionDate: "2027-04-13",
    city: "Casablanca"
  },
  {
    slug: "agent-boss-piloter-une-equipe-hybride-humains-et-agents-ia",
    reference: "BE-MKT-305",
    title: "Agent Boss : piloter une equipe hybride humains et agents IA",
    category: "intelligence artificielle",
    summary: "Adopter les nouveaux reflexes de pilotage quand des agents IA participent a la production, a l'analyse et a la coordination.",
    description: "Une formation pour managers et leaders qui veulent comprendre comment distribuer le travail entre humains et agents, controler la qualite et faire evoluer les pratiques d'equipe.",
    objectives: [
      "Repenser la repartition des taches entre humains et IA",
      "Installer des mecanismes de controle et de supervision utiles",
      "Faire evoluer la gouvernance d'equipe et les routines de travail"
    ],
    audience: "Directions, managers, PMO, responsables produit, responsables transformation.",
    prerequisites: "Avoir une experience de management ou de coordination transverse.",
    durationDays: 1,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 119000,
    sessionDate: "2027-04-20",
    city: "Paris"
  },
  {
    slug: "ai-security-securiser-les-usages-de-l-ia-generative",
    reference: "BE-MKT-306",
    title: "AI Security : securiser les usages de l'IA generative",
    category: "cybersecurite",
    summary: "Encadrer les usages IA avec les bons reflexes de securite, de protection des donnees et de reduction des risques.",
    description: "La formation traite des fuites de donnees, de l'exposition d'informations sensibles, de la securisation des prompts, des tiers IA et des controles utiles pour un usage responsable en entreprise.",
    objectives: [
      "Identifier les principaux risques securite lies a l'IA generative",
      "Mettre en place des garde-fous adaptes aux usages de l'entreprise",
      "Coordonner les enjeux entre metier, IT, data et conformite"
    ],
    audience: "RSSI, responsables securite, DSI, data officers, responsables innovation et conformite.",
    prerequisites: "Connaissance generale des environnements numeriques et des enjeux de donnees.",
    durationDays: 2,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 199000,
    sessionDate: "2027-04-27",
    city: "Casablanca"
  },
  {
    slug: "donnees-pretes-pour-l-ia-gouvernance-qualite-et-knowledge-management",
    reference: "BE-MKT-307",
    title: "Donnees pretes pour l'IA : gouvernance, qualite et knowledge management",
    category: "data",
    summary: "Poser les fondations data et documentaires necessaires pour faire reussir des cas d'usage IA a l'echelle.",
    description: "La formation relie qualite de donnees, gouvernance, classification documentaire, capitalisation des connaissances et readiness des contenus pour les usages IA et RAG.",
    objectives: [
      "Evaluer la maturite des donnees et contenus avant un projet IA",
      "Prioriser les actions de qualite et de gouvernance a fort impact",
      "Preparer un socle knowledge management utile aux assistants IA"
    ],
    audience: "Data office, knowledge managers, responsables qualite, responsables SI, directions transformation.",
    prerequisites: "Avoir deja participe a un projet data, documentaire ou IA.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 169000,
    sessionDate: "2027-05-04",
    city: "Paris"
  },
  {
    slug: "lakehouse-moderne-avec-microsoft-fabric-et-databricks",
    reference: "BE-MKT-308",
    title: "Lakehouse moderne avec Microsoft Fabric et Databricks",
    category: "data engineering",
    summary: "Comprendre les architectures lakehouse modernes et choisir une trajectoire realiste entre Fabric, Databricks et besoins metier.",
    description: "Une formation orientee architecture pour relier ingestion, stockage, gouvernance, analyse, BI et machine learning dans une plateforme data moderne.",
    objectives: [
      "Comprendre les principes d'une architecture lakehouse",
      "Comparer les usages de Microsoft Fabric et Databricks",
      "Choisir une trajectoire d'industrialisation data adaptee"
    ],
    audience: "Architectes data, data engineers, responsables plateforme data, chefs de projet data.",
    prerequisites: "Connaissance des bases data warehouse, BI ou integration de donnees.",
    durationDays: 2,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 199000,
    sessionDate: "2027-05-11",
    city: "Casablanca"
  },
  {
    slug: "data-engineering-cloud-pipelines-elt-et-orchestration",
    reference: "BE-MKT-309",
    title: "Data Engineering cloud : pipelines ELT et orchestration",
    category: "data engineering",
    summary: "Structurer des pipelines de donnees cloud fiables, observables et maintenables pour l'analytique et l'IA.",
    description: "La formation couvre les patterns ELT, l'orchestration, la supervision, la reprise sur erreur, la qualite des flux et les principes d'une data platform moderne.",
    objectives: [
      "Concevoir des pipelines cloud robustes et reutilisables",
      "Mettre en place supervision, logs et qualite de service",
      "Mieux articuler data engineering, BI et usages IA"
    ],
    audience: "Data engineers, developpeurs data, responsables integration, architectes cloud data.",
    prerequisites: "Avoir des bases en SQL, integration et manipulation de donnees.",
    durationDays: 3,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 219000,
    sessionDate: "2027-05-18",
    city: "Paris"
  },
  {
    slug: "product-analytics-et-experimentation-ab-testing",
    reference: "BE-MKT-310",
    title: "Product Analytics et experimentation A/B testing",
    category: "product management",
    summary: "Utiliser la mesure produit et l'experimentation pour mieux prioriser, apprendre plus vite et piloter par la valeur.",
    description: "Une formation pour relier instrumentation, funnels, cohortes, hypotheses, A/B tests et arbitrages produit dans une logique de croissance responsable.",
    objectives: [
      "Definir les bons indicateurs produit et activation",
      "Structurer une demarche d'experimentation fiable",
      "Transformer les resultats en decisions produit utiles"
    ],
    audience: "Product managers, product owners, analysts produit, growth teams, business analysts.",
    prerequisites: "Avoir deja travaille sur un produit digital, des KPI ou des usages analytics.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 159000,
    sessionDate: "2027-05-25",
    city: "Casablanca"
  },
  {
    slug: "deep-learning-applique-avec-pytorch",
    reference: "BE-MKT-311",
    title: "Deep Learning applique avec PyTorch",
    category: "data science",
    summary: "Construire des modeles deep learning utiles au business avec une approche pragmatique, explicable et orientee experimentation.",
    description: "La formation relie reseaux de neurones, entrainement, evaluation, optimisation et bonnes pratiques projet avec PyTorch sur des cas concrets.",
    objectives: [
      "Comprendre les composants d'un pipeline deep learning avec PyTorch",
      "Entrainner et evaluer des modeles sur des cas concrets",
      "Identifier les limites et conditions de reussite d'un projet deep learning"
    ],
    audience: "Data scientists, ML engineers, profils IA avances, equipe R&D data.",
    prerequisites: "Avoir deja pratique Python, statistiques et machine learning supervise.",
    durationDays: 3,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 229000,
    sessionDate: "2027-06-01",
    city: "Paris"
  },
  {
    slug: "llmops-deployer-observer-et-gouverner-les-applications-llm",
    reference: "BE-MKT-312",
    title: "LLMOps : deployer, observer et gouverner les applications LLM",
    category: "intelligence artificielle",
    summary: "Passer du prototype LLM a une application robuste avec evaluation, monitoring, couts, qualite et gouvernance.",
    description: "Une formation pour industrialiser les applications LLM avec observabilite, gestion des prompts, evaluation, securite, versioning et supervision continue.",
    objectives: [
      "Comprendre les pratiques LLMOps et leurs enjeux",
      "Mettre en place evaluation, monitoring et versioning",
      "Anticiper les enjeux de cout, qualite et securite a l'echelle"
    ],
    audience: "Architectes IA, ML engineers, data scientists, responsables innovation et platform teams.",
    prerequisites: "Connaissance des usages LLM, du machine learning ou des architectures IA.",
    durationDays: 2,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 219000,
    sessionDate: "2027-06-08",
    city: "Casablanca"
  }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function upsertCategory(name: string) {
  const slug = slugify(name);

  return prisma.category.upsert({
    where: { slug },
    update: { name },
    create: { name, slug }
  });
}

async function main() {
  const categories = new Map<string, string>();

  for (const training of marketDemandTrainings) {
    if (!categories.has(training.category)) {
      const category = await upsertCategory(training.category);
      categories.set(training.category, category.id);
    }
  }

  for (const training of marketDemandTrainings) {
    const categoryId = categories.get(training.category)!;

    const created = await prisma.training.upsert({
      where: { slug: training.slug },
      update: {
        reference: training.reference,
        title: training.title,
        summary: training.summary,
        description: training.description,
        objectives: training.objectives,
        audience: training.audience,
        prerequisites: training.prerequisites,
        durationDays: training.durationDays,
        level: training.level,
        format: training.format,
        priceFromCents: training.priceFromCents,
        isPublished: true
      },
      create: {
        slug: training.slug,
        reference: training.reference,
        title: training.title,
        summary: training.summary,
        description: training.description,
        objectives: training.objectives,
        audience: training.audience,
        prerequisites: training.prerequisites,
        durationDays: training.durationDays,
        level: training.level,
        format: training.format,
        priceFromCents: training.priceFromCents,
        isPublished: true
      }
    });

    await prisma.trainingCategory.upsert({
      where: {
        trainingId_categoryId: {
          trainingId: created.id,
          categoryId
        }
      },
      update: {},
      create: {
        trainingId: created.id,
        categoryId
      }
    });

    const startDate = new Date(`${training.sessionDate}T09:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + Math.max(training.durationDays - 1, 0));

    await prisma.trainingSession.upsert({
      where: {
        sessionCode: `${training.reference}-${training.sessionDate}`
      },
      update: {
        trainingId: created.id,
        startDate,
        endDate,
        city: training.city,
        status: "OPEN",
        capacity: 14,
        seatsAvailable: 9
      },
      create: {
        trainingId: created.id,
        sessionCode: `${training.reference}-${training.sessionDate}`,
        status: "OPEN",
        startDate,
        endDate,
        city: training.city,
        capacity: 14,
        seatsAvailable: 9
      }
    });

    console.log(`upserted ${training.reference} - ${training.title}`);
  }

  console.log(`done: ${marketDemandTrainings.length} market-demand trainings upserted`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
