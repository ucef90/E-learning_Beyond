"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
const VisitorAssistant = dynamic(
  () => import("./visitor-assistant").then((m) => m.VisitorAssistant),
  { ssr: false },
);
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
      {!privatePage && <VisitorAssistant />}
    </>
  );
}
