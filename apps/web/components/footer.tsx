import Link from "next/link";
import { CentreContact, qualityLinks } from "./quality-layout";

export function Footer() {
  return (
    <footer className="section footer-shell">
      <div className="page-shell">
        <div className="footer-top card">
          <div className="grid footer-grid">
            <div>
              <span className="premium-category-accent">Beyond Expertise</span>
              <h3 style={{ marginTop: 14 }}>
                Des formations pour développer vos compétences en data et en IA.
              </h3>
              <p className="section-copy">
                Une structure pensée pour les organismes de formation modernes
                et les entreprises qui veulent accélérer les compétences
                critiques sur la data, l'IA, le pilotage et la transformation.
              </p>
              <div className="footer-tags">
                {[
                  "Data & BI",
                  "AI & Copilot",
                  "PMO & Agile",
                  "Business Analysis",
                ].map((item) => (
                  <span key={item} className="trust-pill">
                    {item}
                  </span>
                ))}
              </div>
              <p className="section-copy">
                Démarche de certification Qualiopi en cours. Certification non
                acquise.
              </p>
            </div>
            <div>
              <h4>Catalogue</h4>
              <p>
                <Link href="/formations">Catalogue</Link>
              </p>
              <p>
                <Link href="/expertises">Expertises</Link>
              </p>
              <p>
                <Link href="/ressources">Ressources</Link>
              </p>
              <p>
                <Link href="/devis">Demander un devis</Link>
              </p>
            </div>
            <div>
              <h4>Plateforme</h4>
              <p>
                <Link href="/contact#contact-form">Suivi de demande</Link>
              </p>
              <p>
                <Link href="/apprenant">LMS Apprenant</Link>
              </p>
              <p>
                <Link href="/formateur">Espace formateur</Link>
              </p>
              <p>
                <Link href="/admin/commercial">Back-office</Link>
              </p>
            </div>
            <div>
              <h4>Entreprise</h4>
              <p>
                <Link href="/a-propos">À propos</Link>
              </p>
              <p>
                <Link href="/entreprises">Solutions entreprises</Link>
              </p>
              <p>
                <Link href="/methodologie">Méthodologie</Link>
              </p>
              <p>
                <Link href="/contact">Contact</Link>
              </p>
            </div>
          </div>
        </div>
        <CentreContact />
        <nav
          className="quality-nav"
          aria-label="Qualité et informations légales"
        >
          {qualityLinks.map(([href, label]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Données personnelles</Link>
          <Link href="/rgpd-ai-act">Formations RGPD et AI Act</Link>
          <Link href="/transparence-ia">Usages de l’IA</Link>
          <Link href="/vos-droits">Exercer vos droits</Link>
          <Link href="/signalement">Signalement</Link>
        </nav>
        <div className="footer-bottom">
          <span>
            © 2026 Beyond Expertise — Organisme de formation et de conseil
          </span>
          <span>Data, IA et formation professionnelle</span>
        </div>
      </div>
    </footer>
  );
}
