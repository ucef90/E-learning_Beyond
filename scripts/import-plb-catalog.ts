import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import { PrismaClient, TrainingFormatCode, TrainingLevelCode } from "@prisma/client";

const ROOT_URL = "https://www.plb.fr";
const CATALOG_URL = `${ROOT_URL}/formations.php`;
const OUTPUT_DIR = path.resolve(process.cwd(), "data/imports/plb");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "catalog.json");

const SEEDED_CATEGORY_URLS = [
  `${ROOT_URL}/filiere/oracle`,
  `${ROOT_URL}/filiere/big-data-bi`,
  `${ROOT_URL}/filiere/cisco`,
  `${ROOT_URL}/filiere/cybersecurite`,
  `${ROOT_URL}/filiere/developpement-personnel`,
  `${ROOT_URL}/filiere/gestion-de-projet`,
  `${ROOT_URL}/filiere/ibm`,
  `${ROOT_URL}/filiere/intelligence-artificielle`,
  `${ROOT_URL}/filiere/developpement`,
  `${ROOT_URL}/filiere/management-si`,
  `${ROOT_URL}/filiere/formation-management`,
  `${ROOT_URL}/filiere/microsoft`,
  `${ROOT_URL}/filiere/multimedia`,
  `${ROOT_URL}/filiere/numerique-responsable`,
  `${ROOT_URL}/filiere/reseaux-telecom`,
  `${ROOT_URL}/filiere/unix-linux-macos`,
  `${ROOT_URL}/filiere/virtualisation-cloud-devops`,
  `${ROOT_URL}/filiere/web-digital`
] as const;

const PRIORITY_CATEGORY_KEYWORDS = [
  "big-data-bi",
  "intelligence-artificielle",
  "gestion-de-projet",
  "microsoft",
  "oracle",
  "developpement",
  "management-si"
] as const;

const PROJECT_AGILE_KEYWORDS = [
  "gestion-de-projet",
  "management-si",
  "agile",
  "scrum",
  "pmo",
  "product-owner",
  "product-management"
] as const;

const DATA_SPECIALIST_KEYWORDS = [
  "big-data-bi",
  "intelligence-artificielle",
  "machine-learning",
  "data",
  "bi",
  "power-bi",
  "python",
  "sql",
  "oracle",
  "postgresql"
] as const;

const PROJECT_AGILE_TRAINING_URLS = [
  `${ROOT_URL}/formation/scrum-master`,
  `${ROOT_URL}/formation/scrum-product-owner`,
  `${ROOT_URL}/formation/gestion-projet-agile`,
  `${ROOT_URL}/formation/scrum-product-owner-niveau-2`,
  `${ROOT_URL}/formation/safe-agilist`,
  `${ROOT_URL}/formation/safe-scrum-master`,
  `${ROOT_URL}/formation/product-owner`
] as const;

const DATA_SPECIALIST_TRAINING_URLS = [
  `${ROOT_URL}/formation/data-mesh`,
  `${ROOT_URL}/formation/modelisation-statistique`,
  `${ROOT_URL}/formation/manager-produit-ia`,
  `${ROOT_URL}/formation/data-scientist-fondamentaux`,
  `${ROOT_URL}/formation/data-scientist-avance`,
  `${ROOT_URL}/formation/cadrage-pilotage-projet-data-science`,
  `${ROOT_URL}/formation/industrialiser-projet-data-science`
] as const;

type PlbCategory = {
  name: string;
  slug: string;
  url: string;
  description?: string;
};

type PlbTraining = {
  sourceUrl: string;
  slug: string;
  title: string;
  reference?: string;
  categoryName?: string;
  subcategoryName?: string;
  durationDays?: number;
  level?: string;
  format?: string;
  location?: string;
  nextSession?: string;
  priceText?: string;
  priceFromCents?: number | null;
  description?: string;
  summary?: string;
  audience?: string;
  prerequisites?: string;
  objectives: string[];
  programSections: Array<{ title: string; bullets: string[] }>;
  seoTitle: string;
  seoDescription: string;
};

