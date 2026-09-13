"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

const photographs = [
  {
    id: "formateur-salle-v2",
    title: "Transmettre et faire pratiquer",
    category: "Animation en salle",
    referencePhoto: true,
    alt: "Mise en situation créée par IA à partir d’une photo du formateur : en costume bleu clair, il anime une séance devant des apprenants.",
  },
  {
    id: "atelier-collaboratif",
    title: "Apprendre ensemble",
    category: "Travail en groupe",
    alt: "Scène d’illustration : quatre professionnels échangent autour de documents et d’ordinateurs dans une salle de formation.",
  },
  {
    id: "formateur-reunion-v2",
    title: "Construire les projets ensemble",
    category: "Réunion de travail",
    referencePhoto: true,
    alt: "Mise en situation créée par IA à partir d’une photo du formateur : il échange avec trois collègues autour d’une table de réunion.",
  },
  {
    id: "echanges-apprenants",
    title: "Partager les points de vue",
    category: "Échanges entre apprenants",
    alt: "Scène d’illustration : trois professionnels discutent pendant une pause, près d’une salle de formation.",
  },
  {
    id: "remise-diplome-mba",
    title: "Marquer une étape",
    category: "Remise de diplôme MBA",
    alt: "Scène d’illustration : une diplômée en robe et toque MBA reçoit un porte-diplôme devant d’autres participants.",
  },
  {
    id: "remise-diplome-doctoral",
    title: "Célébrer le chemin parcouru",
    category: "Remise de diplôme doctoral",
    alt: "Scène d’illustration : un diplômé en tenue doctorale tient son porte-diplôme et échange avec deux proches.",
  },
];

export function ExecutiveGallery() {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const isOpen = active !== null;
  const photograph = active === null ? null : photographs[active];

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => {
      if (modal.open) modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function move(direction: number) {
    setActive((current) =>
      current === null
        ? null
        : (current + direction + photographs.length) % photographs.length,
    );
  }

  return (
    <section
      id="galerie"
      className="executive-gallery"
      aria-labelledby="executive-gallery-title"
    >
      <div className="executive-gallery-heading">
        <div>
          <span className="executive-eyebrow">La galerie</span>
          <h2 id="executive-gallery-title">
            Des échanges aux moments de fierté.
          </h2>
        </div>
        <p>
          Une séance avec le formateur, un projet discuté en équipe, une étape
          célébrée : six scènes pour se projeter dans un parcours MBA ou DBA.
        </p>
      </div>
      <div className="executive-gallery-grid">
        {photographs.map((photo, index) => (
          <figure key={photo.id}>
            <button
              type="button"
              className="executive-gallery-open"
              aria-label={`Agrandir : ${photo.category}`}
              aria-haspopup="dialog"
              onClick={() => setActive(index)}
            >
              <Image
                src={`/media/executive/galerie/${photo.id}.png`}
                alt={photo.alt}
                width={1536}
                height={1024}
                sizes="(max-width: 640px) 94vw, (max-width: 1280px) 47vw, 586px"
                quality={80}
              />
              <span className="executive-gallery-expand" aria-hidden="true">
                <Expand size={19} />
              </span>
            </button>
            <figcaption>
              <strong>{photo.title}</strong>
              <span>{photo.category}</span>
              {photo.referencePhoto && (
                <small>
                  Mise en situation IA à partir d’une photo du formateur
                </small>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="executive-gallery-note">
        Galerie d’illustration créée par IA. Les mises en situation du formateur
        utilisent une photo fournie ; les autres personnages sont fictifs. Ces
        scènes ne documentent pas des événements réels.
      </p>

      <dialog
        ref={dialog}
        className="executive-gallery-dialog"
        aria-labelledby="executive-gallery-dialog-title"
        aria-describedby="executive-gallery-dialog-note"
        onClose={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const controls =
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                "button:not([disabled])",
              );
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            dialog.current?.close();
        }}
      >
        <div className="executive-gallery-dialog-bar">
          <span>Galerie MBA & DBA</span>
          <button
            type="button"
            className="executive-gallery-control"
            aria-label="Fermer la galerie"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            <X size={23} />
          </button>
        </div>
        {photograph && (
          <Image
            key={photograph.id}
            className="executive-gallery-large"
            src={`/media/executive/galerie/${photograph.id}.png`}
            alt={photograph.alt}
            width={1536}
            height={1024}
            sizes="(max-width: 1160px) 94vw, 1088px"
            quality={85}
            loading="eager"
          />
        )}
        <div className="executive-gallery-dialog-footer">
          <div aria-live="polite" aria-atomic="true">
            <h2 id="executive-gallery-dialog-title">{photograph?.title}</h2>
            <p>
              {photograph?.category} · {active === null ? 0 : active + 1} /{" "}
              {photographs.length}
            </p>
          </div>
          <div className="executive-gallery-navigation">
            <button
              type="button"
              className="executive-gallery-control"
              aria-label="Image précédente"
              onClick={() => move(-1)}
            >
              <ArrowLeft size={22} />
            </button>
            <button
              type="button"
              className="executive-gallery-control"
              aria-label="Image suivante"
              onClick={() => move(1)}
            >
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
        <p id="executive-gallery-dialog-note">
          {photograph?.referencePhoto
            ? "Mise en situation IA à partir d’une photo du formateur · Autres personnages fictifs"
            : "Illustration créée par IA · Personnages fictifs"}
        </p>
      </dialog>
    </section>
  );
}
