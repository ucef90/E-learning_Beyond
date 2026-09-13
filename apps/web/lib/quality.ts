export const requestKinds: Record<string, string> = {
  ASSISTANCE: "Assistance",
  ACCESSIBILITY: "Aménagement et accessibilité",
  COMPLAINT: "Réclamation",
  NEEDS: "Analyse des besoins",
  SATISFACTION: "Satisfaction générale",
  TEACHING: "Évaluation des contenus",
  ALERT: "Signalement",
  DATA_RIGHTS: "Données personnelles — exercice des droits",
};
export const requestStatuses: Record<string, string> = {
  NEW: "À traiter",
  IN_PROGRESS: "En cours",
  CLOSED: "Clôturée",
};
export const reviewStatuses: Record<string, string> = {
  TO_COLLECT: "Preuves à réunir",
  IN_PROGRESS: "En préparation",
  TO_REVIEW: "À examiner",
  REVIEWED: "Examiné par le centre",
  NOT_APPLICABLE: "Non-applicabilité documentée",
};
export const stakeholderLabels: Record<string, string> = {
  LEARNER: "Apprenant ou candidat",
  TRAINER: "Formateur",
  COMPANY: "Entreprise",
  FUNDER: "Financeur",
  OTHER: "Autre partie prenante",
};
