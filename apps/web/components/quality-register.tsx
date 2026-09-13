"use client";
import { useEffect, useState, FormEvent } from "react";
import matrix from "@/lib/quality-matrix.json";
import { reviewStatuses } from "@/lib/quality";
import { api, download } from "@/lib/learning-api";
export function QualityRegister() {
  const [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [query, setQuery] = useState("");
  async function load() {
    setData(await api("/quality/reviews"));
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  async function save(
    event: FormEvent<HTMLFormElement>,
    id: number,
    revision: number,
  ) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const due = String(f.get("dueDate") || "");
      const d = await api("/quality/reviews/" + id, "PATCH", {
        revision,
        status: String(f.get("status")),
        evidenceKind: String(f.get("evidenceKind")),
        evidenceReference: String(f.get("evidenceReference")),
        owner: String(f.get("owner")),
        note: String(f.get("note")),
        ...(due ? { dueDate: new Date(due + "T12:00:00Z").toISOString() } : {}),
      });
      setData(d);
      setNotice(
        "Revue enregistrée avec son auteur et sa date. Ce statut interne n’est pas un avis de certification.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="quality-card">
      <h2>Registre des exigences et des preuves</h2>
      <p>
        32 indicateurs actuels et anticipation de l’indicateur 33, réservé aux
        CFA à partir du 1er novembre 2026. Le périmètre réel reste à valider par
        la direction. La non-applicabilité exige une justification.
      </p>
      <p className="quality-note">
        Une référence de document n’est pas son contenu : conservez les
        originaux dans le dossier sécurisé du centre. Un modèle ou un test ne
        peut pas être marqué comme preuve réelle examinée. Aucun taux de
        conformité automatique n’est calculé.
      </p>
      <div className="quality-actions">
        <button
          disabled={busy}
          className="button button-secondary"
          onClick={() => {
            setBusy(true);
            load()
              .catch((e) => setError(e.message))
              .finally(() => setBusy(false));
          }}
        >
          Recharger le registre
        </button>
        <button
          disabled={!data || busy}
          className="button button-secondary"
          onClick={() =>
            download("registre-preuves-qualiopi.json", {
              exportedAt: new Date().toISOString(),
              matrix,
              ...data,
            })
          }
        >
          Exporter les preuves et leur historique
        </button>
      </div>
      <label>
        Rechercher une exigence
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Numéro, handicap, évaluation…"
        />
      </label>
      {error && (
        <p role="alert" className="quality-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="quality-note">
          {notice}
        </p>
      )}
      {!data ? (
        <p role="status">Chargement du registre…</p>
      ) : (
        matrix
          .filter((m) =>
            (m.id + " " + m.title + " " + m.missing)
              .toLocaleLowerCase("fr")
              .includes(query.toLocaleLowerCase("fr")),
          )
          .map((m) => {
            const row = data.items.find((i: any) => i.indicator === m.id);
            return (
              <details className="quality-register-row" key={m.id}>
                <summary>
                  {m.id}. {m.title}
                  <span className="quality-evidence-status">
                    {reviewStatuses[row?.status || "TO_COLLECT"]}
                  </span>
                  <small>
                    Critère {m.criterion} · {m.scope}
                  </small>
                </summary>
                <p>
                  <strong>Disponible :</strong> {m.existing}
                </p>
                <p>
                  <strong>À réunir ou réaliser :</strong> {m.missing}
                </p>
                <p>Procédure du dossier : {m.procedure}.</p>
                <form
                  key={row?.revision || 0}
                  onSubmit={(e) => save(e, m.id, row?.revision || 0)}
                >
                  <div className="quality-grid">
                    <label>
                      État de préparation
                      <select
                        className="input"
                        name="status"
                        defaultValue={row?.status || "TO_COLLECT"}
                      >
                        {Object.entries(reviewStatuses).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Nature de la pièce
                      <select
                        className="input"
                        name="evidenceKind"
                        defaultValue={row?.evidenceKind || "DRAFT"}
                      >
                        <option value="DRAFT">
                          Modèle / procédure à valider
                        </option>
                        <option value="TEST">
                          Test technique / démonstration
                        </option>
                        <option value="REAL">
                          Document ou preuve réelle du centre
                        </option>
                      </select>
                    </label>
                    <label>
                      Responsable
                      <input
                        className="input"
                        name="owner"
                        defaultValue={row?.owner || ""}
                        maxLength={120}
                      />
                    </label>
                    <label>
                      Échéance
                      <input
                        className="input"
                        name="dueDate"
                        type="date"
                        defaultValue={row?.dueDate?.slice(0, 10) || ""}
                      />
                    </label>
                  </div>
                  <label>
                    Références des pièces et emplacement sécurisé
                    <textarea
                      className="textarea"
                      name="evidenceReference"
                      defaultValue={row?.evidenceReference || ""}
                      maxLength={1500}
                      placeholder="Nom du document, version, date, session et emplacement du dossier sécurisé"
                    />
                  </label>
                  <label>
                    Constat, justification et prochaine action *
                    <textarea
                      className="textarea"
                      name="note"
                      required
                      minLength={10}
                      maxLength={4000}
                      defaultValue={row?.note || ""}
                    />
                  </label>
                  <button className="button button-primary" disabled={busy}>
                    {busy ? "Enregistrement…" : "Enregistrer la revue"}
                  </button>
                </form>
                {data.events
                  .filter((e: any) => e.indicator === m.id)
                  .map((e: any) => (
                    <div className="quality-event" key={e.id}>
                      <strong>
                        {new Date(e.createdAt).toLocaleString("fr-FR")} ·{" "}
                        {reviewStatuses[e.details.status]}
                      </strong>
                      <p>{e.details.note}</p>
                      <small>
                        Auteur : {e.actorId} · Nature : {e.details.evidenceKind}
                      </small>
                    </div>
                  ))}
              </details>
            );
          })
      )}
      <p>
        Références :{" "}
        <a href="https://travail-emploi.gouv.fr/referentiel-national-qualite-guide-de-lecture-qualiopi">
          Ministère du Travail
        </a>{" "}
        ;{" "}
        <a href="https://www.legifrance.gouv.fr/eli/decret/2026/8/1/2026-728/jo/texte">
          évolution applicable au 1er novembre 2026
        </a>
        .
      </p>
    </section>
  );
}
