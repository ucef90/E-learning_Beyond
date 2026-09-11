"use client";
import { useState } from "react";
import { TrainingCard } from "@/components/training-card";
import type { UiTraining } from "@/lib/api";
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function CatalogExplorer({
  trainings,
  initialQuery = "",
}: {
  trainings: UiTraining[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery),
    [category, setCategory] = useState(""),
    [level, setLevel] = useState(""),
    [availability, setAvailability] = useState("");
  const categories = [...new Set(trainings.map((t) => t.category))].sort(
    (a, b) => a.localeCompare(b, "fr"),
  );
  const levels = [...new Set(trainings.map((t) => t.level))];
  const filtered = trainings.filter(
    (t) =>
      (!query.trim() ||
        normalize(
          [t.title, t.category, t.summary, ...t.goals].join(" "),
        ).includes(normalize(query.trim()))) &&
      (!category || t.category === category) &&
      (!level || t.level === level) &&
      (!availability ||
        (availability === "pilot"
          ? t.courses.length > 0
          : t.courses.length === 0)),
  );
  return (
    <>
      <div className="catalog-local-filters">
        <label>
          Rechercher
          <input
            className="input"
            type="search"
            placeholder="Python, IA, gestion de projet…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Domaine
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tous les domaines</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Niveau
          <select
            className="select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Tous les niveaux</option>
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label>
          Contenu e-learning
          <select
            className="select"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">Toutes les fiches</option>
            <option value="pilot">Avec un module pilote</option>
            <option value="preparing">Cours à préparer</option>
          </select>
        </label>
      </div>
      <div className="catalog-filter-summary" aria-live="polite">
        <strong>{filtered.length}</strong>
        <span>
          fiche{filtered.length > 1 ? "s" : ""} correspondant à vos critères
        </span>
        {(query || category || level || availability) && (
          <button
            className="catalog-reset-button"
            onClick={() => {
              setQuery("");
              setCategory("");
              setLevel("");
              setAvailability("");
            }}
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className="cards-grid">
          {filtered.map((t) => (
            <TrainingCard key={t.id} training={t} />
          ))}
        </div>
      ) : (
        <div className="learning-empty">
          <h2>Aucune formation pour ces critères</h2>
          <p>Essayez un terme plus court ou retirez un filtre.</p>
        </div>
      )}
    </>
  );
}
