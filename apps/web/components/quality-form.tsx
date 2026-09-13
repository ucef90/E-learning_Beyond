"use client";
import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/learning-api";
import { requestKinds, stakeholderLabels } from "@/lib/quality";
import { TurnstileWidget } from "./turnstile-widget";
export function QualityForm({
  kinds,
  initialContext = "",
}: {
  kinds: string[];
  initialContext?: string;
}) {
  const [kind, setKind] = useState(kinds[0]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState<any>(null),
    [token, setToken] = useState("");
  const key = useRef("");
  const locked = useRef(false);
  const scoring = ["SATISFACTION", "TEACHING"].includes(kind);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const f = new FormData(form);
    if (!key.current) key.current = crypto.randomUUID();
    const data = {
      requestKey: key.current,
      kind,
      fullName: String(f.get("fullName")),
      email: String(f.get("email")),
      stakeholder:
        kind === "TEACHING"
          ? "LEARNER"
          : kind === "DATA_RIGHTS"
            ? "OTHER"
            : String(f.get("stakeholder")),
      context: String(f.get("context") || ""),
      message: String(f.get("message")),
      website: String(f.get("website") || ""),
      turnstileToken: token,
      ...(kind === "NEEDS"
        ? { currentLevel: String(f.get("currentLevel")) }
        : {}),
      ...(scoring ? { rating: Number(f.get("rating")) } : {}),
    };
    try {
      const saved = await api("/quality/requests", "POST", data);
      setReceipt(saved);
      form.reset();
      key.current = "";
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      locked.current = false;
    }
  }
  if (receipt)
    return (
      <div className="quality-card quality-receipt" role="status">
        <h2>Votre demande est enregistrée</h2>
        <p>
          Référence à conserver : <strong>{receipt.reference}</strong>
        </p>
        <p>
          Le {new Date(receipt.createdAt).toLocaleString("fr-FR")}. Cette copie
          locale conserve votre demande dans le registre du centre. Aucun email
          n’a été envoyé automatiquement.
        </p>
        <p>
          Pour une réponse du centre, utilisez ses coordonnées en haut de page
          en indiquant cette référence.
        </p>
        <button
          className="button button-secondary"
          onClick={() => {
            setReceipt(null);
            setToken("");
          }}
        >
          Faire une autre demande
        </button>
      </div>
    );
  return (
    <form
      className="quality-card quality-form"
      onSubmit={submit}
      aria-busy={busy}
    >
      <div>
        <h2>{kinds.length > 1 ? "Votre demande" : requestKinds[kind]}</h2>
        <p>
          Les champs marqués * sont nécessaires. Ne joignez pas de données
          médicales, de mot de passe ou de document confidentiel.
        </p>
      </div>
      <p className="quality-note">
        Version locale : la demande est enregistrée sur cet ordinateur pour le
        suivi administratif. Elle ne déclenche pas d’email au centre.
      </p>
      {kinds.length > 1 && (
        <label>
          Objet de votre demande *
          <select
            className="input"
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              key.current = "";
              setToken("");
              setError("");
            }}
          >
            {kinds.map((k) => (
              <option key={k} value={k}>
                {requestKinds[k]}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="quality-grid">
        <label>
          {kind === "DATA_RIGHTS"
            ? "Nom ou identifiant du compte *"
            : "Nom complet *"}
          <input
            className="input"
            name="fullName"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
          />
        </label>
        <label>
          Email de réponse *
          <input
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
      </div>
      {!["TEACHING", "DATA_RIGHTS"].includes(kind) && (
        <label>
          Vous êtes *
          <select className="input" name="stakeholder" required>
            {Object.entries(stakeholderLabels).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        Formation, session ou demande concernée{" "}
        {["NEEDS", "SATISFACTION", "TEACHING"].includes(kind)
          ? "*"
          : "(facultatif)"}
        <input
          className="input"
          name="context"
          defaultValue={initialContext}
          maxLength={240}
          required={["NEEDS", "SATISFACTION", "TEACHING"].includes(kind)}
        />
      </label>
      {kind === "NEEDS" && (
        <label>
          Votre niveau actuel sur le sujet *
          <select
            className="input"
            name="currentLevel"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Choisir mon niveau
            </option>
            <option value="BEGINNER">Je découvre</option>
            <option value="BASIC">J’ai quelques bases</option>
            <option value="PRACTICED">Je pratique régulièrement</option>
            <option value="ADVANCED">J’ai une pratique avancée</option>
          </select>
        </label>
      )}
      {scoring && (
        <fieldset>
          <legend>
            {kind === "TEACHING"
              ? "Clarté et utilité des contenus pédagogiques *"
              : "Votre satisfaction globale *"}
          </legend>
          <div className="quality-rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n}>
                <input type="radio" name="rating" value={n} required />
                {n}
              </label>
            ))}
          </div>
          <p>1 = très insatisfaisant · 5 = très satisfaisant</p>
        </fieldset>
      )}
      <label>
        {kind === "NEEDS"
          ? "Vos objectifs, votre expérience et vos contraintes *"
          : kind === "TEACHING"
            ? "Quels contenus, exercices ou explications faut-il améliorer ? *"
            : kind === "COMPLAINT" || kind === "ALERT"
              ? "Les faits, leur date et la suite que vous attendez *"
              : kind === "ACCESSIBILITY"
                ? "Les difficultés d’accès et les aménagements souhaités (sans diagnostic médical) *"
                : scoring
                  ? "Ce qui vous a aidé et ce qui doit être amélioré *"
                  : "Décrivez votre besoin et la difficulté rencontrée *"}
        <textarea
          className="textarea"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
        />
      </label>
      <label className="quality-honeypot" aria-hidden="true">
        Site web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="quality-note">
        Ces informations servent à traiter votre demande et sont consultables
        par les administrateurs habilités.{" "}
        <Link href="/confidentialite">
          Informations sur vos données et vos droits
        </Link>
        .
      </p>
      <TurnstileWidget
        key={kind}
        onVerify={setToken}
        onExpire={() => setToken("")}
      />
      {error && (
        <p role="alert" className="quality-error">
          {error}
        </p>
      )}
      <button
        className="button button-primary"
        disabled={
          busy || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)
        }
      >
        {busy ? "Enregistrement…" : "Enregistrer ma demande"}
      </button>
    </form>
  );
}
