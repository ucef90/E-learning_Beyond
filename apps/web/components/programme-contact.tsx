import Link from "next/link";

export function ProgrammeContact() {
  return (
    <div className="programme-contact">
      <p>
        Pour obtenir plus de détails ou le programme détaillé, contactez le
        centre Beyond Expertise.
      </p>
      <Link className="button button-primary" href="/contact#contact-form">
        Contacter le centre
      </Link>
    </div>
  );
}