type CrawlResult = {
  categories: PlbCategory[];
  trainings: PlbTraining[];
  crawledAt: string;
};

const prisma = new PrismaClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toAbsoluteUrl(href?: string | null) {
  if (!href) {
    return null;
  }

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  if (href.startsWith("/")) {
    return `${ROOT_URL}${href}`;
  }

  return `${ROOT_URL}/${href}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      Referer: ROOT_URL
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function textContent(value?: string | null) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function parseDurationDays(value?: string) {
  if (!value) {
    return undefined;
  }

  const match = value.match(/(\d+)\s*jour/);
  return match ? Number(match[1]) : undefined;
}

function parsePriceToCents(price?: string) {
  if (!price) {
    return null;
  }

  if (/intra uniquement|sur demande|aucune session/i.test(price)) {
    return null;
  }

  const normalized = price.replace(/\s/g, "").replace("€HT", "").replace("€", "").replace(",", ".");
  const amount = Number(normalized);

  if (Number.isNaN(amount)) {
    return null;
  }

  return Math.round(amount * 100);
}

function mapFormat(value?: string) {
  const raw = (value || "").toLowerCase();

  if (raw.includes("présentiel") && raw.includes("distanciel")) {
    return TrainingFormatCode.HYBRID;
  }
  if (raw.includes("présentiel")) {
    return TrainingFormatCode.ONSITE;
  }
  if (raw.includes("distanciel") || raw.includes("classe virtuelle")) {
    return TrainingFormatCode.REMOTE;
  }
  if (raw.includes("e-learning")) {
    return TrainingFormatCode.ELEARNING;
  }

  return TrainingFormatCode.HYBRID;
}

function mapLevel(value?: string) {
  const raw = (value || "").toLowerCase();

  if (raw.includes("fondamental") || raw.includes("initiation") || raw.includes("debutant")) {
    return TrainingLevelCode.FOUNDATION;
  }
  if (raw.includes("interm")) {
    return TrainingLevelCode.INTERMEDIATE;
  }
  if (raw.includes("avance")) {
    return TrainingLevelCode.ADVANCED;
  }
  if (raw.includes("expert")) {
    return TrainingLevelCode.EXPERT;
  }

  return TrainingLevelCode.INTERMEDIATE;
}

function rewriteSummary(title: string, description?: string) {
  const base = textContent(description);

  if (!base) {
    return `${title} : une formation professionnelle conçue pour développer des compétences directement mobilisables en entreprise.`;
  }

  return `${title} permet de structurer une montée en compétence opérationnelle autour des usages, méthodes et bonnes pratiques attendus sur le terrain. ${base}`;
}

function buildSeoDescription(title: string, summary: string, audience?: string) {
  const parts = [
    `${title} avec Beyond Expertise`,
    "formation professionnelle structurée, orientée pratique et résultats",
    audience ? `public : ${audience}` : null
  ].filter(Boolean);

  return `${parts.join(" • ")}. ${summary}`.slice(0, 300);
}

function extractTrainingLinksFromCategory(html: string) {
  const $ = cheerio.load(html);
  const urls = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    const url = toAbsoluteUrl(href);

    if (!url) {
      return;
    }

    if (url.includes("/formation/") && !url.includes("/filiere/") && !url.includes("/categorie/")) {
      urls.add(url);
    }
  });

  const regex = /\/formation\/[a-z0-9\-/%]+/gi;
  const matches = html.match(regex) || [];
  for (const match of matches) {
    urls.add(toAbsoluteUrl(match) as string);
  }

  return [...urls];
}

function extractCategoryLinks(html: string) {
  const $ = cheerio.load(html);
  const categories: PlbCategory[] = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    const url = toAbsoluteUrl(href);
    const label = textContent($(element).text());

    if (!url || !label) {
      return;
    }

    if (url.includes("/filiere/")) {
      categories.push({
        name: label.replace(/\s+\d+\s+formation\s*s?$/i, "").trim(),
        slug: slugify(label.replace(/\s+\d+\s+formation\s*s?$/i, "").trim()),
        url
      });
    }
  });

  const regex = /\/filiere\/[a-z0-9\-/%]+/gi;
  const matches = html.match(regex) || [];
  for (const match of matches) {
    const url = toAbsoluteUrl(match);
    if (!url) {
      continue;
    }
    const segment = match.split("/").pop() || "categorie";
    categories.push({
      name: segment.replace(/-/g, " "),
      slug: slugify(segment),
      url
    });
  }

  return unique(categories.map((item) => JSON.stringify(item))).map((item) => JSON.parse(item) as PlbCategory);
}

function extractLabeledValue($: cheerio.CheerioAPI, label: string) {
  const bodyText = $("body").text();
  const normalized = bodyText.replace(/\s+/g, " ");
  const pattern = new RegExp(`${label}\\s*:?\\s*([^:\\n]+?)(?=\\s+[A-ZÉÈÀÙÂÊÎÔÛ][^:]{1,50}:|$)`, "i");
  const match = normalized.match(pattern);

  return match ? textContent(match[1]) : undefined;
}

function extractProgramSections($: cheerio.CheerioAPI) {
  const sections: Array<{ title: string; bullets: string[] }> = [];
  let programStarted = false;
  let currentTitle: string | null = null;
  let currentBullets: string[] = [];

  $("h2, h3, li, p").each((_, element) => {
    const tag = element.tagName.toLowerCase();
    const text = textContent($(element).text());

    if (!text) {
      return;
    }

    if (tag === "h2" && /programme de la formation|contenu du cours/i.test(text)) {
      programStarted = true;
      return;
    }

    if (!programStarted) {
      return;
    }

    if (tag === "h2" && !/programme|contenu/i.test(text)) {
      if (currentTitle || currentBullets.length) {
        sections.push({
          title: currentTitle || "Programme",
          bullets: currentBullets
        });
      }
      programStarted = false;
      currentTitle = null;
      currentBullets = [];
      return;
    }

    if (tag === "h3") {
      if (currentTitle || currentBullets.length) {
        sections.push({
          title: currentTitle || "Programme",
          bullets: currentBullets
        });
      }
      currentTitle = text;
      currentBullets = [];
      return;
    }

    if (tag === "li") {
      currentBullets.push(text);
    }
  });

  if (currentTitle || currentBullets.length) {
    sections.push({
      title: currentTitle || "Programme",
      bullets: currentBullets
    });
  }

  return sections.filter((section) => section.title || section.bullets.length);
}

function extractObjectives($: cheerio.CheerioAPI) {
  const objectives: string[] = [];
  let collecting = false;

  $("h2, h3, li, p").each((_, element) => {
    const tag = element.tagName.toLowerCase();
    const text = textContent($(element).text());

    if (!text) {
      return;
    }

    if ((tag === "h2" || tag === "h3") && /objectifs? pédagogiques/i.test(text)) {
      collecting = true;
      return;
    }

    if (collecting && (tag === "h2" || tag === "h3") && !/objectifs?/i.test(text)) {
      collecting = false;
      return;
    }

    if (collecting && tag === "li") {
      objectives.push(text);
    }
  });

  return objectives;
}

function extractMetaContent(html: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<meta[^>]+(?:name|property)="${escaped}"[^>]+content="([^"]+)"`, "i"));
  return match ? textContent(match[1]) : undefined;
}

