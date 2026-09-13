import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CampaignAdmin } from "@/components/campaign-admin";
import { CommercialBoard } from "@/components/commercial-board";
export const dynamic = "force-dynamic";
export default async function CommercialAdminPage() {
  const headers = { cookie: (await cookies()).toString() };
  const base = process.env.API_INTERNAL_URL || "http://127.0.0.1:4200/api/v1";
  const identity = await fetch(`${base}/auth/me`, {
    headers,
    cache: "no-store",
  });
  if (!identity.ok) redirect("/connexion");
  const user = await identity.json();
  if (!user.roles.includes("ADMIN"))
    return (
      <main className="learning" id="contenu">
        <h1>Accès réservé à l’administration</h1>
      </main>
    );
  const data = await Promise.all(
    ["/admin/commercial/overview", "/contacts", "/quotes", "/enrollments"].map(
      async (path) => {
        const res = await fetch(base + path, { headers, cache: "no-store" });
        if (!res.ok) throw Error("Données commerciales indisponibles");
        return res.json();
      },
    ),
  );
  return (
    <main className="learning" id="contenu">
      <h1>Suivi des demandes commerciales</h1>
      <CampaignAdmin />
      <CommercialBoard
        initialOverview={data[0]}
        initialContacts={data[1]}
        initialQuotes={data[2]}
        initialEnrollments={data[3]}
      />
    </main>
  );
}
