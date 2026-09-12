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
    summary:
      "Structurer l’adoption de l’IA générative avec une approche métier, gouvernance et outillage.",
    goals: [
      "Cadrer les usages",
      "Évaluer les risques",
      "Lancer un plan de déploiement",
    ],
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
    goals: [
      "Piloter les objectifs",
      "Renforcer la communication",
      "Conduire des feedbacks efficaces",
    ],
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
    summary:
      "Comprendre les indicateurs, les biais et les usages décisionnels de la donnée.",
    goals: [
      "Lire un tableau de bord",
      "Poser les bonnes questions",
      "Réduire les erreurs d’interprétation",
    ],
  },
];

export const faqItems = [
  {
    question: "Comment réserver une formation ?",
    answer:
      "Consultez le programme, puis demandez un devis ou contactez le centre. Les prérequis, le tarif, les dates et la disponibilité sont confirmés avant votre inscription.",
  },
  {
    question: "Proposez-vous du présentiel, du distanciel ou de l’hybride ?",
    answer:
      "La modalité est indiquée sur chaque fiche. Le centre vous aide à choisir un format inter, intra ou adapté à votre équipe. Les prochaines dates proposées se situent au même jour du mois suivant, avec un ajustement en fin de mois. Le calendrier définitif est confirmé avant inscription.",
  },
  {
    question: "Puis-je utiliser le CPF ou un financement OPCO ?",
    answer:
      "Chaque dispositif dépend de votre situation, du parcours et des conditions du financeur. La démarche Qualiopi est en cours de finalisation et la certification n’est pas acquise. Aucune éligibilité CPF ni prise en charge OPCO n’est garantie. Contactez le centre pour étudier votre dossier.",
  },
  {
    question: "Peut-on adapter le programme à notre entreprise ?",
    answer:
      "Oui. Partagez vos objectifs, les niveaux de vos collaborateurs et vos contraintes. Le centre prépare une proposition de parcours avec les exercices, les modalités et le calendrier adaptés.",
  },
  {
    question: "Comment se déroulent les évaluations ?",
    answer:
      "Les modalités sont précisées dans le programme : exercices, mises en situation et vérification des acquis selon le parcours. Une formation ou une attestation ne constitue pas automatiquement une certification professionnelle.",
  },
  {
    question: "Comment accéder à mes cours et au formateur ?",
    answer:
      "Connectez-vous à votre espace apprenant pour retrouver les cours qui vous ont été attribués, les exercices, les quiz et les retours du formateur. Toutes les fiches du catalogue ne disposent pas encore d’un cours e-learning complet ; leur disponibilité est indiquée.",
  },
];
