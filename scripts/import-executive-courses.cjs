// Add original programme workbooks to the private studio; never approve or overwrite a course.
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient(),
  root = path.resolve(__dirname, "..");
const catalogue = JSON.parse(
  fs.readFileSync(path.join(root, "content/executive/catalogue.json"), "utf8"),
);
async function main() {
  const result = { created: 0, preserved: 0, lessons: 0 };
  for (const p of catalogue.programmes) {
    if (await db.course.findUnique({ where: { slug: p.slug } })) {
      result.preserved++;
      continue;
    }
    const brief = {
      objectifs: p.outcomes.join("\n"),
      public: p.audience,
      prerequis: p.admission,
      duree: `${p.months} ; ${p.pace}. Rythme cible à confirmer par cohorte. Les minutes des leçons ci-dessous concernent uniquement les trames de travail, pas la durée du parcours complet.`,
      modalites:
        "Trame originale à compléter et valider par l’équipe pédagogique avant attribution : supports de cours, activités, classes virtuelles et retours individuels.",
      evaluation: p.assessment,
      assistance:
        "Canaux et disponibilité des intervenants à confirmer dans la convention de cohorte.",
      accessibilite:
        "Adaptations à étudier lors du positionnement, avant attribution.",
      acces:
        "Sur dossier et entretien. Aucune attribution automatique à la suite d’une candidature.",
      revision:
        "Trame du 13 septembre 2026. Validation pédagogique et supports définitifs requis avant publication.",
    };
    const modules = p.modules.map((m, i) => ({
      title: m.title,
      sortOrder: i,
      lessons: {
        create: [
          {
            title: "Repères et préparation du travail",
            slug: "reperes",
            type: "TEXT",
            durationMin: 15,
            sortOrder: 0,
            content: {
              body: [
                `# ${m.title}`,
                `Ce document est une trame de préparation du parcours ${p.kind} « ${p.title} ». Le formateur doit compléter les apports, les références et les activités avant la diffusion aux apprenants.`,
                `## Situation de départ`,
                p.caseStudy,
                `## Questions et méthodes à travailler`,
                ...m.topics.map((t) => `- ${t}`),
                `## Préparer votre travail`,
                `Commencez par reformuler la situation avec vos propres mots. Distinguez les faits observables des interprétations. Notez ce que vous savez, ce qui manque et les sources nécessaires pour vérifier vos hypothèses. Choisissez un périmètre assez limité pour produire un résultat utile dans le temps disponible.`,
                `Pour chacun des thèmes du module, identifiez une décision concrète à éclairer. Expliquez les critères qui permettraient de comparer plusieurs réponses. Documentez les désaccords et les informations contradictoires plutôt que de les supprimer.`,
                `## Livrable attendu`,
                m.deliverable,
                `## Points à vérifier avant la remise`,
                `- Les sources et hypothèses sont explicites.\n- Les recommandations répondent à la question posée.\n- Les limites et risques sont présentés.\n- Les données confidentielles sont retirées ou leur usage autorisé.\n- Les usages de l’IA sont déclarés et vérifiés.`,
                `## Travail de l’équipe pédagogique`,
                `Ajouter les références et le cours de spécialité, préciser le calendrier de séance, adapter le cas à la cohorte et tester la grille d’évaluation sur un exemple de production.`,
              ].join("\n\n"),
            },
          },
          {
            title: "Atelier : construire et défendre votre livrable",
            slug: "atelier",
            type: "TEXT",
            durationMin: 30,
            sortOrder: 1,
            content: {
              body: [
                `# Atelier : ${m.title}`,
                `## Objectif`,
                m.deliverable,
                `## Étape 1 - Cadrage`,
                `Rédigez une page précisant le destinataire du livrable, la décision ou question traitée, les contraintes et les informations disponibles. Faites apparaître les autorisations nécessaires pour accéder au terrain.`,
                `## Étape 2 - Analyse`,
                `Mobilisez les méthodes du module : ${m.topics.join(" ; ")}. Comparez au moins deux interprétations ou options. Conservez une trace de vos calculs, observations et choix méthodologiques. Si des données manquent, exposez cette limite et proposez un moyen proportionné de la réduire.`,
                `## Étape 3 - Production`,
                `Préparez le livrable demandé dans un format lisible par son destinataire. Une annexe rassemble les éléments de preuve ; le document principal explique le raisonnement, les arbitrages et les limites.`,
                `## Étape 4 - Discussion et reprise`,
                `Présentez votre travail à un pair ou au formateur. Notez une objection importante, une hypothèse fragilisée et une amélioration à apporter. Joignez un court journal des corrections à la version suivante.`,
                `## Auto-évaluation`,
                `Votre livrable permet-il de comprendre le problème sans contexte oral ? Un tiers peut-il retrouver vos sources et suivre votre raisonnement ? Quelle information pourrait modifier votre conclusion ? Quelles actions recommandez-vous et sous quelles conditions ?`,
              ].join("\n\n"),
            },
          },
        ],
      },
    }));
    modules[modules.length - 1].lessons.create.push({
      title: "Consigne du travail final et critères de relecture",
      slug: "travail-final",
      type: "PDF",
      durationMin: 15,
      sortOrder: 2,
      content: {
        body: `# Travail final\n\n${p.capstone}\n\n## Modalités d’évaluation\n\n${p.assessment}\n\n## Critères de relecture\n\n1. Problématique et adéquation au terrain : 20 points.\n2. Méthode, qualité des sources et traçabilité : 25 points.\n3. Analyse et confrontation des alternatives : 25 points.\n4. Utilité, faisabilité et limites : 20 points.\n5. Présentation, intégrité et discussion : 10 points.\n\nCette grille de travail doit être finalisée et validée pour la cohorte avant attribution. Le calendrier de remise et les conditions du jury sont communiqués par le responsable pédagogique.`,
      },
    });
    const created = await db.course.create({
      data: {
        slug: p.slug,
        title: `${p.kind} — ${p.title}`,
        summary: p.promise,
        isPublished: false,
        editorialStatus: "DRAFT",
        certificateEnabled: false,
        estimatedMinutes: p.modules.length * 45 + 15,
        brief,
        resources: {
          executiveProgramme: p.slug,
          catalogueVersion: catalogue.version,
          contentScope: "WORKBOOK_DRAFT",
          assessment: {
            mode: "WRITTEN",
            passingScore: 70,
            rubric:
              "Problématique 20 ; méthode et sources 25 ; analyse 25 ; utilité et limites 20 ; présentation et intégrité 10. Grille à finaliser et valider pour la cohorte.",
          },
        },
        modules: { create: modules },
      },
    });
    assert(created.editorialStatus === "DRAFT" && !created.isPublished);
    result.created++;
    result.lessons += p.modules.length * 2 + 1;
  }
  console.log(JSON.stringify(result));
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
