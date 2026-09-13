import Link from "next/link";
import { ExecutivePhoto } from "./executive-photo";
import { ExecutiveGallery } from "./executive-gallery";
import { ArrowRight } from "lucide-react";
import { ExecutiveCatalogue } from "./executive-catalogue";
import { credentialNote, launchNote } from "@/lib/executive";

export function ExecutiveHome({ kind }: { kind?: "MBA" | "DBA" }) {
  const doctoral = kind === "DBA";
  return (
    <main id="contenu" className="executive page-shell">
      <section className="executive-hero executive-hero-photographic">
        <div className="executive-hero-copy">
          <span className="executive-eyebrow">
            Beyond Executive Education · Afrique & international
          </span>
          <h1>
            {doctoral ? (
              <>
                Une recherche exigeante.
                <br />
                <em>Un impact sur le terrain.</em>
              </>
            ) : kind === "MBA" ? (
              <>
                Prenez la direction
                <br />
                <em>de votre prochain défi.</em>
              </>
            ) : (
              <>
                MBA & DBA.
                <br />
                <em>Donnez une nouvelle portée à vos décisions.</em>
              </>
            )}
          </h1>
          <p>
            {doctoral
              ? "Dix axes de recherche appliquée en administration des affaires pour interroger vos pratiques, produire des résultats solides et faire évoluer les organisations."
              : "Des parcours pour les professionnels qui dirigent, transforment et entreprennent. Une spécialisation métier, des situations africaines et internationales, un projet à défendre."}
          </p>
          <div className="executive-actions">
            <a href="#parcours" className="button button-accent">
              {doctoral ? "Explorer les axes DBA" : "Explorer les parcours"}{" "}
              <ArrowRight size={18} />
            </a>
            <Link href="/mba-dba/candidature" className="executive-text-link">
              Parler de mon projet <ArrowRight size={17} />
            </Link>
          </div>
          <a href="#galerie" className="executive-gallery-link">
            Découvrir la galerie <ArrowRight size={17} />
          </a>
        </div>
        <div className="executive-hero-visual">
          <ExecutivePhoto kind={doctoral ? "DBA" : "MBA"} priority />
          <aside className="executive-hero-aside">
            <span>Du terrain à la décision</span>
            <ol>
              <li>
                <b>01</b>
                <div>
                  <strong>{doctoral ? "Questionner" : "Comprendre"}</strong>
                  <p>
                    {doctoral
                      ? "Une problématique réelle, un terrain accessible."
                      : "Un diagnostic, des sources, un enjeu précis."}
                  </p>
                </div>
              </li>
              <li>
                <b>02</b>
                <div>
                  <strong>{doctoral ? "Investiguer" : "Expérimenter"}</strong>
                  <p>
                    {doctoral
                      ? "Une méthode justifiée, des résultats traçables."
                      : "Des cas, des outils et un projet appliqué."}
                  </p>
                </div>
              </li>
              <li>
                <b>03</b>
                <div>
                  <strong>{doctoral ? "Contribuer" : "Décider"}</strong>
                  <p>
                    {doctoral
                      ? "Une contribution discutée, des recommandations étayées."
                      : "Une proposition argumentée, des effets mesurés."}
                  </p>
                </div>
              </li>
            </ol>
            <Link href={doctoral ? "/mba" : "/dba"}>
              {doctoral
                ? "Découvrir aussi les MBA"
                : "Découvrir les parcours DBA"}{" "}
              <ArrowRight size={18} />
            </Link>
          </aside>
        </div>
      </section>
      <div className="executive-facts">
        <p>
          <strong>{doctoral ? "24 à 36 mois" : "12 mois pour les MBA"}</strong>
          <span>Durée cible à confirmer par cohorte</span>
        </p>
        <p>
          <strong>À distance, avec accompagnement</strong>
          <span>Ressources, classes virtuelles et retours pédagogiques</span>
        </p>
        <p>
          <strong>Français · contexte international</strong>
          <span>Rythme compatible avec une activité professionnelle</span>
        </p>
      </div>
      <ExecutiveCatalogue kind={kind} />
      <section className="executive-approach">
        <div>
          {!kind && <ExecutivePhoto kind="DBA" />}
          <span className="executive-eyebrow">L’expérience Beyond</span>
          <h2>Ce que vous produisez compte autant que ce que vous apprenez.</h2>
          <p>
            Chaque parcours précise ses objectifs, ses livrables et ses critères
            d’évaluation. Le terrain d’application peut être celui de votre
            organisation, après accord et protection des informations
            confidentielles.
          </p>
          <Link href="/mba-dba/pedagogie" className="button button-secondary">
            Comprendre l’accompagnement <ArrowRight size={18} />
          </Link>
        </div>
        <ol className="executive-step-list">
          <li>
            <strong>Un diagnostic de départ</strong>
            <p>
              Votre expérience, votre projet et vos contraintes déterminent le
              parcours et les adaptations à prévoir.
            </p>
          </li>
          <li>
            <strong>Un travail qui se construit</strong>
            <p>
              Préparation en autonomie, échanges avec le formateur et livrables
              appliqués s’articulent au fil des modules.
            </p>
          </li>
          <li>
            <strong>Des retours pour progresser</strong>
            <p>
              Les productions sont examinées à partir de critères annoncés. Les
              corrections et reprises font partie du parcours.
            </p>
          </li>
          <li>
            <strong>Une proposition que vous défendez</strong>
            <p>
              Le projet final ou la recherche relie vos analyses à une décision,
              en exposant les résultats et leurs limites.
            </p>
          </li>
        </ol>
      </section>
      <ExecutiveGallery />
      <section className="executive-admissions">
        <div>
          <span className="executive-eyebrow">Admissions</span>
          <h2>Votre expérience est le point de départ.</h2>
          <p>{launchNote}</p>
        </div>
        <div>
          <ol>
            <li>Décrivez votre parcours et votre projet.</li>
            <li>Échangez avec Beyond sur l’adéquation du programme.</li>
            <li>Recevez les conditions écrites avant de vous engager.</li>
          </ol>
          <Link href="/mba-dba/candidature" className="button button-accent">
            Déposer ma demande <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="executive-assurance">
        <h2>Une information claire sur le parcours et le titre visé</h2>
        <p>{credentialNote}</p>
        <Link href="/mba-dba/certifications">
          Lire les informations sur les certifications et les titres{" "}
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}

export function ExecutiveHighlight() {
  return (
    <section className="section">
      <div className="page-shell">
        <div className="executive-highlight">
          <div>
            <span className="executive-eyebrow">
              Beyond Executive Education
            </span>
            <h2>
              Vos ambitions ont leur parcours.
              <br />
              MBA & DBA pour l’Afrique et l’international.
            </h2>
            <p>
              21 spécialisations MBA et 10 axes DBA : management, finance, data,
              santé, industrie et organisations. Explorez les programmes et
              préparez votre candidature.
            </p>
          </div>
          <div className="executive-actions">
            <Link href="/mba" className="button button-accent">
              Découvrir les MBA <ArrowRight size={18} />
            </Link>
            <Link href="/dba" className="executive-text-link">
              Explorer les DBA <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
