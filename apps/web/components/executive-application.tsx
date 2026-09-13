"use client";
import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { executiveProgrammes, executiveServices } from "@/lib/executive";
import { api } from "@/lib/learning-api";
import { TurnstileWidget } from "./turnstile-widget";
export function ExecutiveApplication({
  initialProgramme = "",
  information = false,
}: {
  initialProgramme?: string;
  information?: boolean;
}) {
  const options = [
    ...executiveProgrammes.map((p) => ({
      slug: p.slug,
      title: `${p.kind} — ${p.title}`,
    })),
    ...executiveServices.map((p) => ({
      slug: p.slug,
      title: `Accompagnement — ${p.title}`,
    })),
  ];
  const [programme, setProgramme] = useState(
      options.some((p) => p.slug === initialProgramme) ? initialProgramme : "",
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState(""),
    [token, setToken] = useState("");
  const requestKey = useRef("");
  const service = executiveServices.some((p) => p.slug === programme);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    const values = new FormData(e.currentTarget);
    if (!requestKey.current) requestKey.current = crypto.randomUUID();
    const body = {
      requestKey: requestKey.current,
      programmeSlug: programme,
      requestType: service ? "COMPANY" : String(values.get("requestType")),
      fullName: String(values.get("fullName")),
      email: String(values.get("email")),
      phone: String(values.get("phone") || ""),
      country: String(values.get("country")),
      city: String(values.get("city") || ""),
      qualification: String(values.get("qualification")),
      experience: Number(values.get("experience")),
      currentRole: String(values.get("currentRole")),
      company: String(values.get("company") || ""),
      motivation: String(values.get("motivation")),
      funding: String(values.get("funding")),
      consent: values.get("consent") === "on",
      website: String(values.get("website") || ""),
      turnstileToken: token,
    };
    try {
      const result = await api("/executive/applications", "POST", body);
      setReceipt(result.reference);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <div className="executive-receipt" role="status" tabIndex={-1}>
        <span className="executive-eyebrow">Demande enregistrée</span>
        <h2>Votre projet est entre nos mains.</h2>
        <p>
          Conservez votre référence : <strong>{receipt}</strong>.
        </p>
        <p>
          L’équipe Beyond peut maintenant consulter votre demande. L’entretien,
          les modalités et l’éventuelle admission seront confirmés après étude
          de votre dossier. Aucun paiement ni inscription définitive n’a été
          effectué.
        </p>
        <p>
          Aucun email automatique n’est envoyé pour le moment. Utilisez cette
          référence si vous contactez le centre.
        </p>
        <Link href="/mba-dba" className="button button-primary">
          Revenir aux parcours
        </Link>
      </div>
    );
  return (
    <form className="executive-form" onSubmit={submit}>
      <fieldset disabled={busy}>
        <legend>1. Votre projet</legend>
        <label>
          Parcours ou service souhaité *
          <select
            required
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
          >
            <option value="">Choisir un parcours ou un accompagnement</option>
            {options.map((p) => (
              <option value={p.slug} key={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        {!service && (
          <label>
            Votre demande *
            <select
              name="requestType"
              defaultValue={information ? "INFORMATION" : "APPLICATION"}
            >
              <option value="APPLICATION">Présenter ma candidature</option>
              <option value="INFORMATION">
                Obtenir des informations et un entretien
              </option>
              <option value="COMPANY">
                Préparer un parcours pour une équipe
              </option>
            </select>
          </label>
        )}
      </fieldset>
      <fieldset disabled={busy}>
        <legend>2. Vos coordonnées</legend>
        <div className="executive-form-grid">
          <label>
            Nom complet *
            <input
              name="fullName"
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
            />
          </label>
          <label>
            Email de réponse *
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
            />
          </label>
          <label>
            Pays de résidence *
            <input
              name="country"
              required
              minLength={2}
              maxLength={100}
              autoComplete="country-name"
            />
          </label>
          <label>
            Ville
            <input name="city" maxLength={120} autoComplete="address-level2" />
          </label>
          <label>
            Téléphone avec indicatif
            <input
              name="phone"
              type="tel"
              maxLength={40}
              autoComplete="tel"
              placeholder="+221, +212, +225, +33…"
            />
          </label>
          <label>
            Organisation
            <input name="company" maxLength={200} autoComplete="organization" />
          </label>
        </div>
      </fieldset>
      <fieldset disabled={busy}>
        <legend>3. Votre expérience et votre objectif</legend>
        <div className="executive-form-grid">
          <label>
            Dernier diplôme ou formation suivie *
            <input
              name="qualification"
              required
              minLength={2}
              maxLength={250}
            />
          </label>
          <label>
            Années d’expérience professionnelle *
            <input
              name="experience"
              type="number"
              required
              min={0}
              max={70}
              step={1}
            />
          </label>
          <label>
            Fonction ou situation actuelle *
            <input
              name="currentRole"
              required
              minLength={2}
              maxLength={200}
              autoComplete="organization-title"
            />
          </label>
          <label>
            Financement envisagé *
            <select name="funding">
              <option value="TO_DISCUSS">À étudier avec Beyond</option>
              <option value="SELF">Financement personnel</option>
              <option value="EMPLOYER">Employeur / organisation</option>
            </select>
          </label>
        </div>
        <label>
          {programme.startsWith("dba-")
            ? "Votre question de recherche et le terrain envisagé"
            : "Votre objectif et le contexte de votre projet"}{" "}
          *
          <textarea
            name="motivation"
            required
            minLength={30}
            maxLength={5000}
            rows={6}
            aria-describedby="motivation-hint"
          />
        </label>
        <p id="motivation-hint" className="executive-note">
          Au moins 30 caractères. Décrivez le problème que vous souhaitez
          traiter, vos attentes et vos contraintes. N’incluez pas de données de
          santé, de documents confidentiels ni de mots de passe.
        </p>
      </fieldset>
      <div className="executive-honeypot" aria-hidden="true">
        <label>
          Votre site web
          <input name="website" autoComplete="off" tabIndex={-1} />
        </label>
      </div>
      <label className="executive-consent">
        <input name="consent" type="checkbox" required disabled={busy} />
        <span>
          J’ai lu la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link> et
          j’accepte que Beyond utilise ces informations pour étudier ma demande
          et me recontacter à ce sujet. *
        </span>
      </label>
      <TurnstileWidget onVerify={setToken} />
      {error && (
        <p role="alert" className="executive-error">
          {error} Vos informations restent dans le formulaire.
        </p>
      )}
      <button className="button button-primary" disabled={busy} type="submit">
        {busy ? "Enregistrement en cours…" : "Envoyer ma demande"}
      </button>
      <p className="executive-note">
        Demande sans paiement ni engagement contractuel. Un accusé de réception
        et une référence s’affichent après l’enregistrement.
      </p>
    </form>
  );
}
