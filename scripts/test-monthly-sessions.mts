import assert from "node:assert/strict";
import {
  nextMonthlySession,
  trainingPresentation,
} from "../apps/web/lib/training-presentation.ts";

const cases = [
  ["2026-09-12T12:00:00Z", "12/10/2026"],
  ["2026-01-31T12:00:00Z", "28/02/2026"],
  ["2028-01-31T12:00:00Z", "29/02/2028"],
  ["2026-03-31T12:00:00Z", "30/04/2026"],
  ["2026-12-31T12:00:00Z", "31/01/2027"],
  ["2026-09-30T22:30:00Z", "01/11/2026"],
  ["2026-01-31T23:30:00Z", "01/03/2026"],
];
for (const [input, expected] of cases)
  assert.equal(nextMonthlySession(new Date(input)), expected, input);
const fixture = {
  priceFrom: "Sur demande",
  source: { observedPrice: "1 790 € HT", observedSessions: ["12/09/2026"] },
} as Parameters<typeof trainingPresentation>[0];
const presentation = trainingPresentation(
  fixture,
  new Date("2026-09-12T12:00:00Z"),
);
assert.equal(presentation.session, "12/10/2026");
assert.equal(presentation.price, "1 790 € HT");
assert.equal(presentation.proposed, true);
assert.equal(
  trainingPresentation({ priceFrom: "Sur demande" } as Parameters<
    typeof trainingPresentation
  >[0]).price,
  "Sur devis",
);
console.log(
  JSON.stringify({
    status: "PASS",
    calendarCases: cases.length,
    scope:
      "Europe/Paris, mois courts, année bissextile, changement d’année, tarif",
  }),
);
