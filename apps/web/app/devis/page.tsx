import Link from "next/link";
import { ArrowRight, Building2, Layers3, Users2 } from "lucide-react";
import { QuoteForm } from "@/components/forms";

export default function QuotePage() {
  return (
    <main className="section page-main-compact">
      <div className="page-shell">
        <section className="quote-page-shell">
          <div className="quote-page-copy">
            <div className="breadcrumb-row">
              <Link href="/">Accueil</Link>
              <span>/</span>
              <span>Demande de devis</span>
            </div>
            <span className="eyebrow">Demande de devis</span>
            <h1 className="section-title quote-page-title">Construire une proposition adaptée à votre contexte, vos équipes et vos priorités.</h1>
            <p className="section-copy">
              Inter, intra, sur-mesure, blended learning ou académie métier : partagez votre besoin et nous revenons vers vous avec une recommandation claire.
            </p>

            <div className="quote-page-benefits">
              {[
                {
                  icon: <Users2 size={18} />,
                  title: "Cadrage rapide",
                  copy: "Qualification du besoin, du niveau cible et du bon format de déploiement."
                },
                {
                  icon: <Layers3 size={18} />,
                  title: "Parcours modulable",
                  copy: "Assemblage possible de plusieurs formations, ressources et modalités."
                },
                {
                  icon: <Building2 size={18} />,
                  title: "Vision entreprise",
                  copy: "Réponse pensée pour un contexte métier, une équipe ou un programme plus large."
                }
              ].map((item) => (
                <article key={item.title} className="quote-benefit-card">
                  <div className="quote-benefit-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="hero-actions">
              <a href="#quote-form" className="button button-primary">
                Décrire mon besoin <ArrowRight size={18} />
              </a>
              <Link href="/contact" className="button button-secondary">
                Parler à un conseiller
              </Link>
            </div>
          </div>

          <div className="quote-page-form" id="quote-form">
            <QuoteForm />
          </div>
        </section>
      </div>
    </main>
  );
}
