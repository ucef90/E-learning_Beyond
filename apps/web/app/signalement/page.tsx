import { QualityLayout, QualityCard } from "@/components/quality-layout";
import { QualityForm } from "@/components/quality-form";
export const metadata = {
  title: "Signaler une situation préoccupante | Beyond Expertise",
};
export default function Page() {
  return (
    <QualityLayout
      title="Signaler une situation préoccupante."
      intro="Une situation de violence, de harcèlement ou de discrimination en lien avec votre formation peut être signalée au centre."
    >
      <QualityCard title="Un canal de signalement">
        <p>
          Ce formulaire n’est pas surveillé en continu et ne constitue pas un
          service d’urgence. En cas de danger immédiat, contactez les services
          d’urgence.
        </p>
        <p>
          Décrivez seulement les éléments utiles à une première prise de
          contact. N’ajoutez pas de pièce sensible ni les coordonnées de tiers.
          Votre message est accessible aux administrateurs habilités de cette
          plateforme ; ce canal n’est pas anonyme.
        </p>
        <p>
          Vous pouvez également appeler le centre. La personne responsable des
          signalements et un interlocuteur alternatif en cas de conflit
          d’intérêts doivent être désignés par le centre avant ouverture au
          public.
        </p>
      </QualityCard>
      <QualityForm kinds={["ALERT"]} />
    </QualityLayout>
  );
}