function parseTraining(html: string, sourceUrl: string, fallbackCategoryName?: string): PlbTraining {
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ");
  const metaTitle = extractMetaContent(html, "og:title") || extractMetaContent(html, "twitter:title");
  const metaDescription = extractMetaContent(html, "description");
  const title =
    textContent($("h1").first().text()) ||
    textContent(metaTitle).replace(/^Formation\s+/i, "").replace(/\s*\|\s*PLB.*/, "");
  const reference =
    html.match(/REF\s*:\s*\\?",\\?"([A-Z0-9]+)/i)?.[1] ||
    bodyText.match(/REF\s*:\s*([A-Z0-9]+)/i)?.[1];
  const categoryName = fallbackCategoryName;
  const descriptionMatch = bodyText.match(/Description de la formation[^A-Za-z0-9]+(.+?)Programme de la formation/i);
  const description = metaDescription || (descriptionMatch ? textContent(descriptionMatch[1]) : undefined);
  const objectives = extractObjectives($);
  const programSections = extractProgramSections($);
  const duration = extractLabeledValue($, "Durée");
  const level = extractLabeledValue($, "Niveau");
  const location = extractLabeledValue($, "Lieu");
  const format = extractLabeledValue($, "Format");
  const nextSession = bodyText.match(/Prochaine session(?: garantie)?\s*:\s*([0-9/]+)/i)?.[1];
  const priceText = bodyText.match(/([0-9\s.,]+€\s*HT|Intra uniquement)/i)?.[1];
  const summary = rewriteSummary(title, description);
  const audience = bodyText.match(/Public[^A-Za-z0-9]+(.+?)Prérequis/i)?.[1];
  const prerequisites = bodyText.match(/Prérequis[^A-Za-z0-9]+(.+?)(Programme|Description)/i)?.[1];

  return {
    sourceUrl,
    slug: slugify(reference ? `${reference}-${title}` : title),
    title,
    reference,
    categoryName,
    durationDays: parseDurationDays(duration),
    level,
    format,
    location,
    nextSession,
    priceText,
    priceFromCents: parsePriceToCents(priceText),
    description,
    summary,
    audience: audience ? textContent(audience) : undefined,
    prerequisites: prerequisites ? textContent(prerequisites) : undefined,
    objectives,
    programSections,
    seoTitle: `${title} | Beyond Expertise`,
    seoDescription: buildSeoDescription(title, summary, audience ? textContent(audience) : undefined)
  };
}

