const fs=require("node:fs");
const state=JSON.parse(fs.readFileSync("data/quality-readiness.json","utf8"));
const pending=state.requiredValidations.filter(v=>v.status!=="VALIDATED"||!v.evidenceReference||!v.validatedBy||!v.validatedAt);
console.log("Préparation documentaire :",pending.length ? "INCOMPLÈTE" : "À REVÉRIFIER AVANT AUDIT");
for(const p of pending)console.log("- "+p.label);
console.log("Ce contrôle de présence de justificatifs n'est pas une vérification de conformité ni un avis de certification.");
process.exitCode=pending.length?2:0;
