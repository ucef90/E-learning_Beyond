import Image from "next/image";

const portraits = {
  MBA: {
    src: "/media/executive/mba-promotion.png",
    alt: "Scène illustrée : trois professionnels en tenue de remise de diplôme MBA, avec leurs porte-diplômes.",
  },
  DBA: {
    src: "/media/executive/dba-promotion.png",
    alt: "Scène illustrée : deux professionnels en tenue de remise de diplôme doctoral, avec leurs porte-diplômes.",
  },
};

export function ExecutivePhoto({
  kind,
  priority = false,
  compact = false,
}: {
  kind: "MBA" | "DBA";
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <figure
      className={`executive-photo${compact ? " executive-photo-compact" : ""}`}
    >
      <Image
        src={portraits[kind].src}
        alt={portraits[kind].alt}
        width={1536}
        height={1024}
        sizes={
          compact
            ? "(max-width: 760px) 90vw, 300px"
            : "(max-width: 760px) 90vw, 46vw"
        }
        quality={80}
        priority={priority}
      />
      <figcaption>
        {kind === "MBA"
          ? "Remise de diplôme MBA"
          : "Remise de diplôme doctoral"}
        <span>Visuel d’illustration · Personnages fictifs</span>
      </figcaption>
    </figure>
  );
}
