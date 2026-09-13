import "./globals.css";
import "./learning.css";
import "./experience.css";
import "./quality.css";
import "./home-restored.css";
import "./public-interactions.css";
import "./training-detail.css";
import "./assistant.css";
import "./course-studio.css";
import type { Metadata } from "next";
import { indexable } from "@/lib/seo";
import { ScrollProgress } from "@/components/scroll-progress";
import { PublicChrome } from "@/components/public-chrome";

export const metadata: Metadata = {
  title: "Beyond Expertise",
  robots: indexable()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  description:
    "Formations professionnelles en data, intelligence artificielle et gestion de projet. Programmes, accompagnement et demande de devis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ScrollProgress />
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
