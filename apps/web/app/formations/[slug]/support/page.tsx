import { notFound } from "next/navigation";
import data from "@/lib/regulatory-catalogue.json";
import { QualityLayout, QualityCard } from "@/components/quality-layout";
import LessonContent from "@/components/lesson-content";
export function generateStaticParams() {
  return data.courses.map((c) => ({ slug: c.slug }));
}
export const metadata = {
  title: "Support de formation réglementaire | Beyond Expertise",
};
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = data.courses.find((c) => c.slug === slug);
  if (!c) notFound();
  return (
    <QualityLayout
      title={c.title}
      intro="Support intégral, exercices et corrigés pédagogiques. Version du 12 septembre 2026 ; validation du formateur requise avant animation."
    >
      <div className="regulatory-actions">
        <a href={"/formations/" + c.slug}>Revenir au programme</a>
        <a href={"/reglementation/" + c.code + "-support.md"} download>
          Télécharger le support et le quiz corrigé
        </a>
        <a href={"/reglementation/" + c.code + "-modeles.md"} download>
          Télécharger les cinq modèles
        </a>
        <a href="/apprentissage">Mon parcours et mon quiz</a>
      </div>
      <QualityCard title="Comment travailler ce parcours">
        <p>
          Deux journées de 7 heures hors pauses, avec ateliers et échanges.
          Chaque séquence représente 105 minutes d’apprentissage animé ; la
          dernière inclut un quiz de 20 minutes. La lecture seule ne vaut ni
          présence de 14 heures ni validation des acquis.
        </p>
        <p>
          Pour conserver votre progression et vos tentatives, utilisez votre
          parcours attribué dans l’espace apprenant. Les exercices sont réalisés
          sur des cas fictifs, puis discutés avec le formateur. Le dossier et la
          soutenance demandent une évaluation humaine séparée.
        </p>
        <h3>Avant de commencer</h3>
        <ul>
          {c.initialQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </QualityCard>
      <nav className="quality-nav" aria-label="Séquences du support">
        {c.lessons.map((l, i) => (
          <a key={l.title} href={"#sequence-" + (i + 1)}>
            {i + 1}. {l.title}
          </a>
        ))}
      </nav>
      <div className="regulatory-reader">
        {c.lessons.map((l, i) => (
          <section
            className="quality-card"
            key={l.title}
            id={"sequence-" + (i + 1)}
          >
            <p className="eyebrow">
              Jour {Math.floor(i / 4) + 1} · Séquence {i + 1}
            </p>
            <h2>{l.title}</h2>
            <LessonContent body={l.content} />
          </section>
        ))}
      </div>
      <QualityCard title="Références et suivi éditorial">
        <p>
          Rédaction originale assistée par IA. Textes et pages institutionnelles
          consultés le 12 septembre 2026. Le calendrier AI Act distingue le
          texte initial de 2024 et les mises à jour institutionnelles de 2026 ;
          une revue est nécessaire avant chaque session.
        </p>
        <ul>
          {c.references.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.title}
              </a>
            </li>
          ))}
        </ul>
        <p>
          Aucune certification officielle n’est délivrée par la lecture ou le
          quiz de ce parcours. Pour plus de détails ou le programme détaillé,
          contactez le centre.
        </p>
      </QualityCard>
    </QualityLayout>
  );
}
