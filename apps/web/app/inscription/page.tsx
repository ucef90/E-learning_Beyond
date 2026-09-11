import { EnrollmentForm } from "@/components/forms";

export default async function SignupPage({
  searchParams
}: {
  searchParams: Promise<{ training?: string }>;
}) {
  const { training } = await searchParams;

  return (
    <main className="section page-main-compact">
      <div className="page-shell" style={{ maxWidth: 640 }}>
        <span className="eyebrow">Inscription</span>
        <h1 className="section-title">Déposer une demande d’inscription à une formation.</h1>
        <p className="section-copy">
          Cette page alimente désormais le tunnel commercial réel. La demande est enregistrée en base et peut être reliée directement à une formation du catalogue.
        </p>
        <EnrollmentForm initialTrainingSlug={training} />
      </div>
    </main>
  );
}
