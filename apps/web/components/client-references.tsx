import Link from "next/link";
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
export function ClientReferences() {
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
            <Link href="/contact" className="button button-secondary">
              Parlons de votre projet
            </Link>
          </div>
          <p className="section-copy references-context">
            Des missions réalisées par les formateurs missionnés par Beyond
            Expertise, notamment en sous-traitance, auprès de ces organisations.
          </p>
          <div className="home-logos-grid">
            {references.map(([name, domain]) => (
              <div className="home-logo-item" key={domain}>
                {/* Brand assets are served locally, without requests to a logo service. */}
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
                  loading="lazy"
                />
                <span>{name}</span>
              </div>
            ))}
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
