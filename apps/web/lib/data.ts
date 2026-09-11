export type Training = {
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
};

export const featuredTrainings: Training[] = [
  {
    id: "tr-ia",
    slug: "ia-generative-pour-les-organisations",
    title: "IA générative pour les organisations",
    category: "Transformation digitale",
    format: "Hybride",
    level: "Intermédiaire",
    duration: "2 jours",
    priceFrom: "1 490 € HT",
    nextSession: "12/05/2026",
    summary: "Structurer l’adoption de l’IA générative avec une approche métier, gouvernance et outillage.",
    goals: ["Cadrer les usages", "Évaluer les risques", "Lancer un plan de déploiement"]
  },
  {
    id: "tr-lead",
    slug: "leadership-et-management-de-la-performance",
    title: "Leadership et management de la performance",
    category: "Leadership",
    format: "Présentiel / Distanciel",
    level: "Fondamental",
    duration: "3 jours",
    priceFrom: "1 790 € HT",
    nextSession: "19/05/2026",
    summary: "Développer une posture managériale claire, exigeante et durable.",
    goals: ["Piloter les objectifs", "Renforcer la communication", "Conduire des feedbacks efficaces"]
  },
  {
    id: "tr-data",
    slug: "data-literacy-pour-decideurs",
    title: "Data literacy pour décideurs",
    category: "Data",
    format: "Distanciel",
    level: "Fondamental",
    duration: "1 jour",
    priceFrom: "990 € HT",
    nextSession: "03/06/2026",
    summary: "Comprendre les indicateurs, les biais et les usages décisionnels de la donnée.",
    goals: ["Lire un tableau de bord", "Poser les bonnes questions", "Réduire les erreurs d’interprétation"]
  }
];

export const faqItems = [
  {
    question: "Comment réserver une formation ?",
    answer: "Depuis la fiche formation, l’utilisateur peut demander un devis, une inscription ou un échange avec l’équipe commerciale."
  },
  {
    question: "Le LMS est-il intégré ?",
    answer: "Le socle prévoit un mini LMS natif avec progression, modules, leçons, quiz et certificats, extensible vers une intégration externe."
  },
  {
    question: "Peut-on gérer des entreprises clientes ?",
    answer: "Oui. Le modèle de données prévoit les entreprises, leurs utilisateurs, les inscriptions multi-participants et l’évolution vers un portail B2B."
  }
];