function getArgValue(flag: string) {
  const index = process.argv.findIndex((value) => value === flag);
  if (index === -1) {
    return null;
  }

  return process.argv[index + 1] ?? null;
}

async function crawlPlbCatalog(): Promise<CrawlResult> {
  let catalogHtml: string;

  try {
    catalogHtml = await fetchHtml(CATALOG_URL);
  } catch {
    catalogHtml = await fetchHtml(ROOT_URL);
  }
  let categoryCandidates = [
    ...extractCategoryLinks(catalogHtml),
    ...SEEDED_CATEGORY_URLS.map((url) => ({
      name: url.split("/").pop()?.replace(/-/g, " ") || "categorie",
      slug: slugify(url.split("/").pop() || "categorie"),
      url
    }))
  ];

  if (process.argv.includes("--priority-only")) {
    categoryCandidates = categoryCandidates.filter((category) =>
      PRIORITY_CATEGORY_KEYWORDS.some((keyword) => category.url.includes(keyword) || category.slug.includes(keyword))
    );
  }

  if (process.argv.includes("--project-agile-only")) {
    categoryCandidates = categoryCandidates.filter((category) =>
      PROJECT_AGILE_KEYWORDS.some((keyword) => category.url.includes(keyword) || category.slug.includes(keyword))
    );
  }

  if (process.argv.includes("--data-specialist-only")) {
    categoryCandidates = categoryCandidates.filter((category) =>
      DATA_SPECIALIST_KEYWORDS.some((keyword) => category.url.includes(keyword) || category.slug.includes(keyword))
    );
  }
  const categories: PlbCategory[] = [];
  const trainingUrls = new Set<string>();
  const trainingCategoryMap = new Map<string, string>();

  if (process.argv.includes("--project-agile-only")) {
    PROJECT_AGILE_TRAINING_URLS.forEach((url) => {
      trainingUrls.add(url);
      trainingCategoryMap.set(url, "gestion de projet");
    });
  }

  if (process.argv.includes("--data-specialist-only")) {
    DATA_SPECIALIST_TRAINING_URLS.forEach((url) => {
      trainingUrls.add(url);
      trainingCategoryMap.set(url, "data science");
    });
  }

  const categoryLimit = Number(getArgValue("--category-limit") || categoryCandidates.length);
  const trainingLimit = Number(getArgValue("--training-limit") || 0);

  for (const category of categoryCandidates.slice(0, categoryLimit)) {
    categories.push(category);

    try {
      const html = await fetchHtml(category.url);
      const subCategories = extractCategoryLinks(html);

      for (const subCategory of subCategories) {
        categories.push(subCategory);
      }

      extractTrainingLinksFromCategory(html).forEach((url) => {
        trainingUrls.add(url);
        if (!trainingCategoryMap.has(url)) {
          trainingCategoryMap.set(url, category.name);
        }
      });
      await sleep(300);
    } catch (error) {
      console.warn(`Category crawl failed for ${category.url}`, error);
    }
  }

  const trainings: PlbTraining[] = [];
  const urls = [...trainingUrls];
  const selectedUrls = trainingLimit > 0 ? urls.slice(0, trainingLimit) : urls;

  for (let index = 0; index < selectedUrls.length; index += 1) {
    const url = selectedUrls[index];

    try {
      const html = await fetchHtml(url);
      trainings.push(parseTraining(html, url, trainingCategoryMap.get(url)));
      console.log(`Crawled ${index + 1}/${selectedUrls.length}: ${url}`);
      await sleep(250);
    } catch (error) {
      console.warn(`Training crawl failed for ${url}`, error);
    }
  }

  return {
    categories: unique(categories.map((item) => JSON.stringify(item))).map((item) => JSON.parse(item) as PlbCategory),
    trainings,
    crawledAt: new Date().toISOString()
  };
}

