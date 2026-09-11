"use client";

import { useState, useTransition } from "react";

const API_URL = "/api/v1";

export type CommercialOverview = {
  contacts: number;
  quotes: number;
  enrollments: number;
  totalRequests: number;
};

export type ContactRequest = {
  id: string;
  fullName: string;
  email: string;
  company?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export type QuoteRequest = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  requestedMode: string;
  participants?: number | null;
  brief: string;
  status: string;
  createdAt: string;
};

export type EnrollmentRequest = {
  id: string;
  participantName?: string | null;
  participantEmail?: string | null;
  status: string;
  companyName?: string | null;
  trainingTitle?: string | null;
  sessionStartDate?: string | null;
  sessionCity?: string | null;
  updatedAt?: string;
  createdAt: string;
};

type Props = {
  initialOverview: CommercialOverview;
  initialContacts: ContactRequest[];
  initialQuotes: QuoteRequest[];
  initialEnrollments: EnrollmentRequest[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMode(mode: string) {
  const labels: Record<string, string> = {
    ONSITE: "Présentiel",
    REMOTE: "Distanciel",
    HYBRID: "Hybride",
    ELEARNING: "E-learning",
    BLENDED: "Blended",
  };

  return labels[mode] ?? mode;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    NEW: "Nouveau",
    IN_PROGRESS: "En cours",
    QUALIFIED: "Qualifié",
    CLOSED: "Clos",
    PROPOSAL_SENT: "Proposition envoyée",
    WON: "Gagné",
    LOST: "Perdu",
    PENDING: "En attente",
    CONFIRMED: "Confirmé",
    WAITLISTED: "Liste d’attente",
    CANCELLED: "Annulé",
    COMPLETED: "Terminé",
  };

  return labels[status] ?? status;
}

function statusStyles(status: string) {
  if (
    status === "WON" ||
    status === "CONFIRMED" ||
    status === "QUALIFIED" ||
    status === "COMPLETED"
  ) {
    return {
      background: "rgba(47, 133, 90, 0.12)",
      color: "#22603e",
    };
  }

  if (status === "LOST" || status === "CANCELLED" || status === "CLOSED") {
    return {
      background: "rgba(154, 52, 18, 0.12)",
      color: "#9a3412",
    };
  }

  if (
    status === "PROPOSAL_SENT" ||
    status === "IN_PROGRESS" ||
    status === "WAITLISTED"
  ) {
    return {
      background: "rgba(26, 38, 68, 0.1)",
      color: "#1a2644",
    };
  }

  return {
    background: "rgba(242, 157, 53, 0.16)",
    color: "#8a4b00",
  };
}

function StatusBadge({ status }: { status: string }) {
  const styles = statusStyles(status);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: "0.9rem",
        ...styles,
      }}
    >
      {statusLabel(status)}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <p className="section-copy" style={{ margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <article className="card" style={{ padding: 24, gridColumn: "span 3" }}>
      <p style={{ margin: 0, color: "var(--muted)", fontWeight: 700 }}>
        {label}
      </p>
      <strong
        style={{
          display: "block",
          fontSize: "2.2rem",
          margin: "8px 0",
          color: "var(--brand)",
        }}
      >
        {value}
      </strong>
      <p className="section-copy" style={{ margin: 0 }}>
        {hint}
      </p>
    </article>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ marginBottom: 6 }}>{title}</h2>
      <p className="section-copy" style={{ margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

function ActionBar({
  actions,
  onChange,
  busy,
}: {
  actions: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  busy: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
      {actions.map((action) => (
        <button
          key={action.value}
          type="button"
          className="button button-secondary"
          onClick={() => onChange(action.value)}
          disabled={busy}
          style={{ padding: "10px 14px" }}
        >
          {busy ? "Mise à jour..." : action.label}
        </button>
      ))}
    </div>
  );
}

export function CommercialBoard({
  initialOverview,
  initialContacts,
  initialQuotes,
  initialEnrollments,
}: Props) {
  const [overview, setOverview] = useState(initialOverview);
  const [contacts, setContacts] = useState(initialContacts);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function updateStatus(
    kind: "contacts" | "quotes" | "enrollments",
    id: string,
    status: string,
  ) {
    const key = `${kind}:${id}`;
    setBusyKey(key);

    try {
      const response = await fetch(`${API_URL}/${kind}/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Impossible de mettre à jour le statut.");
      }

      startTransition(() => {
        if (kind === "contacts") {
          setContacts((current) =>
            current.map((item) =>
              item.id === id ? { ...item, status } : item,
            ),
          );
        }

        if (kind === "quotes") {
          setQuotes((current) =>
            current.map((item) =>
              item.id === id ? { ...item, status } : item,
            ),
          );
        }

        if (kind === "enrollments") {
          setEnrollments((current) =>
            current.map((item) =>
              item.id === id ? { ...item, status } : item,
            ),
          );
        }

        setOverview((current) => ({ ...current }));
      });
    } catch (error) {
      console.error(error);
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <>
      <div className="cards-grid" style={{ marginTop: 24 }}>
        <MetricCard
          label="Total des demandes"
          value={overview.totalRequests}
          hint="Vue consolidée des formulaires reçus."
        />
        <MetricCard
          label="Contacts"
          value={overview.contacts}
          hint="Demandes de prise de contact et qualification initiale."
        />
        <MetricCard
          label="Devis"
          value={overview.quotes}
          hint="Besoins commerciaux à transformer en proposition."
        />
        <MetricCard
          label="Inscriptions"
          value={overview.enrollments}
          hint="Intentions d’achat ou de réservation à traiter rapidement."
        />
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <SectionHeader
          title="Demandes de contact"
          description="Messages entrants provenant du formulaire de contact général."
        />
        {contacts.length ? (
          <div className="grid">
            {contacts.map((contact) => (
              <article
                key={contact.id}
                className="card"
                style={{ padding: 22 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>{contact.fullName}</strong>
                    <p className="section-copy" style={{ margin: "6px 0 0" }}>
                      {contact.email}
                      {contact.company ? ` • ${contact.company}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                    <StatusBadge status={contact.status} />
                    <span className="eyebrow">
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                </div>
                <p style={{ marginBottom: 0, marginTop: 16 }}>
                  {contact.message}
                </p>
                <ActionBar
                  busy={busyKey === `contacts:${contact.id}`}
                  onChange={(value) =>
                    updateStatus("contacts", contact.id, value)
                  }
                  actions={[
                    { label: "Passer en cours", value: "IN_PROGRESS" },
                    { label: "Qualifier", value: "QUALIFIED" },
                    { label: "Clore", value: "CLOSED" },
                  ]}
                />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState label="Aucune demande de contact pour le moment." />
        )}
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <SectionHeader
          title="Demandes de devis"
          description="Leads B2B ou sur-mesure à transformer en proposition commerciale."
        />
        {quotes.length ? (
          <div className="grid">
            {quotes.map((quote) => (
              <article key={quote.id} className="card" style={{ padding: 22 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>{quote.companyName}</strong>
                    <p className="section-copy" style={{ margin: "6px 0 0" }}>
                      {quote.contactName} • {quote.email}
                    </p>
                  </div>
                  <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                    <StatusBadge status={quote.status} />
                    <span className="eyebrow">
                      {formatDate(quote.createdAt)}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: 14,
                  }}
                >
                  <span>Modalité : {formatMode(quote.requestedMode)}</span>
                  <span>Participants : {quote.participants ?? "N/A"}</span>
                </div>
                <p style={{ marginBottom: 0, marginTop: 16 }}>{quote.brief}</p>
                <ActionBar
                  busy={busyKey === `quotes:${quote.id}`}
                  onChange={(value) => updateStatus("quotes", quote.id, value)}
                  actions={[
                    { label: "Qualifier", value: "QUALIFIED" },
                    { label: "Envoyer proposition", value: "PROPOSAL_SENT" },
                    { label: "Marquer gagné", value: "WON" },
                    { label: "Marquer perdu", value: "LOST" },
                  ]}
                />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState label="Aucune demande de devis pour le moment." />
        )}
      </section>

      <section className="section">
        <SectionHeader
          title="Demandes d’inscription"
          description="Intentions d’inscription issues directement des fiches formation ou de la page dédiée."
        />
        {enrollments.length ? (
          <div className="grid">
            {enrollments.map((enrollment) => (
              <article
                key={enrollment.id}
                className="card"
                style={{ padding: 22 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>
                      {enrollment.participantName ||
                        "Participant non renseigné"}
                    </strong>
                    <p className="section-copy" style={{ margin: "6px 0 0" }}>
                      {enrollment.participantEmail || "Email non renseigné"}
                      {enrollment.companyName
                        ? ` • ${enrollment.companyName}`
                        : ""}
                    </p>
                  </div>
                  <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                    <StatusBadge status={enrollment.status} />
                    <span className="eyebrow">
                      {formatDate(enrollment.createdAt)}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: 14,
                  }}
                >
                  {enrollment.trainingTitle ? (
                    <span>Formation : {enrollment.trainingTitle}</span>
                  ) : null}
                  {enrollment.sessionStartDate ? (
                    <span>
                      Session : {formatDate(enrollment.sessionStartDate)}
                    </span>
                  ) : null}
                  {enrollment.sessionCity ? (
                    <span>Ville : {enrollment.sessionCity}</span>
                  ) : null}
                </div>
                <ActionBar
                  busy={busyKey === `enrollments:${enrollment.id}`}
                  onChange={(value) =>
                    updateStatus("enrollments", enrollment.id, value)
                  }
                  actions={[
                    { label: "Confirmer", value: "CONFIRMED" },
                    { label: "Mettre en attente", value: "WAITLISTED" },
                    { label: "Annuler", value: "CANCELLED" },
                    { label: "Terminer", value: "COMPLETED" },
                  ]}
                />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState label="Aucune demande d’inscription pour le moment." />
        )}
      </section>
    </>
  );
}
