"use client";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { api, download } from "@/lib/learning-api";

export default function Notebook({
  courseId,
  state,
  refresh,
  practice = false,
  hasCsv = true,
}: {
  practice?: boolean;
  hasCsv?: boolean;
  courseId: string;
  state: any;
  refresh: () => Promise<void>;
}) {
  const [book, setBook] = useState<any>(null),
    [revision, setRevision] = useState(0),
    [csv, setCsv] = useState("");
  const [message, setMessage] = useState("Chargement du notebook…"),
    [running, setRunning] = useState(false),
    [saving, setSaving] = useState(false),
    [dirty, setDirty] = useState(false),
    [ready, setReady] = useState(false),
    [kernel, setKernel] = useState(0),
    [result, setResult] = useState(""),
    [plots, setPlots] = useState<string[]>([]),
    [versions, setVersions] = useState<any>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let active = true;
    Promise.all([
      practice
        ? api(`/courses/${courseId}/resources/practice`)
        : state.draft
          ? Promise.resolve(state.draft.notebook)
          : api(`/courses/${courseId}/resources/starter`),
      hasCsv
        ? api(`/courses/${courseId}/resources/csv`)
        : Promise.resolve({ content: "" }),
    ])
      .then(([b, c]) => {
        if (active) {
          setBook(b);
          setCsv(c.content);
          setRevision(practice ? 0 : state.draft?.revision || 0);
          setMessage(
            practice
              ? "Atelier guidé chargé. Vos essais sont temporaires ; exportez le carnet pour les conserver."
              : state.draft
                ? `Version serveur ${state.draft.revision} chargée.`
                : "Notebook de départ chargé. Aucune sauvegarde serveur pour le moment.",
          );
        }
      })
      .catch((e) => setMessage(e.message));
    return () => {
      active = false;
    };
  }, [courseId, practice]);
  useEffect(() => {
    const receive = (e: MessageEvent) => {
      if (
        e.source !== frame.current?.contentWindow ||
        !e.data ||
        typeof e.data.type !== "string"
      )
        return;
      const d = e.data;
      if (d.type === "ready") setReady(true);
      if (d.type === "status") setMessage(String(d.text));
      if (["result", "error"].includes(d.type)) {
        if (timeout.current) clearTimeout(timeout.current);
        setRunning(false);
        setResult(String(d.text).slice(0, 60000));
        setPlots(
          (Array.isArray(d.plots) ? d.plots : [])
            .filter(
              (p: any) =>
                typeof p === "string" &&
                p.length < 1000000 &&
                /^[A-Za-z0-9+/=]+$/.test(p),
            )
            .slice(0, 5),
        );
        setVersions(d.versions || null);
        setMessage(
          d.type === "result"
            ? practice
              ? "Exécution terminée. Exportez votre atelier pour conserver vos essais."
              : "Exécution terminée dans votre navigateur. Pensez à sauvegarder."
            : "L’exécution a rencontré une erreur. Corrigez le code ou exportez le notebook.",
        );
        setBook((b: any) => {
          if (!b) return b;
          const cells = [...b.cells];
          const i = cells.findLastIndex((c: any) => c.cell_type === "code");
          if (i >= 0)
            cells[i] = {
              ...cells[i],
              outputs: [
                {
                  output_type: "stream",
                  name: "stdout",
                  text: String(d.text).slice(0, 50000),
                },
              ],
            };
          return { ...b, cells };
        });
        setDirty(true);
      }
    };
    window.addEventListener("message", receive);
    return () => {
      window.removeEventListener("message", receive);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    const guard = (e: Event) => {
      if (
        dirty &&
        !window.confirm(
          "Votre notebook contient des modifications non sauvegardées. Quitter cette rubrique et les abandonner ?",
        )
      )
        e.preventDefault();
    };
    window.addEventListener("notebook-before-leave", guard);
    return () => window.removeEventListener("notebook-before-leave", guard);
  }, [dirty]);
  function change(i: number, text: string) {
    setBook({
      ...book,
      cells: book.cells.map((c: any, j: number) =>
        j === i ? { ...c, source: text } : c,
      ),
    });
    setDirty(true);
  }
  function stop() {
    if (timeout.current) clearTimeout(timeout.current);
    setRunning(false);
    setReady(false);
    setKernel((k) => k + 1);
    setMessage(
      "Calcul arrêté. Le code est conservé ; la mémoire Python est réinitialisée.",
    );
  }
  function run() {
    setRunning(true);
    setPlots([]);
    setResult("");
    setMessage("Préparation du calcul…");
    frame.current?.contentWindow?.postMessage(
      {
        type: "run",
        csv,
        code: book.cells
          .filter((c: any) => c.cell_type === "code")
          .map((c: any) =>
            Array.isArray(c.source) ? c.source.join("") : c.source,
          )
          .join("\n\n"),
      },
      "*",
    );
    timeout.current = setTimeout(() => {
      stop();
      setMessage(
        "Délai de 120 secondes atteint. Réessayez après le chargement initial ou utilisez l’export Jupyter.",
      );
    }, 120000);
  }
  async function save() {
    setSaving(true);
    try {
      const d = await api(`/courses/${courseId}/notebook`, "PUT", {
        notebook: book,
        revision,
      });
      setRevision(d.revision);
      setDirty(false);
      setMessage(
        `Sauvegardé sur le serveur · version ${d.revision} · ${new Date(d.updatedAt).toLocaleTimeString("fr-FR")}`,
      );
      await refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  async function submit() {
    setSaving(true);
    try {
      await api(`/courses/${courseId}/submissions`, "POST", {
        notebook: book,
        comment:
          (document.getElementById("submission-comment") as HTMLTextAreaElement)
            ?.value || "",
      });
      setMessage(
        "Travail remis au formateur. Une copie datée a été conservée sur le serveur.",
      );
      await refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  async function importBook(file?: File) {
    if (!file) return;
    if (file.size > 1500000) {
      setMessage("Fichier limité à 1,5 Mo.");
      return;
    }
    try {
      const b = JSON.parse(await file.text());
      if (
        b.nbformat !== 4 ||
        !Array.isArray(b.cells) ||
        !b.cells.length ||
        b.cells.length > 100 ||
        b.cells.some((c: any) => !["code", "markdown"].includes(c.cell_type))
      )
        throw Error("Notebook v4 invalide.");
      setBook(b);
      setDirty(true);
      setMessage(
        "Notebook importé sans exécution. Relisez le code avant de l’exécuter.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <section aria-labelledby="notebook-title">
      <h2 id="notebook-title">
        {practice ? "Atelier guidé" : "Votre notebook"}
      </h2>
      {practice ? (
        <p>
          Retrouvez ici les exercices des six leçons. Cet entraînement n’est pas
          noté. Exportez le carnet pour conserver vos essais ; vous pourrez le
          réimporter. Le TP possède une sauvegarde et une remise distinctes.
        </p>
      ) : (
        <p>
          Python s’exécute dans votre navigateur. Le bouton « Sauvegarder sur le
          serveur » synchronise votre notebook entre vos appareils. La mémoire
          de calcul est temporaire.
        </p>
      )}
      <iframe
        key={kernel}
        ref={frame}
        title="Moteur Python isolé"
        sandbox="allow-scripts allow-same-origin"
        src={
          (process.env.NEXT_PUBLIC_LAB_ORIGIN || "http://127.0.0.1:3201") +
          "/lab.html"
        }
        className="lab-engine"
        aria-hidden="true"
        tabIndex={-1}
      />
      <p role="status" className="learning-notice">
        {message}
        {dirty
          ? practice
            ? " · Modifications non exportées."
            : " · Modifications non sauvegardées."
          : ""}
      </p>
      {book && (
        <>
          <div className="learning-actions">
            <button
              className="button button-primary"
              onClick={run}
              disabled={!ready || running || saving}
            >
              {running ? "Exécution…" : "Tout exécuter"}
            </button>
            <button
              className="button button-secondary"
              onClick={stop}
              disabled={!running}
            >
              Arrêter le calcul
            </button>
            {!practice && (
              <button
                className="button button-secondary"
                onClick={save}
                disabled={saving || running}
              >
                Sauvegarder sur le serveur
              </button>
            )}
            <button
              className="button button-secondary"
              onClick={() => {
                download(
                  practice ? "mon-atelier.ipynb" : "mon-travail.ipynb",
                  book,
                );
                if (practice) setDirty(false);
              }}
            >
              Exporter .ipynb
            </button>
            {!practice && !!csv && (
              <button
                className="button button-secondary"
                onClick={() =>
                  download("ventes.csv", csv, "text/csv;charset=utf-8")
                }
              >
                Télécharger les données
              </button>
            )}
          </div>
          <label className="learning-upload">
            Importer un notebook .ipynb
            <input
              type="file"
              accept=".ipynb"
              disabled={running || saving}
              onChange={(e) => void importBook(e.target.files?.[0])}
            />
          </label>
          <div className="notebook-cells">
            {book.cells.map((c: any, i: number) => (
              <section key={i} className="notebook-cell">
                {c.cell_type === "code" ? (
                  <label>
                    Cellule Python {i + 1}
                    <textarea
                      aria-label={`Code Python cellule ${i + 1}`}
                      spellCheck={false}
                      disabled={running || saving}
                      value={
                        Array.isArray(c.source) ? c.source.join("") : c.source
                      }
                      onChange={(e) => change(i, e.target.value)}
                      rows={Math.min(
                        20,
                        Math.max(
                          5,
                          (Array.isArray(c.source)
                            ? c.source.join("")
                            : String(c.source || "")
                          ).split("\n").length,
                        ),
                      )}
                    />
                  </label>
                ) : (
                  <>
                    <Markdown skipHtml components={{ img: () => null }}>
                      {Array.isArray(c.source)
                        ? c.source.join("")
                        : String(c.source || "")}
                    </Markdown>
                    <details>
                      <summary>Modifier ce texte</summary>
                      <textarea
                        aria-label={`Texte cellule ${i + 1}`}
                        rows={6}
                        disabled={running || saving}
                        value={
                          Array.isArray(c.source) ? c.source.join("") : c.source
                        }
                        onChange={(e) => change(i, e.target.value)}
                      />
                    </details>
                  </>
                )}
              </section>
            ))}
          </div>
          {result && (
            <section
              className="notebook-result"
              aria-label="Résultats du calcul"
            >
              <h3>Résultat de l’exécution</h3>
              <pre>{result}</pre>
              {plots.map((p, i) => (
                <img
                  key={i}
                  src={`data:image/png;base64,${p}`}
                  alt={`Graphique ${i + 1} produit par votre code ; utilisez les tableaux textuels pour les valeurs.`}
                />
              ))}
              {versions && (
                <p>
                  Environnement utilisé : Python {versions.python}, pandas{" "}
                  {versions.pandas}, matplotlib {versions.matplotlib}.
                </p>
              )}
            </section>
          )}
          {!practice && (
            <section className="learning-submit">
              <h3>Remettre votre TP</h3>
              <label>
                Commentaire au formateur
                <textarea
                  id="submission-comment"
                  maxLength={3000}
                  rows={3}
                  placeholder="Votre démarche, une difficulté, votre interprétation…"
                />
              </label>
              <button
                className="button button-primary"
                onClick={submit}
                disabled={saving || running}
              >
                Remettre mon travail
              </button>
              <p>
                Chaque remise conserve une copie datée. Le formateur la consulte
                sans exécution automatique.
              </p>
            </section>
          )}
        </>
      )}
    </section>
  );
}
