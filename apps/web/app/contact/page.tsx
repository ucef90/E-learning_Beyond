import Link from "next/link";
import { ArrowRight, Clock3, Mail, MapPinned, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/forms";

export default function ContactPage() {
  return (
    <main className="section page-main-compact">
      <div className="page-shell">
        <section className="contact-hero">
          <div className="contact-hero-copy">
            <div className="breadcrumb-row">
              <Link href="/">Accueil</Link>
              <span>/</span>
              <span>Nous contacter</span>
            </div>
            <span className="eyebrow">Nous contacter</span>
            <h1
              className="section-title hero-title"
              style={{ maxWidth: "13ch" }}
            >
              Construisons votre projet de formation, de catalogue ou de
              plateforme LMS.
            </h1>
            <p className="section-copy">
              Une question sur nos formations, un projet entreprise à cadrer ou
              un besoin de conseil sur la mise en place d’un portail apprenant
              et client ? Notre équipe est à votre écoute.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              <a href="#contact-form" className="button button-primary">
                Nous contacter <ArrowRight size={17} />
              </a>
              <Link href="/formations" className="button button-secondary">
                Voir toutes nos formations
              </Link>
            </div>
          </div>

          <div className="contact-hero-visual">
            <div className="contact-hero-glow contact-hero-glow-a" />
            <div className="contact-hero-glow contact-hero-glow-b" />
            <div className="contact-hero-glow contact-hero-glow-c" />
            <div className="contact-hero-panel">
              <span className="premium-category-accent">Accès possibles</span>
              <h2 style={{ margin: "14px 0 10px" }}>
                Un même site, plusieurs espaces selon le rôle.
              </h2>
              <div className="catalog-highlight-list">
                <div className="catalog-highlight-item">
                  <strong>Espace apprenant</strong>
                  <span>
                    Espace de formation : cours, progression, quiz et retours du
                    formateur.
                  </span>
                </div>
                <div className="catalog-highlight-item">
                  <strong>Espace formateur</strong>
                  <span>
                    Redirection LMS : sessions, ressources, évaluations, suivi.
                  </span>
                </div>
                <div className="catalog-highlight-item">
                  <strong>Espace client</strong>
                  <span>
                    Portail Beyond Expertise : demandes, devis, validations et
                    documents.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-info-strip">
          {[
            {
              icon: <Mail size={18} />,
              label: "Email",
              value: "hello@beyond-expertise.com",
            },
            {
              icon: <PhoneCall size={18} />,
              label: "Téléphone",
              value: "+212 6 00 00 00 00",
            },
            {
              icon: <MapPinned size={18} />,
              label: "Adresse",
              value: "Casablanca, Maroc",
            },
            {
              icon: <Clock3 size={18} />,
              label: "Horaires",
              value: "Du lundi au vendredi de 8h30 à 18h30",
            },
          ].map((item) => (
            <article key={item.label} className="contact-info-item">
              <div className="contact-info-icon">{item.icon}</div>
              <div>
                <p className="contact-info-label">{item.label}</p>
                <strong>{item.value}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="contact-content-grid" id="contact-form">
          <div>
            <span className="eyebrow">Envoyez-nous un message</span>
            <h2
              style={{
                margin: "16px 0 12px",
                fontSize: "clamp(2rem, 3.8vw, 3.4rem)",
              }}
            >
              Parlons de votre besoin.
            </h2>
            <p className="section-copy">
              Formation catalogue, projet intra, parcours blended, espace
              client, portail apprenant, LMS, administration, migration ou
              refonte : nous pouvons vous orienter vers la bonne option.
            </p>
            <div className="catalog-highlight-list" style={{ marginTop: 20 }}>
              <div className="catalog-highlight-item">
                <strong>Demande commerciale</strong>
                <span>
                  Qualification rapide de votre besoin, périmètre et délais.
                </span>
              </div>
              <div className="catalog-highlight-item">
                <strong>Projet entreprise</strong>
                <span>
                  Parcours intra, académie métier, planning et estimation
                  budgétaire.
                </span>
              </div>
              <div className="catalog-highlight-item">
                <strong>Projet plateforme</strong>
                <span>
                  Catalogue, tunnel commercial, espace client, LMS et stratégie
                  de montée en charge.
                </span>
              </div>
            </div>
          </div>

          <ContactForm />
        </section>
      </div>
    </main>
  );
}
