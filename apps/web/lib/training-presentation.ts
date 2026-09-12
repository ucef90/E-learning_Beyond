import type { UiTraining } from "./api";

/** Captured public dates are indicative; they do not create bookable LMS sessions. */
export function trainingPresentation(training: UiTraining, now = new Date()) {
  const publishedPrice = training.source?.observedPrice;
  const price =
    training.priceFrom !== "Sur demande"
      ? training.priceFrom
      : publishedPrice || "Sur devis";
  const dates =
    (training.source?.observedSessions || "").match(/\d{2}\/\d{2}\/\d{4}/g) ||
    [];
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const future = dates
    .map((label) => {
      const [d, m, y] = label.split("/").map(Number);
      return { label, time: new Date(y, m - 1, d).getTime() };
    })
    .filter((d) => d.time >= today)
    .sort((a, b) => a.time - b.time);
  const confirmed = training.nextSession !== "Planification à venir";
  return {
    price,
    hasPrice: price !== "Sur devis" && price !== "Sur demande",
    session: confirmed
      ? training.nextSession
      : future[0]?.label || "Nous consulter",
    indicative: !confirmed && future.length > 0,
  };
}
