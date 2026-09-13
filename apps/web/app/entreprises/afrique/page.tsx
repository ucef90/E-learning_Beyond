import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { executiveServices } from "@/lib/executive";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Formation et conseil pour les organisations en Afrique | Beyond Expertise",
  "Académies d’entreprise, conseil stratégique, transformation, expertise à temps partagé et accompagnement de la recherche.",
  "/entreprises/afrique",
);
export default function Page() {
  return (
    <main id="contenu" className="executive page-shell">
      <section className="executive-detail-hero">
        <div>
          <span className="executive-eyebrow">
            Entreprises, institutions et ONG
          </span>
          <h1>
            Développer vos équipes.
            <br />
            Faire avancer vos projets.
          </h1>
          <p>
            Formation, conseil et accompagnement pour les organisations en
            Afrique et à l’international. Chaque mission part d’un besoin
            concret, d’un périmètre défini et de livrables convenus.
          </p>
          <Link
            href="/mba-dba/candidature?programme=academies-entreprise"
            className="button button-accent"
          >
            Décrire mon besoin <ArrowRight size={18} />
          </Link>
        </div>
        <div>
          <h2>Un cadre de mission partagé</h2>
          <ol className="executive-step-list">
            <li>Diagnostic et objectifs</li>
            <li>Proposition, intervenants et calendrier</li>
            <li>Réalisation et points de décision</li>
            <li>Bilan, transmission et suite à donner</li>
          </ol>
        </div>
      </section>
      <section>
        <div className="executive-section-heading">
          <h2>Six formes d’accompagnement.</h2>
          <p>
            Choisissez une entrée ; le dispositif est ajusté après l’étude de
            votre situation.
          </p>
        </div>
        <div className="executive-service-list">
          {executiveServices.map((s, i) => (
            <article id={s.slug} key={s.slug}>
              <span className="executive-service-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <p className="executive-deliverable">
                  <strong>Livrables à convenir</strong>
                  {s.deliverable}
                </p>
              </div>
              <Link
                href={`/mba-dba/candidature?programme=${s.slug}`}
                className="button button-secondary"
              >
                Parler de ce besoin <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="executive-admissions">
        <div>
          <h2>Une cohorte MBA pour votre organisation</h2>
          <p>
            Combinez un socle de management, une spécialisation et un projet
            commun. Les conditions d’admission et d’évaluation restent
            individuelles.
          </p>
        </div>
        <Link href="/mba" className="button button-accent">
          Explorer les spécialisations MBA <ArrowRight size={18} />
        </Link>
      </section>
      <section className="executive-assurance">
        <h2>Des engagements adaptés à chaque mission</h2>
        <p>
          Les interventions relevant d’une profession réglementée nécessitent
          les compétences et autorisations appropriées. La composition de
          l’équipe, les pays d’intervention, les déplacements, les outils et les
          prestations incluses sont confirmés dans la proposition. Aucun bureau
          local ni partenariat institutionnel n’est annoncé sans validation.
        </p>
      </section>
    </main>
  );
}
