"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { executiveProgrammes } from "@/lib/executive";
import { api } from "@/lib/learning-api";
import { attribution, conversion, track } from "@/lib/campaign-tracking";
import { TurnstileWidget } from "./turnstile-widget";
export const leadIntents: Record<string, string> = {
  BROCHURE: "Recevoir la brochure",
  TARIFF: "Demander les tarifs",
  ADVICE: "Parler à un conseiller",
  CALLBACK: "Être rappelé / organiser un rendez-vous",
};
export function CampaignLeadForm({
  initialProgramme = "",
  initialIntent = "BROCHURE",
}: {
  initialProgramme?: string;
  initialIntent?: string;
}) {
  const router = useRouter(),
    [programme, setProgramme] = useState(
      executiveProgrammes.some((p) => p.slug === initialProgramme)
        ? initialProgramme
        : "",
    ),
    [intent, setIntent] = useState(
      leadIntents[initialIntent] ? initialIntent : "BROCHURE",
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [token, setToken] = useState("");
  const key = useRef(""),
    started = useRef(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    key.current ||= crypto.randomUUID();
    try {
      const result = await api("/campaigns/leads", "POST", {
        requestKey: key.current,
        programmeSlug: programme,
        intent,
        fullName: f.get("fullName"),
        email: f.get("email"),
        country: f.get("country"),
        phone: f.get("phone") || "",
        preferredTime: f.get("preferredTime") || "",
        contactConsent: f.get("contactConsent") === "on",
        website: f.get("website") || "",
        attribution: attribution(),
        turnstileToken: token,
      });
      try {
        sessionStorage.setItem(
          "beyond-lead-receipt",
          JSON.stringify({ requestKey: key.current, ...result }),
        );
      } catch {}
      conversion("generate_lead", key.current, programme);
      router.push("/mba-dba/merci");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      className="campaign-form"
      onSubmit={submit}
      onFocus={() => {
        if (!started.current) {
          track("form_start", programme || undefined);
          started.current = true;
        }
      }}
    >
      <fieldset disabled={busy}>
        <legend>Votre projet, en quelques mots</legend>
        <label>
          Programme souhaité *
          <select
            required
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            name="programmeSlug"
          >
            <option value="">Choisissez votre programme</option>
            {executiveProgrammes.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.kind} — {p.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Votre demande *
          <select
            name="intent"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          >
            {Object.entries(leadIntents).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <div className="campaign-form-grid">
          <label>
            Nom et prénom *
            <input
              name="fullName"
              autoComplete="name"
              minLength={2}
              maxLength={120}
              required
            />
          </label>
          <label>
            Email *
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
            />
          </label>
          <label>
            Pays de résidence *
            <input
              name="country"
              autoComplete="country-name"
              list="campaign-countries"
              minLength={2}
              maxLength={100}
              required
            />
            <datalist id="campaign-countries">
              {[
                "Algérie",
                "Bénin",
                "Burkina Faso",
                "Cameroun",
                "Congo",
                "Côte d’Ivoire",
                "France",
                "Gabon",
                "Guinée",
                "Madagascar",
                "Mali",
                "Maroc",
                "Maurice",
                "Mauritanie",
                "Niger",
                "République démocratique du Congo",
                "Rwanda",
                "Sénégal",
                "Tchad",
                "Togo",
                "Tunisie",
              ].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label>
            Téléphone avec indicatif{" "}
            {intent === "CALLBACK" ? "*" : "(facultatif)"}
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+221 …"
              maxLength={40}
              required={intent === "CALLBACK"}
            />
          </label>
        </div>
        {intent === "CALLBACK" && (
          <label>
            Vos disponibilités et votre fuseau horaire
            <input
              name="preferredTime"
              maxLength={180}
              placeholder="Ex. mardi 15 h–17 h, heure de Dakar"
            />
            <small>
              Il s’agit d’une demande : le conseiller confirmera le créneau avec
              vous.
            </small>
          </label>
        )}
        <div className="campaign-trap" aria-hidden="true">
          <label>
            Site internet
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="campaign-check">
          <input type="checkbox" name="contactConsent" required />
          <span>
            Je demande à Beyond Expertise de me recontacter au sujet de ce
            programme, par email ou, si renseigné, par téléphone. J’ai lu la{" "}
            <a href="/confidentialite" target="_blank">
              politique de confidentialité
            </a>
            .
          </span>
        </label>
        <small>
          Aucune inscription à une newsletter. Demande sans paiement ni
          engagement. * Champs obligatoires.
        </small>
        <TurnstileWidget onVerify={setToken} onExpire={() => setToken("")} />
        {error && (
          <p role="alert" className="campaign-error">
            {error}
          </p>
        )}
        <button className="button button-accent" type="submit">
          {busy ? "Enregistrement…" : leadIntents[intent]}
        </button>
        <small>
          La brochure sera disponible sur la page de confirmation. Pour les
          tarifs et le rappel, un conseiller traitera votre demande.
        </small>
      </fieldset>
    </form>
  );
}
