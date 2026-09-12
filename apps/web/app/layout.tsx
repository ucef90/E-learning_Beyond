import "./globals.css";
import "./learning.css";
import "./experience.css";
import "./quality.css";
import "./home-restored.css";
import type { Metadata } from "next";
import { PublicChrome } from "@/components/public-chrome";

export const metadata: Metadata = {
  title: "Beyond Expertise",
  description:
    "Plateforme de formation premium, catalogue, portail apprenant et LMS évolutif.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
