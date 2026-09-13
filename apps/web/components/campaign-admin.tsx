"use client";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/learning-api";
import { programmeBySlug } from "@/lib/executive";
const stages: Record<string, string> = {
  NEW: "À traiter",
  CONTACTED: "Contacté",
  APPOINTMENT: "Rendez-vous confirmé",
  APPLICATION: "Candidature reçue",
  ENROLLED: "Inscription confirmée",
  CLOSED: "Clôturé",
};
export function CampaignAdmin() {
  const [items, setItems] = useState<any[]>([]),
    [summary, setSummary] = useState<any>(null),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState<any>(null),
    [stage, setStage] = useState("NEW"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  async function refresh(p = page) {
    const [list, s] = await Promise.all([
      api("/campaigns/leads?page=" + p),
      api("/campaigns/summary"),
    ]);
    setItems(list.items);
    setTotal(list.total);
    setSummary(s);
    setPage(p);
  }
  useEffect(() => {
    void refresh(1).catch((e) => setError(e.message));
  }, []);
  function select(item: any) {
    setSelected(item);
    setStage(item.stage);
    setNotice("");
    setError("");
  }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      await api("/campaigns/leads/" + selected.id, "PATCH", {
        revision: selected.revision,
        stage,
        note: f.get("note") || "",
        takeOwnership: f.get("takeOwnership") === "on",
        nextActionAt: f.get("nextActionAt")
          ? new Date(String(f.get("nextActionAt"))).toISOString()
          : "",
        enrollmentReference: f.get("enrollmentReference") || "",
        enrollmentConfirmed: f.get("enrollmentConfirmed") === "on",
      });
      setSelected(null);
      await refresh();
      setNotice("Suivi enregistré.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function localDate(d: string) {
    const date = new Date(d);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }
  return (
    <section className="campaign-crm">
      <h2>Prospects MBA & DBA · Campagnes Afrique</h2>
      <p>
        Traitez chaque demande, consignez l’échange et programmez la prochaine
        action. Les candidatures détaillées restent accessibles dans{" "}
        <a href="/apprentissage">l’administration pédagogique</a>.
      </p>
      {summary && (
        <>
          <div className="campaign-crm-stats">
            <div>
              <strong>{summary.total}</strong>
              <span>Demandes reçues</span>
            </div>
            <div>
              <strong>{summary.overdue}</strong>
              <span>Actions en retard</span>
            </div>
            <div>
              <strong>{summary.applications30Days}</strong>
              <span>Dossiers MBA/DBA, 30 jours</span>
            </div>
            {["APPOINTMENT", "ENROLLED"].map((s) => (
              <div key={s}>
                <strong>
                  {summary.stages.find((x: any) => x.stage === s)?._count
                    ._all || 0}
                </strong>
                <span>{stages[s]}</span>
              </div>
            ))}
          </div>
          <details>
            <summary>Mesure et provenance des demandes</summary>
            <p>
              La mesure interne est disponible. GA4 :{" "}
              {summary.configuration.ga4
                ? "identifiant configuré"
                : "non raccordé"}
              . Meta :{" "}
              {summary.configuration.metaPixel
                ? "identifiant configuré"
                : "non raccordé"}
              . WhatsApp :{" "}
              {summary.configuration.whatsapp
                ? "numéro configuré"
                : "numéro à renseigner"}
              .
            </p>
            <p>
              Les événements couvrent seulement les visiteurs ayant accepté les
              statistiques, sur les 30 derniers jours. Les compteurs commerciaux
              proviennent des dossiers enregistrés ; une demande ne vaut pas
              inscription.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Source / campagne</th>
                  <th>Demandes, 30 jours</th>
                </tr>
              </thead>
              <tbody>
                {summary.campaigns.map((c: any, i: number) => (
                  <tr key={i}>
                    <td>
                      {c.campaignSource || "Sans attribution consentie"} /{" "}
                      {c.campaignName || "—"}
                    </td>
                    <td>{c._count._all}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              {summary.events
                .map((e: any) => e.name + " : " + e._count._all)
                .join(" · ") || "Aucun événement consenti sur la période."}
            </p>
          </details>
        </>
      )}
      {error && (
        <p role="alert" className="campaign-error">
          {error}{" "}
          <button
            onClick={() =>
              void refresh()
                .then(() => setSelected(null))
                .catch((e) => setError(e.message))
            }
          >
            Recharger
          </button>
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      <div className="campaign-crm-grid">
        <div>
          <div className="campaign-crm-list">
            {items.map((item) => (
              <button
                key={item.id}
                aria-pressed={selected?.id === item.id}
                onClick={() => select(item)}
              >
                <strong>
                  {item.fullName} · {stages[item.stage]}
                </strong>
                <span>{programmeBySlug(item.programmeSlug)?.title}</span>
                <small>
                  {item.country} · {item.receiptCode} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                </small>
              </button>
            ))}
            {!items.length && <p>Aucune demande sur cette page.</p>}
          </div>
          <div className="campaign-actions">
            <button
              disabled={page === 1 || busy}
              onClick={() =>
                void refresh(page - 1).catch((e) => setError(e.message))
              }
            >
              Précédent
            </button>
            <span>
              Page {page} · {total} demandes
            </span>
            <button
              disabled={page * 25 >= total || busy}
              onClick={() =>
                void refresh(page + 1).catch((e) => setError(e.message))
              }
            >
              Suivant
            </button>
          </div>
        </div>
        {selected ? (
          <div className="campaign-crm-details">
            <h3>{selected.fullName}</h3>
            <p>
              <a href={"mailto:" + selected.email}>{selected.email}</a>
              {selected.phone && (
                <>
                  {" "}
                  ·{" "}
                  <a href={"tel:" + selected.phone.replace(/[^+0-9]/g, "")}>
                    {selected.phone}
                  </a>
                </>
              )}
            </p>
            <p>
              Demande : {selected.intent}. Disponibilités :{" "}
              {selected.preferredTime || "non précisées"}.<br />
              Contact demandé le{" "}
              {new Date(selected.contactConsentAt).toLocaleString("fr-FR")}.
            </p>
            <p>
              Origine initiale :{" "}
              {selected.attribution?.first?.source || "non disponible"} /{" "}
              {selected.attribution?.first?.campaign || "—"}
              <br />
              Dernière campagne :{" "}
              {selected.attribution?.last?.source || "non disponible"} /{" "}
              {selected.attribution?.last?.campaign || "—"}
            </p>
            <form key={selected.id + ":" + selected.revision} onSubmit={save}>
              <label>
                Étape
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  {Object.entries(stages).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {stage === "APPOINTMENT"
                  ? "Date du rendez-vous déjà confirmé *"
                  : "Prochaine action"}
                <input
                  name="nextActionAt"
                  type="datetime-local"
                  required={stage === "APPOINTMENT"}
                  defaultValue={
                    selected.nextActionAt
                      ? localDate(selected.nextActionAt)
                      : ""
                  }
                />
                <small>
                  Heure locale de votre navigateur. Un rendez-vous doit avoir
                  été convenu avec le prospect.
                </small>
              </label>
              <label>
                Note de suivi
                <textarea
                  name="note"
                  maxLength={3000}
                  rows={3}
                  placeholder="Échange, décision, prochaine action. Pas de données sensibles."
                />
              </label>
              <label className="campaign-check">
                <input type="checkbox" name="takeOwnership" defaultChecked />
                Je prends en charge ce dossier
              </label>
              {stage === "ENROLLED" && (
                <>
                  <label>
                    Référence du contrat ou dossier d’inscription *
                    <input
                      name="enrollmentReference"
                      defaultValue={selected.enrollmentReference || ""}
                      required
                      maxLength={120}
                    />
                  </label>
                  <label className="campaign-check">
                    <input
                      type="checkbox"
                      name="enrollmentConfirmed"
                      required
                    />
                    Je confirme une inscription réelle, après admission et
                    formalisation du contrat.
                  </label>
                  <small>
                    Ce statut ne crée ni paiement ni accès pédagogique. Gérez
                    l’accès dans l’administration des cours.
                  </small>
                </>
              )}
              <button className="button button-primary" disabled={busy}>
                {busy ? "Enregistrement…" : "Enregistrer le suivi"}
              </button>
            </form>
            <h4>Historique</h4>
            <ul>
              {selected.timeline.map((e: any) => (
                <li key={e.id}>
                  {new Date(e.createdAt).toLocaleString("fr-FR")} · {e.action}
                  {e.note && " — " + e.note}
                </li>
              ))}
            </ul>
            {selected.applications.length > 0 && (
              <p>
                Candidatures liées :{" "}
                {selected.applications
                  .map((a: any) => a.reference + " (" + a.status + ")")
                  .join(", ")}
              </p>
            )}
          </div>
        ) : (
          <p>
            Sélectionnez une demande pour consulter son origine et compléter le
            suivi.
          </p>
        )}
      </div>
    </section>
  );
}
