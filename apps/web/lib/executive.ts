import catalogue from "../../../content/executive/catalogue.json";

export type ExecutiveModule = {
  title: string;
  topics: string[];
  deliverable: string;
};
export type ExecutiveProgramme = {
  slug: string;
  kind: "MBA" | "DBA";
  title: string;
  domain: string;
  promise: string;
  audience: string;
  caseStudy: string;
  outcomes: string[];
  modules: ExecutiveModule[];
  months: string;
  pace: string;
  admission: string;
  capstone: string;
  assessment: string;
  jobs: string[];
  methods?: string[];
};
export const executiveProgrammes = catalogue.programmes as ExecutiveProgramme[];
export const executiveServices = catalogue.services;
export const credentialNote = catalogue.credentialNote;
export const launchNote = catalogue.launchNote;
export const programmeBySlug = (slug: string) =>
  executiveProgrammes.find((p) => p.slug === slug);
export const programmeHref = (p: ExecutiveProgramme) => `/mba-dba/${p.slug}` as const;
