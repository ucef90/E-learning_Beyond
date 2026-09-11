"use client";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const privatePage = ["/apprentissage", "/connexion", "/recuperation"].some(
    (p) => path === p || path.startsWith(p + "/"),
  );
  return (
    <>
      {!privatePage && <Header />}
      {children}
      {!privatePage && <Footer />}
    </>
  );
}
