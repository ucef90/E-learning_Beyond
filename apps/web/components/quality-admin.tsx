"use client";
import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { api, download } from "@/lib/learning-api";
import {
  requestKinds,
  requestStatuses,
  stakeholderLabels,
} from "@/lib/quality";
import { QualityRegister } from "./quality-register";
const when = (d: string) => new Date(d).toLocaleString("fr-FR");
export default function QualityAdmin() {
  const [tab, setTab] = useState("requests"),
    [list, setList] = useState<any[]>([]),
    [next, setNext] = useState<string | null>(null),
    [item, setItem] = useState<any>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [loaded, setLoaded] = useState(false),
    [filter, setFilter] = useState("ALL");
  const ticket = useRef(0);
  async function load(more = false) {
    const data = await api(
      "/quality/requests" +
        (more && next ? "?before=" + encodeURIComponent(next) : ""),
    );
    setList((old) => (more ? [...old, ...data.items] : data.items));
    setNext(data.next);
    setLoaded(true);
  }
  useEffect(() => {
    load().catch((e) => {
      setError(e.message);
      setLoaded(true);
    });
  }, []);
  async function open(id: string) {
    const t = ++ticket.current;
    setItem(null);
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const d = await api("/quality/requests/" + id);
      if (t === ticket.current) setItem(d);
    } catch (e) {
      if (t === ticket.current) setError((e as Error).message);
    } finally {
      if (t === ticket.current) setBusy(false);
    }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const due = String(f.get("dueDate") || "");
      const updated = await api("/quality/requests/" + item.id, "PATCH", {
        revision: item.revision,
        status: String(f.get("status")),
        assignee: String(f.get("assignee")),
        resolution: String(f.get("resolution")),
        responseReference: String(f.get("responseReference")),
        note: String(f.get("note")),
        ...(due ? { dueDate: new Date(due + "T12:00:00Z").toISOString() } : {}),
      });
      setItem(updated);
      setList((old) =>
        old.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)),
      );
      setNotice("Action enregistrée. Aucun email envoyé automatiquement.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function exportAll() {
    setBusy(true);
    setError("");
    try {
      let cursor: string | null = null;
      const all: any[] = [];
      do {
        const page = await api(
          "/quality/requests" +
            (cursor ? "?before=" + encodeURIComponent(cursor) : ""),
        );
        for (const r of page.items)
          all.push(await api("/quality/requests/" + r.id));
        cursor = page.next;
      } while (cursor);
      download("registre-demandes-qualite.json", {
        exportedAt: new Date().toISOString(),
        notice:
          "Données personnelles : accès réservé. Les déclarations des formulaires publics ne sont pas authentifiées. Trier les tests avant toute analyse.",
        requests: all,
      });
      setNotice(
        "Export complet préparé. Conservez-le dans un dossier protégé.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="quality-admin">
      <div>
        <p className="academy-caption">Administration · Qualité</p>
        <h1>Demandes et preuves du centre</h1>
        <p>
          Les formulaires alimentent ce registre. Aucune entrée ne vaut
          certification ou validation d’un auditeur.
        </p>
      </div>
      <div className="quality-admin-tabs">
        <button
          className="button button-secondary"
          aria-pressed={tab === "requests"}
          onClick={() => setTab("requests")}
        >
          Demandes et réclamations
        </button>
        <button
          className="button button-secondary"
          aria-pressed={tab === "register"}
          onClick={() => setTab("register")}
        >
          Exigences et preuves
        </button>
        <Link href="/qualite" className="button button-secondary">
          Voir les informations publiques
        </Link>
      </div>
      {tab === "register" ? (
        <QualityRegister />
      ) : (
        <>
          <div className="quality-actions">
            <button
              className="button button-secondary"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                load()
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            >
              Actualiser la liste
            </button>
            <button
              className="button button-secondary"
              disabled={busy}
              onClick={exportAll}
            >
              Exporter tout le registre
            </button>
          </div>
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
          <div className="quality-grid">
            <section>
              <label>
                Filtrer les demandes chargées
                <select
                  className="input"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">Tous les objets</option>
                  {Object.entries(requestKinds).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <p>
                {list.length} demande(s) chargée(s)
                {next
                  ? " · D’autres demandes sont disponibles ci-dessous."
                  : ""}
              </p>
              <div className="quality-request-list">
                {list
                  .filter((i) => filter === "ALL" || i.kind === filter)
                  .map((r) => (
                    <button
                      disabled={busy}
                      key={r.id}
                      aria-pressed={item?.id === r.id}
                      onClick={() => open(r.id)}
                    >
                      <strong>
                        {requestKinds[r.kind]} · {r.reference}
                      </strong>
                      <span>
                        {r.fullName} · {r.context || "Sans formation précisée"}
                      </span>
                      <span>
                        {requestStatuses[r.status]} · {when(r.createdAt)}
                      </span>
                      {r.dueDate && (
                        <span>
                          Échéance : {when(r.dueDate)}
                          {r.status !== "CLOSED" &&
                          new Date(r.dueDate) < new Date()
                            ? " · dépassée"
                            : ""}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
              {loaded && !list.length && (
                <p>
                  Aucune demande enregistrée. Les formulaires publics créeront
                  les premières entrées.
                </p>
              )}
              {!loaded && <p role="status">Chargement des demandes…</p>}
              {next && (
                <button
                  className="button button-secondary"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    load(true)
                      .catch((e) => setError(e.message))
                      .finally(() => setBusy(false));
                  }}
                >
                  Charger la suite
                </button>
              )}
            </section>
            <section className="quality-card">
              {busy && !item ? (
                <p role="status">Chargement…</p>
              ) : !item ? (
                <p>
                  Sélectionnez une demande pour consulter son contenu et
                  enregistrer son traitement.
                </p>
              ) : (
                <>
                  <h2>{item.reference}</h2>
                  <p>
                    {item.fullName} · {item.email}
                    <br />
                    {stakeholderLabels[item.stakeholder]} · {item.context}
                  </p>
                  <p className="quality-note">
                    Déclaration reçue par formulaire public, identité non
                    vérifiée. Contactez le demandeur avant de transmettre des
                    informations personnelles.
                  </p>
                  {item.currentLevel && (
                    <p>Niveau déclaré : {item.currentLevel}</p>
                  )}
                  {item.rating != null && <p>Appréciation : {item.rating}/5</p>}
                  <pre>{item.message}</pre>
                  <form
                    className="quality-form"
                    key={item.id + "-" + item.revision}
                    onSubmit={save}
                  >
                    <label>
                      État
                      <select
                        name="status"
                        className="input"
                        defaultValue={item.status}
                      >
                        {Object.entries(requestStatuses).map(([k, v]) => (
                          <option value={k} key={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Responsable du traitement
                      <input
                        name="assignee"
                        className="input"
                        defaultValue={item.assignee}
                        maxLength={120}
                      />
                    </label>
                    <label>
                      Échéance
                      <input
                        name="dueDate"
                        className="input"
                        type="date"
                        defaultValue={item.dueDate?.slice(0, 10) || ""}
                      />
                    </label>
                    <label>
                      Action réalisée et justification *
                      <textarea
                        name="note"
                        className="textarea"
                        required
                        minLength={10}
                        maxLength={2000}
                      />
                    </label>
                    <label>
                      Résolution (requise pour clôturer)
                      <textarea
                        name="resolution"
                        className="textarea"
                        defaultValue={item.resolution}
                        maxLength={5000}
                      />
                    </label>
                    <label>
                      Référence de la réponse effectivement communiquée
                      <input
                        name="responseReference"
                        className="input"
                        defaultValue={item.responseReference}
                        maxLength={500}
                        placeholder="Date, canal et référence du document ou de l’échange"
                      />
                    </label>
                    <button disabled={busy} className="button button-primary">
                      {busy ? "Enregistrement…" : "Enregistrer le traitement"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className="button button-secondary"
                      onClick={() => open(item.id)}
                    >
                      Recharger le dossier
                    </button>
                  </form>
                  <h3>Historique</h3>
                  <p>Reçu le {when(item.createdAt)}.</p>
                  {item.events.map((e: any) => (
                    <div className="quality-event" key={e.id}>
                      <strong>
                        {when(e.createdAt)} ·{" "}
                        {requestStatuses[e.details.status]}
                      </strong>
                      <p>{e.details.note}</p>
                      <small>Administrateur : {e.actorId}</small>
                    </div>
                  ))}
                  <button
                    className="button button-secondary"
                    onClick={() => download(item.reference + ".json", item)}
                  >
                    Exporter ce dossier
                  </button>
                </>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
