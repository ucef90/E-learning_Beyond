"use client";
import { useState } from "react";
import { api, download } from "@/lib/learning-api";
export function PersonalData() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <p>
        Si vous êtes connecté, téléchargez les données rattachées à votre compte
        : profil, parcours, progression, quiz, brouillons et travaux. Les
        demandes publiques ne sont pas reliées automatiquement à un compte par
        leur seul email ; demandez-les au centre.
      </p>
      <button
        className="button button-secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMessage("");
          try {
            download("mes-donnees-beyond.json", await api("/auth/my-data"));
            setMessage(
              "Export téléchargé. Ce fichier contient vos données personnelles : conservez-le dans un emplacement protégé.",
            );
          } catch {
            setMessage(
              "Export indisponible. Connectez-vous à votre compte puis réessayez, ou adressez votre demande au centre.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Préparation…" : "Télécharger les données de mon compte"}
      </button>
      <p role="status">{message}</p>
      <a href="/connexion">Accéder à ma connexion</a>
    </div>
  );
}