async function writeSnapshot(data: CrawlResult) {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function importIntoDatabase(data: CrawlResult) {
  const categoryMap = new Map<string, string>();

  for (const category of data.categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description
      }
    });

    categoryMap.set(category.name, created.id);
  }

  for (const training of data.trainings) {
    const categoryId =
      (training.categoryName && categoryMap.get(training.categoryName)) ||
      categoryMap.get("informatique") ||
      null;

    const created = await prisma.training.upsert({
      where: {
        slug: training.slug
      },
      update: {
        reference: training.reference,
        title: training.title,
        summary: training.summary || training.title,
        description: training.description,
        objectives: training.objectives,
        audience: training.audience,
        prerequisites: training.prerequisites,
        program: training.programSections,
        durationDays: training.durationDays || 2,
        level: mapLevel(training.level),
        format: mapFormat(training.format),
        priceFromCents: training.priceFromCents,
        isPublished: true
      },
      create: {
        slug: training.slug,
        reference: training.reference,
        title: training.title,
        summary: training.summary || training.title,
        description: training.description,
        objectives: training.objectives,
        audience: training.audience,
        prerequisites: training.prerequisites,
        program: training.programSections,
        durationDays: training.durationDays || 2,
        level: mapLevel(training.level),
        format: mapFormat(training.format),
        priceFromCents: training.priceFromCents,
        isPublished: true
      }
    });

    if (categoryId) {
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
    }

    if (training.nextSession) {
      const [day, month, year] = training.nextSession.split("/");
      const startDate = new Date(`${year}-${month}-${day}T09:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setUTCDate(endDate.getUTCDate() + Math.max((training.durationDays || 1) - 1, 0));

      await prisma.trainingSession.upsert({
        where: {
          sessionCode: `${created.slug}-${training.nextSession}`
        },
        update: {
          startDate,
          endDate,
          city: training.location || "Paris",
          status: "OPEN"
        },
        create: {
          trainingId: created.id,
          sessionCode: `${created.slug}-${training.nextSession}`,
          status: "OPEN",
          startDate,
          endDate,
          city: training.location || "Paris"
        }
      });
    }
  }
}

async function main() {
  const shouldImport = process.argv.includes("--import");
  const result = await crawlPlbCatalog();
  await writeSnapshot(result);

  console.log(`Snapshot written to ${OUTPUT_FILE}`);
  console.log(`Categories found: ${result.categories.length}`);
  console.log(`Trainings found: ${result.trainings.length}`);

  if (shouldImport) {
    await importIntoDatabase(result);
    console.log("PLB catalog imported into Beyond Expertise.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
