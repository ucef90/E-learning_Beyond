"use client";
import Link from "next/link";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
const references = [
  ["BNP Paribas", "bnpparibas.com"],
  ["Orange", "orange.com"],
  ["Renault", "renault.com"],
  ["Alten", "alten.com"],
  ["IBM", "ibm.com"],
  ["Société Générale", "societegenerale.com"],
  ["Capgemini", "capgemini.com"],
  ["Thales", "thalesgroup.com"],
  ["Médiamétrie · Paris", "mediametrie.fr"],
];
function LogoSequence({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      className="reference-logo-sequence"
      aria-hidden={duplicate || undefined}
    >
      {references.map(([name, domain]) => (
        <li className="home-logo-item" key={domain}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              domain === "mediametrie.fr"
                ? "/references/mediametrie.svg"
                : `/references/${domain}.ico`
            }
            width={38}
            height={38}
            alt=""
            decoding="async"
          />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}
export function ClientReferences() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="section-tight references-section" id="references">
      <div className="page-shell">
        <div className="home-logos-band">
          <div className="home-logos-head">
            <div>
              <span className="eyebrow">Références professionnelles</span>
              <h2>
                Ils nous ont fait confiance,
                <br />
                <span>et à nos formateurs aussi.</span>
              </h2>
            </div>
            <div className="references-controls">
              <Link href="/contact" className="button button-secondary">
                Parlons de votre projet
              </Link>
              <button
                type="button"
                className="references-pause"
                onClick={() => setPaused(!paused)}
                aria-pressed={paused}
                aria-controls="reference-logo-track"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
                {paused ? "Reprendre le défilement" : "Suspendre le défilement"}
              </button>
            </div>
          </div>
          <p className="section-copy references-context">
            Des missions réalisées par les formateurs missionnés par Beyond
            Expertise, notamment en sous-traitance, auprès de ces organisations.
          </p>
          <div
            className="references-marquee"
            tabIndex={0}
            role="region"
            aria-label="Logos des références, défilement suspendu au survol ou au clavier"
          >
            <div
              className="references-track"
              id="reference-logo-track"
              data-paused={paused}
            >
              <LogoSequence />
              <LogoSequence duplicate />
            </div>
          </div>
          <p className="reference-footnote">
            Les références incluent des interventions via des partenaires ;
            elles ne désignent pas toutes une relation contractuelle directe
            avec l’organisation citée.
          </p>
        </div>
      </div>
    </section>
  );
}
