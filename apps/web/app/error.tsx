"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="learning login-shell" id="contenu">
      <h1>Ce contenu est temporairement indisponible.</h1>
      <p>
        Les données n’ont pas pu être chargées. Réessayez ou contactez
        l’organisme pour votre demande.
      </p>
      <div className="learning-actions">
        <button className="button button-primary" onClick={reset}>
          Réessayer
        </button>
        <Link href="/contact">Contacter Beyond Expertise</Link>
        <Link href="/connexion">Accéder à mes cours</Link>
      </div>
    </main>
  );
}
