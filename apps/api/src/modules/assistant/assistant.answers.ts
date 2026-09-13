import { guidance, normalize, terms } from "./assistant.policy";
import type {
  AssistantReply,
  Intent,
  KnowledgeCourse,
} from "./assistant.types";
export function publicAnswer(intent: Intent): AssistantReply | undefined {
  const items: Partial<Record<Intent, [string, string, string]>> = {
    greeting: [
      "Bonjour ! Je suis l’assistant IA de Beyond Expertise. Je peux vous aider à choisir une formation, comprendre son programme ou préparer votre échange avec le centre. Quel sujet souhaitez-vous travailler ?",
      "/formations",
      "Voir les formations",
    ],
    contact: [
      "Vous pouvez joindre Beyond Expertise au 09 54 70 23 80 ou à contact@beyondexpertise.eu. Le centre vous confirmera horaires, lieu d’accueil, dates et modalités avant tout déplacement. Le formulaire de cette version locale enregistre la demande sur ce PC ; il n’envoie pas d’email automatiquement.",
      "/contact",
      "Coordonnées et formulaire",
    ],
    financing: [
      "La présence au catalogue ne garantit pas une éligibilité CPF. Aucune éligibilité CPF n’est confirmée pour le catalogue local. Une prise en charge OPCO dépend de votre situation et de l’accord du financeur. Préparez programme, devis et calendrier avec le centre avant tout engagement.",
      "/financements",
      "Étudier le financement",
    ],
    quality: [
      "La démarche Qualiopi est en cours de finalisation ; la certification n’est pas encore acquise. Les parcours présentés ne promettent ni titre RNCP/RS ni certification officielle RGPD ou AI Act. Pour un examen externe, le centre doit confirmer certification visée, habilitations, coût et modalités.",
      "/qualite#qualiopi",
      "État de la démarche qualité",
    ],
    accessibility: [
      "Décrivez votre besoin de rythme, lisibilité, matériel ou évaluation au centre, sans diagnostic ni document médical. La faisabilité et les aménagements sont à convenir avant inscription. Les conditions d’accueil et la personne référente sont à confirmer auprès du centre.",
      "/accessibilite",
      "Demander un aménagement",
    ],
    enrollment: [
      "Choisissez une formation et indiquez au centre objectifs, niveau, participants et contraintes. Avant confirmation, il faut convenir du programme, du tarif contractuel, des dates et des documents d’inscription. Une demande locale ne réserve pas une place et n’envoie pas automatiquement d’email.",
      "/devis",
      "Préparer un devis",
    ],
    support: [
      "L’espace apprenant donne accès aux cours qui vous sont attribués, activités, travaux et retours du formateur. Je ne consulte pas votre compte ni votre progression. Pour une difficulté de connexion ou un dossier personnel, utilisez l’assistance ou contactez le centre au 09 54 70 23 80.",
      "/assistance",
      "Obtenir de l’aide",
    ],
    privacy: [
      "Cet assistant utilise les informations publiques du site. Votre message est traité par le serveur et le moteur d’IA locaux ; les conversations ne sont pas enregistrées dans une base ni transmises à un fournisseur d’IA externe par cette version. Ne communiquez pas de données sensibles. Vous pouvez effacer l’échange avec « Nouvelle conversation ».",
      "/confidentialite",
      "Données et confidentialité",
    ],
  };
  const item = items[intent];
  return item ? guidance(...item) : undefined;
}
export function nextSession(now = new Date()) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const num = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  const y = num("year"),
    m = num("month"),
    d = num("day");
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris" }).format(
    new Date(
      Date.UTC(
        y,
        m,
        Math.min(d, new Date(Date.UTC(y, m + 1, 0)).getUTCDate()),
        12,
      ),
    ),
  );
}
export function courseAnswer(
  intent: Intent,
  selected: KnowledgeCourse[],
  query: string,
  mode: AssistantReply["mode"],
): AssistantReply {
  const title = selected.length === 1 ? selected[0].title : "ces formations";
  const leads: Partial<Record<Intent, string>> = {
    programme:
      "Voici les points du programme qui correspondent à votre question. Le détail complet, les ateliers et les vérifications sont disponibles sur la fiche et dans le PDF.",
    compare:
      "Voici une comparaison des parcours à partir des informations publiées. Le bon choix dépend de votre niveau et de vos objectifs ; le centre peut confirmer le positionnement.",
    prerequisites:
      "Voici le public, le niveau et les prérequis publiés. Un positionnement avec le centre permet d’adapter le parcours.",
    price:
      "Voici les tarifs indicatifs publiés. Demandez un devis pour confirmer prix contractuel, TVA, prestations et frais éventuels.",
    duration:
      "Voici les durées pédagogiques annoncées, hors pauses. Elles comprennent apports, ateliers et évaluation.",
    format:
      "Voici les modalités annoncées. Le lieu, les horaires et les conditions de suivi sont à confirmer avec le centre.",
    session:
      "La prochaine date proposée sur le site est le " +
      nextSession() +
      ". Il s’agit d’une proposition de planning, pas d’une session réservée : date et disponibilité doivent être confirmées par le centre.",
    assessment:
      "Voici les modalités d’évaluation prévues. Elles ne constituent pas une certification officielle.",
  };
  return {
    answer:
      leads[intent] ||
      "Voici des parcours du catalogue à examiner pour votre projet. Consultez leurs prérequis et leurs programmes ; le centre vous aidera à préciser le choix.",
    links: [
      { label: "Échanger avec le centre", href: "/contact" },
      {
        label: "Demander un devis",
        href:
          "/devis?formation=" +
          encodeURIComponent(selected.length === 1 ? title : ""),
      },
    ],
    courses: selected.map((c) => {
      let points: string[] = [];
      if (intent === "prerequisites")
        points = ["Public : " + c.audience, "Prérequis : " + c.prerequisites];
      else if (intent === "assessment")
        points = [c.assessment.format, ...c.assessment.criteria.slice(0, 2)];
      else if (intent === "programme") {
        const day = normalize(query).match(/jour(?:nee)?\s*([1-9])/);
        const keys = terms(query);
        const ranked = c.modules.map((m, i) => ({
          m,
          i,
          score: keys.reduce(
            (n, t) =>
              n +
              (normalize(m.title + " " + m.details.join(" ")).includes(t)
                ? 1
                : 0),
            0,
          ),
        }));
        const modules = day
          ? c.modules.filter((m) => m.day === Number(day[1]))
          : ranked
              .sort((a, b) => b.score - a.score || a.i - b.i)
              .slice(0, 2)
              .sort((a, b) => a.i - b.i)
              .map((x) => x.m);
        points = modules.length
          ? modules.flatMap((m) => [
              "Jour " + m.day + " — " + m.title + " : " + m.details.join(" "),
              "Atelier : " + m.workshop,
            ])
          : [
              "Ce numéro de journée ne figure pas dans ce programme. Consultez le déroulé complet.",
            ];
      } else if (!["price", "duration", "format", "session"].includes(intent))
        points = c.objectives.slice(0, 3);
      return {
        slug: c.slug,
        title: c.title,
        facts:
          c.days +
          " jours · " +
          c.hours +
          " h · " +
          c.level +
          " · " +
          c.format +
          " · " +
          c.price,
        summary: c.summary,
        points,
        href: "/formations/" + c.slug,
        pdf: "/programmes/" + c.slug + ".pdf",
      };
    }),
    selectedSlugs: selected.map((c) => c.slug),
    mode,
  };
}
