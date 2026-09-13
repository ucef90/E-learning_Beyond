import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProfessionalHighlight() {
  return (
    <section
      className="section professional-highlight"
      aria-labelledby="professional-title"
    >
      <div className="page-shell">
        <p className="eyebrow">Projet & Data · Parcours pratiques</p>
        <h2
          id="professional-title"
          className="section-title section-title-wide"
        >
          Apprendre, pratiquer, défendre ses choix.
        </h2>
        <p className="section-copy">
          Deux progressions complètes, des cas concrets et un dossier à
          construire avec votre formateur.
        </p>
        <div className="professional-grid">
          <article>
            <span className="eyebrow">35 heures · 20 modules</span>
            <h3>Préparation PMP</h3>
            <p>
              Pilotez la valeur, l’équipe et la livraison. Entraînez votre
              raisonnement sur un projet fil rouge et des quiz originaux.
            </p>
            <Link href="/formations/pmp-preparation-projets-valeur-2026">
              Découvrir le parcours projet <ArrowRight size={18} />
            </Link>
          </article>
          <article>
            <span className="eyebrow">140 heures · 20 modules</span>
            <h3>Data Fullstack</h3>
            <p>
              De Python et SQL au produit data : données fictives, notebooks,
              qualité, machine learning et restitution métier.
            </p>
            <Link href="/formations/data-fullstack-python-sql-machine-learning">
              Découvrir le parcours data <ArrowRight size={18} />
            </Link>
          </article>
        </div>
        <p className="professional-note">
          Rythme, accompagnement et matériel à confirmer au positionnement.
          Préparation PMP indépendante ; examen et conditions PMI séparés.
        </p>
      </div>
    </section>
  );
}
