import Link from "next/link";
import { ContactForm } from "@/components/forms";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
export const metadata = { title: "Contact | Beyond Expertise" };
export default function Page() {
  return (
    <QualityLayout
      title="Parlons de votre formation."
      intro="Un programme détaillé, un projet d’équipe ou une question sur votre parcours : contactez Beyond Expertise."
    >
      <div className="quality-grid">
        <QualityCard title="Un projet de formation">
          <p>
            Indiquez le sujet, le nombre de participants, le niveau actuel et
            vos objectifs. Les modalités, le tarif et le calendrier seront à
            confirmer avec le centre.
          </p>
          <Link href="/positionnement" className="button button-secondary">
            Décrire mes besoins
          </Link>
        </QualityCard>
        <QualityCard title="Besoin d’aide ?">
          <p>
            Retrouvez l’assistance, les demandes d’aménagement, les réclamations
            et les questionnaires d’appréciation.
          </p>
          <Link href="/assistance" className="button button-secondary">
            Obtenir de l’aide
          </Link>
        </QualityCard>
      </div>
      <section id="contact-form" className="quality-grid">
        <div>
          <h2>Envoyez-nous votre demande</h2>
          <p>
            Pour obtenir plus de détails ou le programme détaillé, contactez le
            centre Beyond Expertise.
          </p>
          <p>
            Les horaires et le lieu d’accueil doivent être confirmés auprès du
            centre avant un déplacement.
          </p>
          <p className="quality-note">
            Le formulaire enregistre votre demande auprès de Beyond. Aucun
            email de confirmation n’est envoyé automatiquement.
          </p>
        </div>
        <ContactForm />
      </section>
    </QualityLayout>
  );
}
