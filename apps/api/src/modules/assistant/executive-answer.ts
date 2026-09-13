import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalize } from "./assistant.policy";
import type { AssistantInput, AssistantReply } from "./assistant.types";
const catalogue = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "content/executive/catalogue.json"),
    "utf8",
  ),
);
export function executiveAnswer(input: AssistantInput): AssistantReply | null {
  const query = normalize(input.message);
  const contextual = catalogue.programmes.find(
    (p: any) =>
      p.slug === input.contextSlug || input.selectedSlugs?.includes(p.slug),
  );
  if (
    !/\bmba\b|\bdba\b|doctorat|doctorale|executive/.test(query) &&
    !contextual
  )
    return null;
  const doctoral = /\bdba\b|doctorat|doctorale/.test(query);
  const explicitKind = doctoral ? "DBA" : /\bmba\b/.test(query) ? "MBA" : null;
  const selected =
    contextual && (!explicitKind || contextual.kind === explicitKind)
      ? [contextual]
      : catalogue.programmes
          .filter((p: any) => p.kind === (doctoral ? "DBA" : "MBA"))
          .map((p: any) => ({
            p,
            score: query
              .split(/[^a-z0-9]+/)
              .filter(
                (w: string) =>
                  w.length > 3 &&
                  normalize(p.title + " " + p.domain).includes(w),
              ).length,
          }))
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 3)
          .map((x: any) => x.p);
  let answer = `Beyond propose 21 parcours MBA et 10 axes de recherche DBA. Les candidatures sont ouvertes pour étude du projet ; calendrier, tarif et modalités sont confirmés avant engagement.`;
  if (
    /diplom|certifi|reconnu|reconnaissance|accredit|habilitation|rncp|ects|qualiopi|grade/.test(
      query,
    )
  )
    answer =
      catalogue.credentialNote +
      " La démarche Qualiopi est en cours et n’est pas présentée comme acquise.";
  else if (/prix|tarif|cout|financ/.test(query))
    answer =
      "Les MBA et DBA sont proposés sur devis après étude du projet. Les prestations, le calendrier de paiement et les frais éventuels sont détaillés avant engagement. Aucune éligibilité CPF ni prise en charge n’est garantie.";
  else if (/duree|temps|rythme|mois/.test(query))
    answer =
      "Les rythmes cibles sont de 12 mois pour les MBA, à raison de 6 à 8 h par semaine, et de 24 à 36 mois pour les DBA, à raison de 8 à 12 h par semaine. Le calendrier définitif est confirmé par cohorte.";
  return {
    answer,
    mode: "catalogue",
    selectedSlugs: selected.map((p: any) => p.slug),
    links: [
      {
        href: doctoral ? "/dba" : "/mba",
        label: doctoral ? "Tous les axes DBA" : "Tous les parcours MBA",
      },
      { href: "/mba-dba/candidature", label: "Présenter mon projet" },
      { href: "/mba-dba/certifications", label: "Titres et certifications" },
    ],
    courses: selected.map((p: any) => ({
      slug: p.slug,
      title: `${p.kind} — ${p.title}`,
      facts: `${p.months} · rythme cible · à distance`,
      summary: p.promise,
      points: p.outcomes.slice(0, 3),
      href: `/mba-dba/${p.slug}`,
      pdf: `/programmes-executive/${p.slug}.pdf`,
    })),
  };
}
