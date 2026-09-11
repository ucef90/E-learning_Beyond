"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ContactRound,
  GraduationCap,
  Phone,
  Users,
} from "lucide-react";

const links = [
  { href: "/formations", label: "Formations" },
  { href: "/entreprises", label: "Entreprises" },
  { href: "/expertises", label: "Expertises" },
  { href: "/ressources", label: "Ressources" },
  { href: "/contact", label: "Contact" },
] as const;

const LMS_LEARNER_URL = process.env.NEXT_PUBLIC_LMS_LEARNER_URL || "/apprenant";
const LMS_TRAINER_URL = process.env.NEXT_PUBLIC_LMS_TRAINER_URL || "/formateur";
const CLIENT_PORTAL_URL = "/espace";

export function Header() {
  const pathname = usePathname();
  const isLearning =
    pathname.startsWith("/apprentissage") ||
    pathname.startsWith("/formations/");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`site-header${isLearning ? " header-learning" : ""}`}>
      <div className="header-topbar">
        <div className="page-shell header-topbar-inner">
          <div className="header-topbar-copy">
            <span>Formations inter, intra et parcours entreprise</span>
            <span>Catalogue premium data, IA, projet, agile et product</span>
          </div>
          <div className="header-topbar-actions">
            <a href="/contact" className="header-topbar-link">
              <Phone size={14} />
              <span>Parler à un conseiller</span>
            </a>
            <Link href="/contact" className="header-topbar-link">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="page-shell header-main-shell">
        <div className="card header-main">
          <Link href="/" className="brand-lockup" aria-label="Beyond Expertise">
            <Image
              src="/logo-beyond.png"
              alt="Beyond Expertise"
              width={235}
              height={84}
              priority
              className="brand-logo"
            />
          </Link>

          <div className="header-nav-stack">
            <nav className="header-nav-primary">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="header-nav-link"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="header-quick-links">
              <Link href="/formations" className="header-quick-pill">
                Formations les plus demandées
              </Link>
              <Link href="/expertises/copilot" className="header-quick-pill">
                Copilot
              </Link>
              <Link href="/expertises/ai-agents" className="header-quick-pill">
                Agents IA
              </Link>
              <Link href="/expertises/llmops" className="header-quick-pill">
                LLMOps
              </Link>
            </div>
          </div>

          <div className="header-cta-stack">
            <Link
              href="/contact"
              className="button button-secondary header-contact-button"
            >
              <ContactRound size={17} />
              Contactez-nous
            </Link>
            <div className="header-space-menu" ref={menuRef}>
              <button
                type="button"
                className="button button-accent header-space-trigger"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                Mon espace
                <ChevronDown size={16} />
              </button>

              {menuOpen ? (
                <div className="header-space-dropdown" role="menu">
                  <a
                    href={LMS_LEARNER_URL}
                    className="header-space-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <GraduationCap size={17} />
                    <div>
                      <strong>Espace apprenant</strong>
                      <span>Cours, exercices et suivi de progression</span>
                    </div>
                  </a>
                  <a
                    href={LMS_TRAINER_URL}
                    className="header-space-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Users size={17} />
                    <div>
                      <strong>Espace formateur</strong>
                      <span>Sessions, présence, contenus, évaluations</span>
                    </div>
                  </a>
                  <Link
                    href={CLIENT_PORTAL_URL}
                    className="header-space-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ContactRound size={17} />
                    <div>
                      <strong>Espace client</strong>
                      <span>Demandes, devis, validations et documents</span>
                    </div>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
