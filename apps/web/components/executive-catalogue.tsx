"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { executiveProgrammes, programmeHref } from "@/lib/executive";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
export function ExecutiveCatalogue({ kind }: { kind?: "MBA" | "DBA" }) {
  const [query, setQuery] = useState(""),
    [domain, setDomain] = useState("");
  const source = executiveProgrammes.filter((p) => !kind || p.kind === kind);
  const domains = [...new Set(source.map((p) => p.domain))];
  const filtered = source.filter(
    (p) =>
      (!domain || p.domain === domain) &&
      normalize(
        `${p.kind} ${p.title} ${p.domain} ${p.promise} ${p.modules.map((m) => m.title).join(" ")}`,
      ).includes(normalize(query.trim())),
  );
  return (
    <section
      id="parcours"
      className="executive-catalogue"
      aria-labelledby="catalogue-title"
    >
      <div className="executive-section-heading">
        <div>
          <span className="executive-eyebrow">Votre prochain parcours</span>
          <h2 id="catalogue-title">Choisissez votre domaine d’impact.</h2>
        </div>
        <p>
          Explorez les objectifs, les modules et le projet de chaque
          spécialisation avant de candidater.
        </p>
      </div>
      <nav className="executive-tabs" aria-label="Types de parcours">
        <Link href="/mba-dba" aria-current={!kind ? "page" : undefined}>
          Tous les parcours <span>31</span>
        </Link>
        <Link href="/mba" aria-current={kind === "MBA" ? "page" : undefined}>
          MBA <span>21</span>
        </Link>
        <Link href="/dba" aria-current={kind === "DBA" ? "page" : undefined}>
          DBA <span>10</span>
        </Link>
      </nav>
      <div className="executive-filters">
        <label>
          <span>Rechercher un parcours</span>
          <span className="executive-search">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Finance, IA, santé, logistique…"
            />
          </span>
        </label>
        <label>
          <span>Domaine</span>
          <select value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="">Tous les domaines</option>
            {domains.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="executive-result" role="status">
        {filtered.length} parcours{" "}
        {filtered.length === 1 ? "correspond" : "correspondent"} à votre
        recherche
      </p>
      <div className="executive-programmes">
        {filtered.map((p, i) => (
          <article key={p.slug} className="executive-programme">
            <div className="executive-programme-top">
              <span
                className={`executive-kind ${p.kind === "DBA" ? "is-dba" : ""}`}
              >
                {p.kind}
              </span>
              <span>{p.domain}</span>
            </div>
            <h3>
              <Link href={programmeHref(p)}>{p.title}</Link>
            </h3>
            <p>{p.promise}</p>
            <div className="executive-programme-bottom">
              <span>
                {p.months} · {p.modules.length}{" "}
                {p.kind === "DBA" ? "jalons" : "modules"}
                <small>Rythme cible · à distance</small>
              </span>
              <Link
                href={programmeHref(p)}
                aria-label={`Découvrir le ${p.kind} ${p.title}`}
              >
                <ArrowRight size={23} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="executive-empty">
          <h3>Aucun parcours ne correspond à ces critères.</h3>
          <p>Essayez un mot plus général ou élargissez le domaine.</p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setDomain("");
            }}
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}
    </section>
  );
}
