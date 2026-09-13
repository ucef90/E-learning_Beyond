"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/learning-api";
const labels: Record<string, string> = {
  RECEIVED: "Reçue",
  REVIEW: "En étude",
  INTERVIEW: "Entretien à organiser",
  ACCEPTED: "Avis pédagogique favorable",
  WAITLIST: "En attente",
  DECLINED: "Non retenue",
  CLOSED: "Clôturée",
};
export default function ExecutiveAdmin() {
  const [page, setPage] = useState(1),
    [data, setData] = useState<any>(null),
    [selected, setSelected] = useState<any>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  async function refresh() {
    const r = await api(`/executive/applications?page=${page}`);
    setData(r);
  }
  useEffect(() => {
    setData(null);
    setError("");
    refresh().catch((e) => setError(e.message));
  }, [page]);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const values = new FormData(e.currentTarget);
    try {
      await api(`/executive/applications/${selected.id}`, "PATCH", {
        revision: selected.revision,
        status: String(values.get("status")),
        internalNote: String(values.get("internalNote")),
      });
      setSelected(null);
      await refresh();
      setNotice("Le suivi du dossier a été enregistré.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="executive-admin">
      <div className="academy-section-heading">
        <div>
          <h1>Candidatures MBA & DBA</h1>
          <p>
            Étudiez les projets et préparez les entretiens. Un avis favorable ne
            crée pas automatiquement une inscription ni un accès aux cours.
          </p>
        </div>
        <Link href="/mba-dba" className="button button-secondary">
          Voir l’offre publique
        </Link>
      </div>
      <p>
        Les trames des parcours sont disponibles dans{" "}
        <strong>Contenus pédagogiques</strong>, en recherchant « MBA » ou « DBA
        ». Leur publication et leur attribution restent soumises à la validation
        pédagogique.
      </p>
      {error && (
        <div role="alert" className="executive-error">
          {error}
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setError("");
              setSelected(null);
              refresh().catch((e) => setError(e.message));
            }}
          >
            Recharger les dossiers
          </button>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {selected ? (
        <form key={selected.id} onSubmit={save} className="executive-form">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setSelected(null)}
          >
            ← Liste des demandes
          </button>
          <h2>{selected.fullName}</h2>
          <p>
            {selected.reference} · {selected.programmeTitle}
          </p>
          <dl className="executive-admin-details">
            <div>
              <dt>Contact</dt>
              <dd>
                {selected.email} · {selected.phone || "Téléphone non indiqué"}
              </dd>
            </div>
            <div>
              <dt>Résidence</dt>
              <dd>
                {selected.city} {selected.country}
              </dd>
            </div>
            <div>
              <dt>Parcours</dt>
              <dd>
                {selected.qualification} · {selected.experience} ans
                d’expérience
              </dd>
            </div>
            <div>
              <dt>Situation</dt>
              <dd>
                {selected.currentRole} ·{" "}
                {selected.company || "Organisation non indiquée"}
              </dd>
            </div>
            <div>
              <dt>Demande</dt>
              <dd>
                {selected.requestType === "APPLICATION"
                  ? "Candidature"
                  : selected.requestType === "COMPANY"
                    ? "Accompagnement / équipe"
                    : "Informations et entretien"}
              </dd>
            </div>
            <div>
              <dt>Financement</dt>
              <dd>
                {selected.funding === "SELF"
                  ? "Personnel"
                  : selected.funding === "EMPLOYER"
                    ? "Employeur"
                    : "À étudier"}
              </dd>
            </div>
          </dl>
          <h3>Projet présenté</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{selected.motivation}</p>
          <label>
            État du dossier
            <select
              name="status"
              defaultValue={selected.status}
              disabled={busy}
            >
              {Object.entries(labels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            Note interne
            <textarea
              name="internalNote"
              rows={5}
              maxLength={6000}
              defaultValue={selected.internalNote}
              disabled={busy}
            />
          </label>
          <p className="executive-note">
            Cette note est réservée à l’administration. Aucun message n’est
            envoyé automatiquement au candidat.
          </p>
          <button
            type="submit"
            className="button button-primary"
            disabled={busy}
          >
            {busy ? "Enregistrement…" : "Enregistrer le suivi"}
          </button>
        </form>
      ) : !data ? (
        <p role="status">Chargement des candidatures…</p>
      ) : (
        <>
          <p role="status">
            {data.total} demande{data.total > 1 ? "s" : ""} enregistrée
            {data.total > 1 ? "s" : ""}
          </p>
          {!data.items.length ? (
            <div className="executive-empty">
              <h2>Aucune candidature à afficher.</h2>
              <p>
                Les nouvelles demandes déposées depuis le site apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="executive-admin-list">
              {data.items.map((p: any) => (
                <article key={p.id}>
                  <div>
                    <span>
                      {labels[p.status]} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <h2>{p.fullName}</h2>
                    <p>{p.programmeTitle}</p>
                    <small>
                      {p.country} · {p.reference}
                    </small>
                  </div>
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setSelected(p);
                      setNotice("");
                      setError("");
                    }}
                  >
                    Étudier le dossier
                  </button>
                </article>
              ))}
            </div>
          )}
          <div className="executive-pagination">
            <button
              className="button button-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </button>
            <span>
              Page {page} / {Math.max(1, Math.ceil(data.total / 25))}
            </span>
            <button
              className="button button-secondary"
              disabled={page * 25 >= data.total}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </section>
  );
}
