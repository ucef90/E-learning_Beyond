"use client";

import { FormEvent, useState } from "react";
import { TurnstileWidget } from "@/components/turnstile-widget";

const API_URL = "/api/v1";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type FormStatus = {
  type: "idle" | "success" | "error";
  message?: string;
};

async function submitForm<T>(path: string, payload: T) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "La demande n'a pas pu être envoyée.");
  }

  return data;
}

function FormFeedback({ status }: { status: FormStatus }) {
  if (status.type === "idle") {
    return null;
  }

  return (
    <p
      role={status.type === "error" ? "alert" : "status"}
      style={{
        margin: 0,
        padding: "12px 14px",
        borderRadius: 14,
        background:
          status.type === "success"
            ? "rgba(47, 133, 90, 0.12)"
            : "rgba(194, 65, 12, 0.12)",
        color: status.type === "success" ? "#22603e" : "#9a3412",
        fontWeight: 600,
      }}
    >
      {status.message}
    </p>
  );
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitForm("/contacts", {
        fullName: String(formData.get("fullName") || ""),
        email: String(formData.get("email") || ""),
        company: String(formData.get("company") || ""),
        message: String(formData.get("message") || ""),
        turnstileToken,
      });

      form.reset();
      setStatus({
        type: "success",
        message:
          "Votre demande a été enregistrée et peut être consultée par l’équipe Beyond. Aucun email automatique n’a été envoyé.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <label>
        Nom complet *
        <input
          className="input"
          name="fullName"
          placeholder="Nom complet"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
        />
      </label>
      <label>
        Email de réponse *
        <input
          className="input"
          name="email"
          type="email"
          placeholder="Email professionnel"
          required
          maxLength={254}
          autoComplete="email"
        />
      </label>
      <label>
        Entreprise (facultatif)
        <input
          className="input"
          name="company"
          placeholder="Entreprise"
          maxLength={200}
        />
      </label>
      <label>
        Votre besoin *
        <textarea
          className="textarea"
          name="message"
          placeholder="Votre besoin"
          required
          minLength={10}
          maxLength={5000}
        />
      </label>
      <p>
        Vos informations servent à traiter votre demande et sont accessibles aux
        administrateurs habilités.{" "}
        <a href="/confidentialite">Données personnelles et droits</a>.
      </p>
      <p>
        Les données de ce formulaire servent à traiter votre demande, sans
        abonnement publicitaire automatique. N’indiquez pas de données
        sensibles. <a href="/confidentialite">Données personnelles</a> ·{" "}
        <a href="/vos-droits">Vos droits</a>. Cette copie enregistre localement,
        sans email automatique.
      </p>
      <TurnstileWidget
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
      />
      {TURNSTILE_SITE_KEY && !turnstileToken ? (
        <p className="turnstile-hint">
          Merci de valider la protection anti-spam avant l'envoi.
        </p>
      ) : null}
      <FormFeedback status={status} />
      <button
        type="submit"
        className="button button-primary"
        disabled={
          isSubmitting || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)
        }
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
    </form>
  );
}

