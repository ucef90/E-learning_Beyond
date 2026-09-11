"use client";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/learning-api";
export default function Recovery() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setToken(window.location.hash.slice(1));
    window.history.replaceState(null, "", window.location.pathname);
  }, []);
  async function reset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const r = await api("/auth/reset", "POST", {
        token,
        password: f.get("password"),
      });
      setMessage(r.message);
      setToken("");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="learning login-shell" id="contenu">
      <h1>Récupérer votre accès</h1>
      {token ? (
        <form className="learning-form" onSubmit={reset}>
          <label>
            Nouveau mot de passe · 12 caractères minimum
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
            />
          </label>
          <button className="button button-primary" disabled={busy}>
            Enregistrer mon mot de passe
          </button>
        </form>
      ) : (
        <p>
          Pour ce pilote, demandez un lien personnel à l’administrateur par le
          canal convenu avec l’organisme. Après vérification de votre identité,
          il vous transmettra un lien valable une heure. Aucun envoi automatique
          d’e-mail n’est activé.
        </p>
      )}
      <p role="status">{message}</p>
      <Link href="/connexion">Revenir à la connexion</Link>
    </main>
  );
}
