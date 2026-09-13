"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/learning-api";
import { programmeBySlug } from "@/lib/executive";
import { centre } from "@/lib/centre";
export function CampaignReceipt() {
  const [receipt, setReceipt] = useState<any>(null),
    [error, setError] = useState(""),
    [whatsapp, setWhatsapp] = useState("");
  useEffect(() => {
    let live = true;
    async function load() {
      try {
        const saved = JSON.parse(
          sessionStorage.getItem("beyond-lead-receipt") || "null",
        );
        if (!saved?.requestKey)
          throw Error("Aucune demande récente à confirmer sur ce navigateur.");
        const r = await api("/campaigns/receipt", "POST", {
          requestKey: saved.requestKey,
        });
        if (live) setReceipt(r);
      } catch (e) {
        if (live) setError((e as Error).message);
      }
    }
    void load();
    void api("/campaigns/configuration")
      .then((c) => {
        if (live) setWhatsapp(c.whatsapp);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  if (error)
    return (
      <div className="campaign-receipt">
        <h1>Retrouvons votre projet.</h1>
        <p role="status">{error}</p>
        <Link className="button button-primary" href="/afrique#demande">
          Faire une demande
        </Link>
      </div>
    );
  if (!receipt) return <p role="status">Vérification de votre confirmation…</p>;
  const p = programmeBySlug(receipt.programmeSlug);
  return (
    <div className="campaign-receipt">
      <span className="executive-eyebrow">Demande enregistrée</span>
      <h1>Votre prochaine étape commence ici.</h1>
      <p>
        Votre référence : <strong>{receipt.reference}</strong>. Conservez-la
        pour échanger avec notre équipe.
      </p>
      <h2>
        {p?.kind} — {p?.title}
      </h2>
      <p>
        Votre demande est disponible pour les conseillers Beyond. Les tarifs, le
        calendrier et les conditions d’admission vous seront précisés lors de
        cet échange. Aucun paiement ni inscription définitive n’a été effectué.
      </p>
      <div className="campaign-actions">
        {p && (
          <a
            className="button button-accent"
            data-programme={p.slug}
            href={"/programmes-executive/" + p.slug + ".pdf"}
            download
          >
            Télécharger ma brochure PDF
          </a>
        )}
        <a className="button button-secondary" href={centre.phoneHref}>
          Appeler Beyond Expertise
        </a>
        {whatsapp && (
          <a
            className="button button-secondary"
            data-programme={p?.slug}
            href={
              "https://wa.me/" +
              whatsapp +
              "?text=" +
              encodeURIComponent(
                "Bonjour, je souhaite échanger sur mon projet " +
                  (p?.kind || "") +
                  " " +
                  (p?.title || "") +
                  ". Référence " +
                  receipt.reference,
              )
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Parler sur WhatsApp
          </a>
        )}
      </div>
      <div className="campaign-next">
        <h2>Préparer votre candidature</h2>
        <p>
          Munissez-vous de votre parcours académique, de votre expérience
          professionnelle et d’une présentation de votre projet. L’admission
          fait l’objet d’une étude de dossier.
        </p>
        <Link
          className="button button-primary"
          href={{
            pathname: "/mba-dba/candidature",
            query: { programme: receipt.programmeSlug },
          }}
        >
          Présenter ma candidature
        </Link>
        <Link
          href={{
            pathname: "/afrique",
            query: { programme: receipt.programmeSlug, demande: "CALLBACK" },
            hash: "demande",
          }}
        >
          Demander un rappel ou un rendez-vous
        </Link>
      </div>
    </div>
  );
}
