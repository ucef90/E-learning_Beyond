import Link from "next/link";
export function RegulatoryHighlight() {
  return (
    <section className="section regulatory-highlight">
      <div className="page-shell">
        <div className="regulatory-highlight-inner">
          <div>
            <span className="eyebrow eyebrow-dark">
              Nouveaux parcours · RGPD & AI Act
            </span>
            <h2>
              Protéger les données.
              <br />
              Maîtriser les usages de l’IA.
            </h2>
            <p>
              Des textes officiels aux décisions de terrain : cas corrigés, quiz
              expliqués et modèles pour votre organisation.
            </p>
            <p className="regulatory-facts">
              2 parcours de 14 h · 16 cas pratiques · 10 modèles de travail
            </p>
          </div>
          <div className="regulatory-actions">
            <Link href="/rgpd-ai-act" className="button button-primary">
              Découvrir les deux formations
            </Link>
            <Link href="/transparence-ia">
              Notre démarche sur la plateforme
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
