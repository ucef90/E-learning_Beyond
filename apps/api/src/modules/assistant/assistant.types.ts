export type KnowledgeCourse = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  audience: string;
  prerequisites: string;
  objectives: string[];
  days: number;
  hours: number;
  level: string;
  format: string;
  price: string;
  caseStudy: string;
  assessment: { format: string; durationMinutes: number; criteria: string[] };
  modules: Array<{
    day: number;
    title: string;
    topics: string[];
    details: string[];
    workshop: string;
    deliverable: string;
    check: string;
  }>;
};
export type AssistantInput = {
  message: string;
  contextSlug?: string;
  selectedSlugs?: string[];
};
export type AssistantReply = {
  answer: string;
  links: Array<{ label: string; href: string }>;
  courses: Array<{
    slug: string;
    title: string;
    facts: string;
    summary: string;
    points: string[];
    href: string;
    pdf: string;
  }>;
  selectedSlugs: string[];
  mode: "ai" | "catalogue" | "guidance";
};
export const intents = [
  "recommend",
  "compare",
  "programme",
  "prerequisites",
  "price",
  "duration",
  "session",
  "format",
  "assessment",
  "contact",
  "financing",
  "quality",
  "accessibility",
  "enrollment",
  "support",
  "privacy",
  "greeting",
  "outside",
] as const;
export type Intent = (typeof intents)[number];
export type Interpretation = { intent: Intent; terms: string };