export function QuoteForm({
  initialTrainingTitle = "",
}: {
  initialTrainingTitle?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitForm("/quotes", {
        companyName: String(formData.get("companyName") || ""),
        contactName: String(formData.get("contactName") || ""),
        email: String(formData.get("email") || ""),
        requestedMode: String(formData.get("requestedMode") || ""),
        participants: Number(formData.get("participants") || 1),
        brief: String(formData.get("brief") || ""),
        turnstileToken,
      });

      form.reset();
      setStatus({
        type: "success",
        message:
          "Votre demande de devis a bien été enregistrée et va être qualifiée par l’équipe commerciale.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <input
        className="input"
        name="companyName"
        aria-label="Entreprise"
        placeholder="Entreprise"
        required
      />
      <input
        className="input"
        name="contactName"
        aria-label="Nom du contact"
        placeholder="Nom du contact"
        required
      />
      <input
        className="input"
        name="email"
        aria-label="Email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        className="input"
        name="participants"
        aria-label="Nombre de participants"
        type="number"
        min={1}
        defaultValue={6}
        placeholder="Nombre de participants"
        required
      />
      <select
        className="select"
        name="requestedMode"
        aria-label="Modalité souhaitée"
        defaultValue=""
        required
      >
        <option value="" disabled>
          Sélectionner une modalité
        </option>
        <option value="ONSITE">Présentiel</option>
        <option value="REMOTE">Distanciel</option>
        <option value="HYBRID">Hybride</option>
        <option value="ELEARNING">E-learning</option>
      </select>
      <textarea
        className="textarea"
        name="brief"
        aria-label="Votre besoin de formation"
        defaultValue={
          initialTrainingTitle
            ? `Formation souhaitée : ${initialTrainingTitle}\n\nEffectif et contexte : `
            : ""
        }
        placeholder="Effectif, formation cible, contexte"
        required
      />
      <p>
        Les données de ce formulaire servent à traiter votre demande, sans
        abonnement publicitaire automatique. N’indiquez pas de données
        sensibles. <a href="/confidentialite">Données personnelles</a> ·{" "}
        <a href="/vos-droits">Vos droits</a>. Cette copie enregistre localement,
        sans email automatique.
      </p>
      <TurnstileWidget
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
      />
      {TURNSTILE_SITE_KEY && !turnstileToken ? (
        <p className="turnstile-hint">
          Merci de valider la protection anti-spam avant l'envoi.
        </p>
      ) : null}
      <FormFeedback status={status} />
      <button
        type="submit"
        className="button button-primary"
        disabled={
          isSubmitting || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)
        }
      >
        {isSubmitting ? "Envoi en cours..." : "Recevoir un devis"}
      </button>
    </form>
  );
}

export function EnrollmentForm({
  initialTrainingSlug,
}: {
  initialTrainingSlug?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const data = await submitForm("/enrollments", {
        participantName: String(formData.get("participantName") || ""),
        participantEmail: String(formData.get("participantEmail") || ""),
        companyName: String(formData.get("companyName") || ""),
        trainingSlug: String(formData.get("trainingSlug") || ""),
        message: String(formData.get("message") || ""),
        turnstileToken,
      });

      form.reset();

      if (initialTrainingSlug) {
        const trainingInput = form.elements.namedItem(
          "trainingSlug",
        ) as HTMLInputElement | null;
        if (trainingInput) {
          trainingInput.value = initialTrainingSlug;
        }
      }

      setStatus({
        type: "success",
        message: data?.trainingTitle
          ? `Demande d'inscription envoyée pour ${data.trainingTitle}.`
          : "Votre demande d'inscription a bien été enregistrée.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <input
        className="input"
        name="participantName"
        placeholder="Nom du participant"
        required
      />
      <input
        className="input"
        name="participantEmail"
        type="email"
        placeholder="Email du participant"
        required
      />
      <input className="input" name="companyName" placeholder="Entreprise" />
      <input
        className="input"
        name="trainingSlug"
        placeholder="Référence ou slug de la formation"
        defaultValue={initialTrainingSlug}
      />
      <textarea
        className="textarea"
        name="message"
        placeholder="Contexte, nombre de places, contraintes calendaires"
      />
      <p>
        Les données de ce formulaire servent à traiter votre demande, sans
        abonnement publicitaire automatique. N’indiquez pas de données
        sensibles. <a href="/confidentialite">Données personnelles</a> ·{" "}
        <a href="/vos-droits">Vos droits</a>. Cette copie enregistre localement,
        sans email automatique.
      </p>
      <TurnstileWidget
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
      />
      {TURNSTILE_SITE_KEY && !turnstileToken ? (
        <p className="turnstile-hint">
          Merci de valider la protection anti-spam avant l'envoi.
        </p>
      ) : null}
      <FormFeedback status={status} />
      <button
        type="submit"
        className="button button-primary"
        disabled={
          isSubmitting || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)
        }
      >
        {isSubmitting ? "Envoi en cours..." : "Demander une inscription"}
      </button>
    </form>
  );
}

export function TrainingSidebarLeadForm({
  trainingSlug,
  trainingTitle,
}: {
  trainingSlug: string;
  trainingTitle: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitForm("/enrollments", {
        participantName: String(formData.get("participantName") || ""),
        participantEmail: String(formData.get("participantEmail") || ""),
        companyName: String(formData.get("companyName") || ""),
        trainingSlug,
        message: String(formData.get("message") || ""),
        turnstileToken,
      });

      setStatus({
        type: "success",
        message: `Votre demande pour ${trainingTitle} a bien été enregistrée.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="training-inline-form">
      <input
        className="input"
        name="participantName"
        placeholder="Nom complet"
        required
      />
      <input
        className="input"
        name="participantEmail"
        type="email"
        placeholder="Email professionnel"
        required
      />
      <input className="input" name="companyName" placeholder="Entreprise" />
      <textarea
        className="textarea"
        name="message"
        placeholder="Besoin, nombre de participants, contraintes calendaires"
      />
      <p>
        Les données de ce formulaire servent à traiter votre demande, sans
        abonnement publicitaire automatique. N’indiquez pas de données
        sensibles. <a href="/confidentialite">Données personnelles</a> ·{" "}
        <a href="/vos-droits">Vos droits</a>. Cette copie enregistre localement,
        sans email automatique.
      </p>
      <TurnstileWidget
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
      />
      {TURNSTILE_SITE_KEY && !turnstileToken ? (
        <p className="turnstile-hint">
          Merci de valider la protection anti-spam avant l'envoi.
        </p>
      ) : null}
      <FormFeedback status={status} />
      <button
        type="submit"
        className="button button-primary"
        disabled={
          isSubmitting || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)
        }
      >
        {isSubmitting ? "Envoi en cours..." : "Recevoir une proposition"}
      </button>
    </form>
  );
}
