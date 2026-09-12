import type { UiTraining } from "./api";

function parisDateParts(now: Date) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const read = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return { year: read("year"), month: read("month"), day: read("day") };
}
/** Same calendar day next month, clamped for months with fewer days. */
export function nextMonthlySession(now = new Date()) {
  const { year, month, day } = parisDateParts(now);
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const next = new Date(Date.UTC(year, month, Math.min(day, lastDay), 12));
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris" }).format(
    next,
  );
}
/** Proposed dates are a monthly planning policy, not bookable session records. */
export function trainingPresentation(training: UiTraining, now = new Date()) {
  const publishedPrice = training.source?.observedPrice;
  const price =
    training.priceFrom !== "Sur demande"
      ? training.priceFrom
      : publishedPrice || "Sur devis";
  return {
    price,
    hasPrice: price !== "Sur devis" && price !== "Sur demande",
    session: nextMonthlySession(now),
    indicative: true,
    proposed: true,
  };
}
