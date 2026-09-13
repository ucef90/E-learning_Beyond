"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { api } from "@/lib/learning-api";
export default function LoginPage() {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [visible, setVisible] = useState(false);
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
    <main className="login-experience" id="contenu">
      <section className="login-story">
        <Link href="/" className="login-brand">
          <img
            src="/logo-beyond.png"
            width="134"
            height="48"
            alt="Beyond Expertise"
          />
        </Link>
        <div>
          <h1>
            Un espace pour <span>apprendre</span> et accompagner.
          </h1>
          <p>
            Vos cours, vos travaux et vos échanges pédagogiques réunis au même
            endroit.
          </p>
          <ul className="login-benefits">
            <li>
              <BookOpen size={22} />
              <div>
                <strong>Apprenant</strong>Reprenez vos cours et retrouvez votre
                progression.
              </div>
            </li>
            <li>
              <Users size={22} />
              <div>
                <strong>Formateur</strong>Suivez vos groupes et corrigez les
                travaux remis.
              </div>
            </li>
            <li>
              <ClipboardCheck size={22} />
              <div>
                <strong>Vos résultats restent disponibles</strong>Consultez les
                notes, corrections et conseils.
              </div>
            </li>
          </ul>
        </div>
        <Link href="/formations">
          <ArrowLeft size={17} />
          Retour au catalogue des formations
        </Link>
      </section>
      <section className="login-form-panel">
        <div className="learning">
          <span className="academy-caption">Bienvenue dans votre espace</span>
          <h2>Connectez-vous</h2>
          <p>
            Utilisez les identifiants transmis par votre centre. Votre compte
            ouvre automatiquement l’espace correspondant à votre rôle.
          </p>
          <form onSubmit={login} className="learning-form">
            <label>
              Adresse e-mail
              <input
                name="email"
                type="email"
                autoComplete="username"
                placeholder="vous@exemple.fr"
                required
              />
            </label>
            <label>
              Mot de passe
              <div className="login-password">
                <input
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={128}
                />
                <button
                  type="button"
                  aria-label={
                    visible
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>
            {message && (
              <p role="alert" className="academy-error">
                {message}
              </p>
            )}
            <button className="button button-primary" disabled={busy}>
              {busy ? "Connexion…" : "Accéder à mon espace"}
              <ArrowRight size={18} />
            </button>
            <Link href="/recuperation">Récupérer mon accès</Link>
          </form>
          <p className="login-form-foot">
            Pas encore de compte ? L’administrateur du centre crée votre accès
            et vous attribue vos cours ou vos groupes.
          </p>
        </div>
      </section>
    </main>
  );
}
