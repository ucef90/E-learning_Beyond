const fs = require("node:fs"),
  { PrismaClient } = require("@prisma/client");
async function main() {
  const errors = [];
  function check(value, message) {
    if (!value) errors.push(message);
  }
  const app = process.env.APP_ORIGIN || "",
    lab = process.env.LAB_ORIGIN || "";
  let a, l;
  try {
    a = new URL(app);
    l = new URL(lab);
  } catch {
    errors.push("Origines site/laboratoire absentes");
  }
  check(
    a &&
      l &&
      a.protocol === "https:" &&
      l.protocol === "https:" &&
      a.hostname !== l.hostname,
    "Deux hôtes HTTPS distincts requis",
  );
  check(
    ![app, lab, process.env.DATABASE_URL || ""].some(
      (v) => v.includes("example.invalid") || v.includes("CHANGE_ME"),
    ),
    "Valeurs d'exemple à remplacer",
  );
  check(process.env.COOKIE_SECURE === "true", "COOKIE_SECURE=true requis");
  check(
    ["true", "false"].includes(process.env.PREPRODUCTION || ""),
    "Statut préproduction explicite requis",
  );
  check(
    process.env.SITE_URL === app,
    "SITE_URL doit correspondre à APP_ORIGIN",
  );
  for (const file of [
    "apps/api/dist/main.js",
    "apps/web/.next/BUILD_ID",
    "apps/web/public/lab-assets/manifest.json",
  ])
    check(fs.existsSync(file), "Fichier de build absent : " + file);
  if (!errors.length) {
    const db = new PrismaClient();
    try {
      await db.$queryRawUnsafe("SELECT 1");
      const demos = await db.user.count({
        where: {
          status: { not: "SUSPENDED" },
          OR: [
            { email: { endsWith: ".invalid", mode: "insensitive" } },
            { email: { endsWith: "@example.com", mode: "insensitive" } },
            { email: { endsWith: "@example.net", mode: "insensitive" } },
            { email: { endsWith: "@example.org", mode: "insensitive" } },
          ],
        },
      });
      check(
        demos === 0,
        "Comptes de recette actifs à retirer du périmètre de production",
      );
      const admin = await db.user.count({
        where: {
          status: "ACTIVE",
          passwordHash: { not: null },
          roles: { some: { role: { code: "ADMIN" } } },
        },
      });
      check(admin > 0, "Un compte administrateur réel doit être opérationnel");
      const unreviewed = await db.course.count({
        where: {
          isPublished: true,
          OR: [{ editorialStatus: { not: "APPROVED" } }, { reviewedAt: null }],
        },
      });
      check(
        unreviewed === 0,
        "Cours publiés sans validation humaine enregistrée",
      );
    } catch {
      errors.push("Connexion ou schéma de base non valide");
    } finally {
      await db.$disconnect();
    }
  }
  console.log(
    JSON.stringify(
      {
        status: errors.length ? "BLOCKED" : "PASS",
        errors,
        scope:
          "Contrôle technique ; ne valide pas les décisions légales, DNS, TLS, SMTP ou pédagogiques.",
      },
      null,
      2,
    ),
  );
  if (errors.length) process.exitCode = 2;
}
main().catch(() => {
  console.error("Contrôle impossible");
  process.exitCode = 1;
});
