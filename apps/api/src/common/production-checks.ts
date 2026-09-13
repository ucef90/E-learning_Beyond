import { PrismaService } from "./prisma.service";
export async function productionChecks(db: PrismaService) {
  if (process.env.NODE_ENV !== "production") return;
  const origin = new URL(process.env.APP_ORIGIN || "http://localhost");
  const lab = new URL(process.env.LAB_ORIGIN || "http://localhost");
  if (
    origin.protocol !== "https:" ||
    lab.protocol !== "https:" ||
    origin.hostname === lab.hostname ||
    origin.hostname.endsWith(".invalid") ||
    lab.hostname.endsWith(".invalid")
  )
    throw new Error(
      "Deux hôtes HTTPS distincts et réels sont requis pour le site et le laboratoire.",
    );
  if (process.env.COOKIE_SECURE !== "true")
    throw new Error("Cookies HTTPS requis.");
  const examples = await db.user.count({
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
  if (examples)
    throw new Error(
      "Des comptes de recette sont encore actifs. Préparez une base de production sans ces accès.",
    );
}
