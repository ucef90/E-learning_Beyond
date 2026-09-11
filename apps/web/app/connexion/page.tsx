"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { api } from "@/lib/learning-api";
export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      await api("/auth/login", "POST", {
        email: form.get("email"),
        password: form.get("password"),
      });
      window.location.assign("/apprentissage");
    } catch (e) {
      setMessage((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <main className="learning login-shell" id="contenu">
      <p className="learning-kicker">Beyond Expertise · Espace de formation</p>
      <h1>Retrouvez votre parcours.</h1>
      <p>
        Connectez-vous pour reprendre vos leçons, pratiquer et consulter les
        retours de votre formateur.
      </p>
      <form onSubmit={login} className="learning-form">
        <label>
          Adresse e-mail
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Mot de passe
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={12}
            maxLength={128}
            required
          />
        </label>
        <p role="alert">{message}</p>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>
        <Link href="/recuperation">Récupérer mon accès</Link>
      </form>
      <p className="learning-note">
        Un compte donne accès uniquement aux modules qui vous ont été attribués.
      </p>
    </main>
  );
}
