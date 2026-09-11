import { PrismaClient, TrainingFormatCode, TrainingLevelCode } from "@prisma/client";

const prisma = new PrismaClient();

type CuratedTraining = {
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

const curatedTrainings: CuratedTraining[] = [
  {
    slug: "data-analyst-excel-power-query-et-power-bi",
    reference: "BE-DA-201",
    title: "Data Analyst : Excel, Power Query et Power BI",
    category: "data analyst",
    summary: "Structurer une chaîne complète de préparation, analyse et visualisation de données métier avec Excel avancé, Power Query et Power BI.",
    description: "Cette formation permet aux futurs data analysts de passer d’une logique tableur à une logique décisionnelle, avec nettoyage des données, modélisation simple, dataviz et tableaux de bord orientés pilotage.",
    objectives: [
      "Nettoyer et consolider des données métier avec Power Query",
      "Créer des indicateurs fiables et des tableaux de bord lisibles",
      "Mettre en place un reporting récurrent orienté décision"
    ],
    audience: "Analystes métier, contrôleurs de gestion, responsables reporting, profils en reconversion vers le métier de data analyst.",
    prerequisites: "Être à l’aise avec Excel et les tableaux de données professionnels.",
    durationDays: 3,
    level: TrainingLevelCode.FOUNDATION,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 169000,
    sessionDate: "2026-07-06",
    city: "Casablanca"
  },
  {
    slug: "data-visualisation-pour-decideurs",
    reference: "BE-BI-202",
    title: "Data visualisation pour décideurs et managers",
    category: "business intelligence",
    summary: "Concevoir des tableaux de bord lisibles, utiles et orientés décision pour les directions métiers et les équipes managériales.",
    description: "Une formation centrée sur la lisibilité des indicateurs, la hiérarchie visuelle, le choix des graphiques et la narration de données pour améliorer l’impact des comités de pilotage.",
    objectives: [
      "Choisir les visualisations adaptées aux messages à transmettre",
      "Éviter les biais de lecture et les dashboards surchargés",
      "Construire une narration de données orientée action"
    ],
    audience: "Managers, PMO, business analysts, responsables pilotage et consultants.",
    prerequisites: "Avoir déjà manipulé des tableaux de bord ou des indicateurs de suivi.",
    durationDays: 2,
    level: TrainingLevelCode.FOUNDATION,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 129000,
    sessionDate: "2026-07-13",
    city: "Distanciel"
  },
  {
    slug: "sql-pour-data-analyst",
    reference: "BE-DA-203",
    title: "SQL pour Data Analyst",
    category: "data analyst",
    summary: "Exploiter efficacement les bases de données relationnelles pour répondre à des besoins d’analyse, de reporting et de contrôle métier.",
    description: "La formation couvre les requêtes utiles au quotidien d’un data analyst : extraction, jointures, agrégations, qualité de données, segmentation et préparation pour la BI.",
    objectives: [
      "Écrire des requêtes analytiques robustes",
      "Contrôler la qualité et la cohérence des données extraites",
      "Préparer des jeux de données fiables pour le reporting"
    ],
    audience: "Data analysts, business analysts, contrôleurs de gestion, chefs de projet data.",
    prerequisites: "Connaître les bases de l’analyse de données et l’usage d’un tableur.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 149000,
    sessionDate: "2026-07-20",
    city: "Paris"
  },
  {
    slug: "power-bi-pour-controle-de-gestion",
    reference: "BE-BI-204",
    title: "Power BI pour le contrôle de gestion",
    category: "business intelligence",
    summary: "Construire un pilotage financier et opérationnel moderne avec Power BI, KPI, scénarios et tableaux de bord exécutifs.",
    description: "Une formation métier pour passer d’un reporting dispersé à un cockpit de performance partagé entre direction financière et directions opérationnelles.",
    objectives: [
      "Concevoir des KPI financiers et opérationnels cohérents",
      "Mettre en scène les écarts budget/réalisé/forecast",
      "Automatiser des tableaux de bord fiables dans Power BI"
    ],
    audience: "Contrôleurs de gestion, responsables finance, analystes performance, directions métier.",
    prerequisites: "Maîtriser les concepts de reporting financier et les bases d’Excel.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 159000,
    sessionDate: "2026-07-27",
    city: "Casablanca"
  },
  {
    slug: "data-quality-et-gouvernance-des-donnees",
    reference: "BE-DATA-205",
    title: "Data Quality et gouvernance des données",
    category: "data",
    summary: "Poser un cadre opérationnel pour améliorer la fiabilité, la responsabilité et la traçabilité des données dans l’entreprise.",
    description: "Cette formation aborde les rôles, les règles de qualité, la documentation, les référentiels, la priorisation des quick wins et la mise en place d’une gouvernance pragmatique.",
    objectives: [
      "Identifier les causes racines de la mauvaise qualité de données",
      "Définir des rôles et responsabilités autour de la donnée",
      "Mettre en place un plan d’amélioration data pragmatique"
    ],
    audience: "Data managers, data owners, responsables qualité, chefs de projet data, responsables SI.",
    prerequisites: "Avoir déjà participé à un projet data, BI ou SI.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 169000,
    sessionDate: "2026-09-07",
    city: "Paris"
  },
  {
    slug: "data-warehouse-et-modelisation-dimensionnelle",
    reference: "BE-DATA-206",
    title: "Data Warehouse et modélisation dimensionnelle",
    category: "data engineering",
    summary: "Comprendre et concevoir un socle décisionnel robuste avec modèles en étoile, faits, dimensions et logique d’historisation.",
    description: "Une formation idéale pour mieux structurer la couche analytique d’une plateforme data et améliorer la lisibilité des projets BI.",
    objectives: [
      "Différencier entrepôt de données, data mart et lakehouse",
      "Modéliser des faits et dimensions adaptés aux usages",
      "Préparer une architecture analytique durable"
    ],
    audience: "Data engineers, BI engineers, architectes data, chefs de projet BI.",
    prerequisites: "Connaître les bases des bases de données et du reporting.",
    durationDays: 3,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 189000,
    sessionDate: "2026-09-14",
    city: "Distanciel"
  },
  {
    slug: "etl-et-integration-de-donnees-moderne",
    reference: "BE-DATA-207",
    title: "ETL et intégration de données moderne",
    category: "data engineering",
    summary: "Concevoir des flux d’intégration fiables entre applications, bases de données, API et plateformes analytiques.",
    description: "La formation traite des schémas d’intégration modernes, de la qualité de flux, de l’orchestration, des erreurs et de la supervision d’un pipeline data.",
    objectives: [
      "Comprendre les modèles ETL et ELT",
      "Sécuriser les flux d’intégration et le suivi des erreurs",
      "Concevoir un pipeline réutilisable et maintenable"
    ],
    audience: "Data engineers, BI developers, développeurs back-end, responsables d’intégration.",
    prerequisites: "Avoir des notions de SQL et de manipulation de données.",
    durationDays: 3,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 189000,
    sessionDate: "2026-09-21",
    city: "Casablanca"
  },
  {
    slug: "python-pour-data-analyst",
    reference: "BE-DA-208",
    title: "Python pour Data Analyst",
    category: "data analyst",
    summary: "Exploiter Python pour automatiser l’analyse de données, fiabiliser les traitements et accélérer la production de reporting.",
    description: "Une formation métier centrée sur pandas, la préparation de données, les analyses exploratoires et l’industrialisation des traitements récurrents.",
    objectives: [
      "Manipuler des jeux de données avec pandas",
      "Automatiser des traitements d’analyse récurrents",
      "Préparer des sorties prêtes pour la visualisation et le reporting"
    ],
    audience: "Data analysts, business analysts, profils BI souhaitant monter en autonomie technique.",
    prerequisites: "Avoir une pratique des données et des tableaux de reporting.",
    durationDays: 3,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 179000,
    sessionDate: "2026-09-28",
    city: "Paris"
  },
  {
    slug: "statistiques-appliquees-pour-data-analyst",
    reference: "BE-DATA-209",
    title: "Statistiques appliquées pour Data Analyst",
    category: "data analyst",
    summary: "Maîtriser les statistiques essentielles pour analyser correctement les données et éviter les erreurs d’interprétation.",
    description: "Cette formation couvre les distributions, tests, corrélations, échantillonnage, intervalles de confiance et lecture critique des résultats analytiques.",
    objectives: [
      "Comprendre les concepts statistiques utilisés dans l’analyse de données",
      "Interpréter correctement des résultats et éviter les biais",
      "Sélectionner les bons outils selon le contexte métier"
    ],
    audience: "Data analysts, business analysts, responsables reporting, marketing analysts.",
    prerequisites: "Manipuler régulièrement des données chiffrées ou des tableaux de bord.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 149000,
    sessionDate: "2026-10-05",
    city: "Distanciel"
  },
  {
    slug: "data-storytelling-pour-comites-de-direction",
    reference: "BE-BI-210",
    title: "Data Storytelling pour comités de direction",
    category: "business intelligence",
    summary: "Transformer des analyses complexes en messages simples, convaincants et utiles pour les décideurs.",
    description: "Une formation à fort impact pour passer d’une logique de report à une logique d’influence, de cadrage et de décision par la donnée.",
    objectives: [
      "Construire un récit de données orienté décision",
      "Sélectionner les insights réellement utiles pour un CODIR",
      "Présenter des résultats de manière claire et mémorable"
    ],
    audience: "Managers, data analysts, PMO, consultants, chefs de projet transformation.",
    prerequisites: "Disposer d’une expérience de présentation de résultats ou de pilotage d’indicateurs.",
    durationDays: 1,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 99000,
    sessionDate: "2026-10-12",
    city: "Casablanca"
  },
  {
    slug: "machine-learning-pour-data-scientist-junior",
    reference: "BE-DS-211",
    title: "Machine Learning pour Data Scientist Junior",
    category: "data science",
    summary: "Acquérir les bases méthodologiques et techniques nécessaires pour mener des premiers projets de machine learning de bout en bout.",
    description: "La formation couvre le framing, la préparation des données, l’entraînement, l’évaluation, l’interprétation et les pièges fréquents des premiers projets ML.",
    objectives: [
      "Construire un premier pipeline de machine learning supervisé",
      "Comparer des modèles et interpréter leurs résultats",
      "Éviter les erreurs classiques de cadrage et d’évaluation"
    ],
    audience: "Juniors data scientists, data analysts techniques, profils en montée de compétence vers la data science.",
    prerequisites: "Connaître Python, les bases statistiques et la manipulation de données.",
    durationDays: 4,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 229000,
    sessionDate: "2026-10-19",
    city: "Paris"
  },
  {
    slug: "feature-engineering-et-selection-de-variables",
    reference: "BE-DS-212",
    title: "Feature Engineering et sélection de variables",
    category: "data science",
    summary: "Améliorer la performance et la robustesse des modèles en structurant correctement les variables d’entrée.",
    description: "Une formation très pratique pour travailler les transformations, encodages, agrégations, dérivations et sélections de variables dans une logique projet.",
    objectives: [
      "Créer des variables plus informatives pour les modèles",
      "Réduire le bruit et les variables non pertinentes",
      "Structurer un pipeline de préparation réutilisable"
    ],
    audience: "Data scientists, ML engineers, analystes avancés, profils IA.",
    prerequisites: "Avoir déjà pratiqué un projet de machine learning avec Python.",
    durationDays: 2,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 169000,
    sessionDate: "2026-10-26",
    city: "Distanciel"
  },
  {
    slug: "mlops-pour-equipes-data",
    reference: "BE-ML-213",
    title: "MLOps pour équipes Data",
    category: "machine learning",
    summary: "Industrialiser les projets de machine learning avec versioning, déploiement, monitoring et gouvernance opérationnelle.",
    description: "Cette formation fait le lien entre data science, engineering et exploitation pour sortir du prototype et atteindre une logique de production durable.",
    objectives: [
      "Comprendre les briques techniques d’un dispositif MLOps",
      "Mettre en place une chaîne de déploiement et de suivi des modèles",
      "Réduire l’écart entre expérimentation et production"
    ],
    audience: "Data scientists, ML engineers, responsables data platform, architectes techniques.",
    prerequisites: "Avoir déjà participé à un projet de machine learning en environnement d’entreprise.",
    durationDays: 3,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 219000,
    sessionDate: "2026-11-03",
    city: "Casablanca"
  },
  {
    slug: "generative-ai-pour-data-analyst",
    reference: "BE-AI-214",
    title: "Generative AI pour Data Analyst",
    category: "intelligence artificielle",
    summary: "Exploiter l’IA générative pour accélérer l’analyse, la documentation, la création de requêtes et la synthèse de résultats.",
    description: "Une formation opérationnelle pour intégrer l’IA générative dans le quotidien d’un data analyst sans perdre en qualité, traçabilité et esprit critique.",
    objectives: [
      "Automatiser certaines tâches analytiques à faible valeur",
      "Créer des prompts utiles pour SQL, reporting et synthèses",
      "Sécuriser l’usage de l’IA générative dans un contexte data"
    ],
    audience: "Data analysts, BI analysts, business analysts, responsables reporting.",
    prerequisites: "Pratiquer déjà l’analyse de données et le reporting.",
    durationDays: 1,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 109000,
    sessionDate: "2026-11-10",
    city: "Distanciel"
  },
  {
    slug: "ai-governance-pour-data-office",
    reference: "BE-AI-215",
    title: "AI Governance pour Data Office",
    category: "intelligence artificielle",
    summary: "Mettre en place une gouvernance IA pragmatique alignée avec la gouvernance data, les risques et les priorités métier.",
    description: "La formation aide à structurer rôles, politiques, traçabilité, validation d’usage, supervision et articulation avec la gouvernance existante des données.",
    objectives: [
      "Définir un cadre de gouvernance IA réaliste",
      "Aligner les usages IA avec les exigences métiers et conformité",
      "Prioriser les chantiers de gouvernance à fort impact"
    ],
    audience: "Data officers, responsables gouvernance, responsables innovation, dirigeants de programmes IA.",
    prerequisites: "Connaître les principes de gouvernance des données ou de conformité.",
    durationDays: 2,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 189000,
    sessionDate: "2026-11-17",
    city: "Paris"
  },
  {
    slug: "rag-et-bases-vectorielles-pour-entreprise",
    reference: "BE-AI-216",
    title: "RAG et bases vectorielles pour l’entreprise",
    category: "intelligence artificielle",
    summary: "Comprendre les architectures RAG et les usages métier des bases vectorielles pour des assistants IA plus fiables.",
    description: "Une formation orientée architecture et cas d’usage pour les équipes qui veulent connecter leurs connaissances internes à des assistants génératifs.",
    objectives: [
      "Comprendre les composants d’une architecture RAG",
      "Identifier les cas d’usage métier les plus pertinents",
      "Anticiper les enjeux de qualité, de sécurité et de gouvernance"
    ],
    audience: "Architectes data, responsables innovation, développeurs IA, chefs de projet transformation.",
    prerequisites: "Connaître les bases des systèmes d’information et des usages IA générative.",
    durationDays: 2,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 199000,
    sessionDate: "2026-11-24",
    city: "Casablanca"
  },
  {
    slug: "kpi-et-pilotage-de-la-performance-projet",
    reference: "BE-PMO-217",
    title: "KPI et pilotage de la performance projet",
    category: "gestion de projet",
    summary: "Définir les bons indicateurs, mettre en place un cockpit projet et piloter l’avancement, les risques et la valeur produite.",
    description: "Une formation très utile pour les PMO, chefs de projet et responsables portefeuille souhaitant sortir des suivis approximatifs et poser un pilotage fiable.",
    objectives: [
      "Définir des KPI projet utiles et actionnables",
      "Construire un tableau de bord projet lisible",
      "Mieux piloter délais, charge, budget et risques"
    ],
    audience: "Chefs de projet, PMO, responsables portefeuille, managers de transformation.",
    prerequisites: "Avoir déjà participé à la gestion d’un projet ou d’un portefeuille.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 149000,
    sessionDate: "2026-12-01",
    city: "Paris"
  },
  {
    slug: "pmo-operationnel-et-gouvernance-de-portefeuille",
    reference: "BE-PMO-218",
    title: "PMO opérationnel et gouvernance de portefeuille",
    category: "gestion de projet",
    summary: "Structurer un PMO utile, lisible et orienté décision pour piloter les priorités, les arbitrages et la capacité de delivery.",
    description: "La formation couvre la mise en place d’un PMO opérationnel, les rituels de gouvernance, la consolidation et la priorisation du portefeuille.",
    objectives: [
      "Clarifier le rôle et les services rendus par le PMO",
      "Mettre en place des routines de gouvernance efficaces",
      "Piloter la capacité et les arbitrages de portefeuille"
    ],
    audience: "PMO, responsables de transformation, directeurs de projets, responsables portefeuille.",
    prerequisites: "Connaître les bases du pilotage projet ou programme.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 159000,
    sessionDate: "2026-12-08",
    city: "Casablanca"
  },
  {
    slug: "product-owner-pilotage-par-la-valeur",
    reference: "BE-AG-219",
    title: "Product Owner : pilotage par la valeur",
    category: "agile & scrum",
    summary: "Renforcer la posture Product Owner autour de la vision produit, de la priorisation, du backlog et de la valeur délivrée.",
    description: "Une formation concrète pour les Product Owners qui veulent mieux arbitrer, dialoguer avec les parties prenantes et piloter la valeur du produit.",
    objectives: [
      "Traduire une vision produit en backlog priorisé",
      "Arbitrer selon la valeur, le risque et la faisabilité",
      "Fluidifier la relation entre métier, design et delivery"
    ],
    audience: "Product owners, business analysts, chefs de produit digitaux, responsables transformation agile.",
    prerequisites: "Avoir déjà participé à un dispositif agile ou produit.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 159000,
    sessionDate: "2026-12-15",
    city: "Paris"
  },
  {
    slug: "agile-pour-directions-metier",
    reference: "BE-AG-220",
    title: "Agile pour directions métier et sponsors",
    category: "agile & scrum",
    summary: "Comprendre ce que change vraiment l’agilité pour les sponsors, métiers et décideurs hors équipes techniques.",
    description: "La formation aide les directions métier à mieux cadrer les attentes, arbitrer, sponsoriser et participer utilement à un fonctionnement agile.",
    objectives: [
      "Comprendre les principes et limites de l’agilité côté métier",
      "Mieux sponsoriser et arbitrer un dispositif agile",
      "Éviter les malentendus entre métiers et équipes delivery"
    ],
    audience: "Sponsors, directions métier, managers, responsables transformation.",
    prerequisites: "Avoir un rôle de pilotage, de cadrage ou de sponsoring.",
    durationDays: 1,
    level: TrainingLevelCode.FOUNDATION,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 99000,
    sessionDate: "2027-01-05",
    city: "Distanciel"
  },
  {
    slug: "scrum-master-facilitation-et-rituels",
    reference: "BE-AG-221",
    title: "Scrum Master : facilitation et rituels d’équipe",
    category: "agile & scrum",
    summary: "Développer une posture de Scrum Master orientée facilitation, amélioration continue et fluidité d’équipe.",
    description: "Une formation très pratique pour mieux préparer les rituels, lever les blocages, animer les rétrospectives et faire grandir la maturité agile de l’équipe.",
    objectives: [
      "Renforcer la posture de facilitation du Scrum Master",
      "Améliorer la qualité des rituels d’équipe",
      "Aider l’équipe à progresser sans sur-contrôle"
    ],
    audience: "Scrum Masters, Agile Masters, chefs de projet en transition agile.",
    prerequisites: "Connaître les bases de Scrum.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 149000,
    sessionDate: "2027-01-12",
    city: "Casablanca"
  },
  {
    slug: "kanban-pour-equipes-produit-et-support",
    reference: "BE-AG-222",
    title: "Kanban pour équipes produit et support",
    category: "agile & scrum",
    summary: "Piloter les flux, réduire le multitâche et améliorer la fluidité opérationnelle avec Kanban.",
    description: "Cette formation montre comment utiliser Kanban dans les environnements support, maintenance, produit et opérations où Scrum n’est pas toujours le bon cadre.",
    objectives: [
      "Visualiser les flux et les goulots d’étranglement",
      "Limiter le travail en cours et fluidifier les livraisons",
      "Mettre en place des métriques simples de flux"
    ],
    audience: "Responsables produit, managers d’équipe, support applicatif, opérations, chefs de projet.",
    prerequisites: "Avoir déjà observé des problèmes de charge ou de fluidité dans une équipe.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 149000,
    sessionDate: "2027-01-19",
    city: "Paris"
  },
  {
    slug: "business-analyst-cadrage-des-besoins",
    reference: "BE-BA-223",
    title: "Business Analyst : cadrage des besoins et exigences",
    category: "business analyst",
    summary: "Structurer la collecte des besoins, clarifier les exigences et sécuriser le passage du métier vers la solution.",
    description: "Une formation au croisement du produit, du projet et de la transformation, idéale pour les BA qui veulent muscler leur capacité de cadrage.",
    objectives: [
      "Recueillir et formaliser les besoins de manière exploitable",
      "Différencier besoin, exigence, contrainte et solution",
      "Améliorer la relation entre métiers, projet et delivery"
    ],
    audience: "Business analysts, product owners, AMOA, chefs de projet métier.",
    prerequisites: "Avoir déjà participé à un projet de transformation ou de digitalisation.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 149000,
    sessionDate: "2027-01-26",
    city: "Casablanca"
  },
  {
    slug: "business-analyst-modelisation-des-processus",
    reference: "BE-BA-224",
    title: "Business Analyst : modélisation des processus et parcours",
    category: "business analyst",
    summary: "Cartographier les processus, détecter les irritants et traduire les besoins d’évolution en scénarios de transformation.",
    description: "Une formation qui donne aux BA des outils concrets pour analyser les parcours, modéliser les processus et préparer les ateliers de cadrage.",
    objectives: [
      "Modéliser un processus métier de façon claire",
      "Identifier les points de friction et les opportunités de simplification",
      "Préparer des ateliers de cadrage plus efficaces"
    ],
    audience: "Business analysts, AMOA, responsables processus, chefs de projet organisation.",
    prerequisites: "Avoir déjà travaillé sur un processus ou un outil métier.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 149000,
    sessionDate: "2027-02-02",
    city: "Paris"
  },
  {
    slug: "dashboard-executif-pour-pmo-et-direction-projet",
    reference: "BE-PMO-225",
    title: "Dashboard exécutif pour PMO et directions de projet",
    category: "gestion de projet",
    summary: "Concevoir un tableau de bord portefeuille ou programme qui facilite vraiment les arbitrages de direction.",
    description: "La formation combine KPI portefeuille, visuels exécutifs, trajectoires, seuils d’alerte et narration synthétique pour les comités de pilotage.",
    objectives: [
      "Construire un tableau de bord exécutif utile au pilotage",
      "Faire remonter les bons signaux d’alerte à la direction",
      "Clarifier les arbitrages portefeuille dans un format court"
    ],
    audience: "PMO, directeurs de projet, responsables transformation, directions de portefeuille.",
    prerequisites: "Avoir déjà produit des reportings projet ou programme.",
    durationDays: 1,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 99000,
    sessionDate: "2027-02-09",
    city: "Distanciel"
  },
  {
    slug: "roadmap-produit-et-priorisation-strategique",
    reference: "BE-AG-226",
    title: "Roadmap produit et priorisation stratégique",
    category: "agile & scrum",
    summary: "Construire une roadmap produit crédible, alignée sur la stratégie et compréhensible par les parties prenantes.",
    description: "Une formation utile pour les responsables produit et sponsors qui veulent sortir d’une roadmap catalogue et aller vers une logique de trajectoire produit.",
    objectives: [
      "Définir une roadmap lisible et alignée avec les enjeux métier",
      "Prioriser en tenant compte de la valeur, du risque et de la capacité",
      "Partager une trajectoire crédible avec les parties prenantes"
    ],
    audience: "Product owners, product managers, responsables digital, business analysts.",
    prerequisites: "Avoir déjà manipulé un backlog ou un plan d’évolution produit.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 159000,
    sessionDate: "2027-02-16",
    city: "Casablanca"
  },
  {
    slug: "data-literacy-pour-managers",
    reference: "BE-DATA-227",
    title: "Data Literacy pour managers",
    category: "data",
    summary: "Développer une culture data managériale pour mieux lire les indicateurs, poser les bonnes questions et piloter par les faits.",
    description: "Une formation conçue pour les managers qui consomment des données sans être spécialistes, afin de mieux interpréter tableaux de bord, analyses et recommandations.",
    objectives: [
      "Lire correctement les principaux indicateurs de pilotage",
      "Poser les bonnes questions face à une analyse de données",
      "Améliorer la prise de décision fondée sur la donnée"
    ],
    audience: "Managers, responsables d’équipe, directions métier, chefs de projet.",
    prerequisites: "Utiliser régulièrement des indicateurs ou reportings dans son activité.",
    durationDays: 1,
    level: TrainingLevelCode.FOUNDATION,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 99000,
    sessionDate: "2027-02-23",
    city: "Paris"
  },
  {
    slug: "tableau-de-bord-rh-et-people-analytics",
    reference: "BE-DATA-228",
    title: "Tableaux de bord RH et People Analytics",
    category: "business intelligence",
    summary: "Structurer un pilotage RH moderne avec indicateurs sociaux, analyses de tendance et tableaux de bord utiles aux décisions humaines.",
    description: "Une formation pratique pour les RH et équipes pilotage qui souhaitent mieux suivre effectifs, turnover, recrutement, formation et engagement.",
    objectives: [
      "Définir des KPI RH utiles et compréhensibles",
      "Construire un tableau de bord RH actionnable",
      "Identifier des signaux faibles à partir des données sociales"
    ],
    audience: "DRH, RRH, HRBP, contrôleurs sociaux, analystes RH.",
    prerequisites: "Connaître les principaux processus RH et les indicateurs sociaux.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 149000,
    sessionDate: "2027-03-02",
    city: "Casablanca"
  },
  {
    slug: "analytics-marketing-et-attribution",
    reference: "BE-DATA-229",
    title: "Analytics marketing et modèles d’attribution",
    category: "data analyst",
    summary: "Mieux mesurer l’impact des actions marketing et arbitrer les budgets grâce à des analyses fiables.",
    description: "Une formation pour relier acquisition, conversion, rétention et performance business à des tableaux de bord et analyses orientées décision.",
    objectives: [
      "Définir les indicateurs marketing utiles au pilotage",
      "Comprendre les limites des modèles d’attribution",
      "Mieux relier actions marketing et résultats business"
    ],
    audience: "Responsables marketing, growth analysts, data analysts marketing, directions acquisition.",
    prerequisites: "Pratiquer des KPI marketing ou de performance digitale.",
    durationDays: 2,
    level: TrainingLevelCode.INTERMEDIATE,
    format: TrainingFormatCode.REMOTE,
    priceFromCents: 149000,
    sessionDate: "2027-03-09",
    city: "Distanciel"
  },
  {
    slug: "forecasting-et-series-temporelles-pour-business",
    reference: "BE-DS-230",
    title: "Forecasting et séries temporelles pour le business",
    category: "data science",
    summary: "Utiliser les séries temporelles et les modèles de prévision pour améliorer la planification et la décision.",
    description: "La formation relie théorie et cas métier autour de la demande, des ventes, de la capacité, des flux et de la prévision opérationnelle.",
    objectives: [
      "Comprendre les bases du forecasting",
      "Choisir un modèle de prévision adapté au contexte",
      "Interpréter les résultats pour soutenir la décision"
    ],
    audience: "Data scientists, analysts avancés, supply chain analysts, responsables prévision.",
    prerequisites: "Avoir une base statistique et une pratique de la donnée.",
    durationDays: 3,
    level: TrainingLevelCode.ADVANCED,
    format: TrainingFormatCode.HYBRID,
    priceFromCents: 199000,
    sessionDate: "2027-03-16",
    city: "Paris"
  }
];

async function upsertCategory(name: string) {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return prisma.category.upsert({
    where: { slug },
    update: { name },
    create: { name, slug }
  });
}

async function main() {
  const categories = new Map<string, string>();

  for (const training of curatedTrainings) {
    if (!categories.has(training.category)) {
      const category = await upsertCategory(training.category);
      categories.set(training.category, category.id);
    }
  }

  for (let index = 0; index < curatedTrainings.length; index += 1) {
    const training = curatedTrainings[index];
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

    console.log(`Upserted ${index + 1}/${curatedTrainings.length}: ${training.title}`);
  }

  console.log(`Added curated priority trainings: ${curatedTrainings.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
