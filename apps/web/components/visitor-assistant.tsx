"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  MessageCircle,
  Send,
  RotateCcw,
  X,
  LoaderCircle,
  FileDown,
} from "lucide-react";

type Reply = {
  answer: string;
  links: Array<{ label: string; href: string }>;
  courses: Array<{
    slug: string;
    title: string;
    facts: string;
    summary: string;
    points: string[];
    href: string;
    pdf: string;
  }>;
  selectedSlugs: string[];
  mode: "ai" | "catalogue" | "guidance";
};
type Message = {
  id: number;
  role: "visitor" | "assistant";
  text: string;
  reply?: Reply;
};
const safeLink = (href: string) =>
  href.startsWith("/") && !href.startsWith("//") && !href.includes("\\")
    ? href
    : "/contact";
export function VisitorAssistant() {
  const pathname = usePathname();
  const slug = pathname.match(/^\/formations\/([a-z0-9-]+)(?:\/|$)/)?.[1];
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]),
    [selected, setSelected] = useState<string[]>([]);
  const launcher = useRef<HTMLButtonElement>(null),
    input = useRef<HTMLTextAreaElement>(null),
    scroller = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const request = useRef<AbortController | null>(null),
    sequence = useRef(0);
  useEffect(() => {
    setSelected([]);
  }, [slug]);
  useEffect(() => {
    if (open) {
      opened.current = true;
      input.current?.focus();
    } else if (opened.current) launcher.current?.focus();
  }, [open]);
  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "instant",
    });
  }, [messages, busy, error]);
  useEffect(() => () => request.current?.abort(), []);
  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };
  const reset = () => {
    request.current?.abort();
    sequence.current++;
    setBusy(false);
    setMessages([]);
    setSelected([]);
    setError("");
    setDraft("");
    input.current?.focus();
  };
  async function send(value = draft) {
    const text = value.trim();
    if (!text || busy || text.length > 1000) return;
    setError("");
    setDraft("");
    setBusy(true);
    const id = ++sequence.current;
    setMessages((old) => [
      ...old.slice(-29),
      { id, role: "visitor", text },
    ]);
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 35000);
    try {
      const res = await fetch("/api/v1/assistant/ask", {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          ...(slug ? { contextSlug: slug } : {}),
          ...(selected.length ? { selectedSlugs: selected } : {}),
        }),
      });
      if (!res.ok)
        throw new Error(
          res.status === 429
            ? "Vous avez envoyé plusieurs questions. Patientez une minute avant de réessayer."
            : res.status === 503
              ? "L’assistant est occupé. Réessayez dans quelques instants ou contactez le centre."
              : "La réponse n’a pas pu être obtenue. Réessayez ou contactez le centre.",
        );
      const reply = (await res.json()) as Reply;
      if (id !== sequence.current) return;
      const responseId = ++sequence.current;
      setMessages((old) => [
        ...old,
        {
          id: responseId,
          role: "assistant",
          text: reply.answer,
          reply,
        },
      ]);
      if (reply.selectedSlugs.length) setSelected(reply.selectedSlugs);
    } catch (e) {
      if (id === sequence.current) {
        setError(
          e instanceof Error && e.name !== "AbortError"
            ? e.message
            : "La réponse prend trop de temps. Réessayez ou contactez le centre.",
        );
        setDraft(text);
      }
    } finally {
      clearTimeout(timer);
      if (request.current === controller) {
        setBusy(false);
        request.current = null;
      }
    }
  }
  const suggestions = slug
    ? [
        "Que contient le programme ?",
        "Quels sont les prérequis ?",
        "Quel est le tarif ?",
      ]
    : [
        "Je veux apprendre Power BI",
        "Comment financer ma formation ?",
        "Comment contacter le centre ?",
      ];
  return (
    <div className="visitor-assistant">
      {!open && (
        <button
          ref={launcher}
          type="button"
          className="assistant-launcher"
          aria-label="Ouvrir l’assistant IA Beyond Expertise"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <MessageCircle size={23} aria-hidden="true" />
          <span>
            Une question ?<small>Assistant IA</small>
          </span>
        </button>
      )}
      {open && (
        <section
          className="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
          aria-describedby="assistant-scope"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              close();
            }
          }}
        >
          <header className="assistant-header">
            <div className="assistant-heading-icon">
              <MessageCircle size={23} aria-hidden="true" />
            </div>
            <div>
              <h2 id="assistant-title">Assistant IA</h2>
              <p>Beyond Expertise</p>
            </div>
            <button
              type="button"
              className="assistant-icon-button"
              aria-label="Nouvelle conversation"
              title="Nouvelle conversation"
              onClick={reset}
            >
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              className="assistant-icon-button"
              aria-label="Fermer l’assistant"
              onClick={close}
            >
              <X size={22} />
            </button>
          </header>
          <p className="assistant-scope" id="assistant-scope">
            Formations, programmes et informations du centre.
            <br />
            N’envoyez pas de données personnelles ou sensibles.
          </p>
          <div
            className="assistant-messages"
            ref={scroller}
            role="log"
            aria-label="Conversation avec l’assistant"
            aria-live="polite"
            aria-relevant="additions"
          >
            {!messages.length && (
              <div className="assistant-welcome">
                <p className="assistant-kicker">Votre prochain pas</p>
                <h3>Parlons de votre formation.</h3>
                <p>
                  {slug
                    ? "Je peux vous expliquer cette formation et vous aider à préparer votre échange avec le centre."
                    : "Décrivez votre projet ou posez une question sur le catalogue."}
                </p>
                <div className="assistant-suggestions">
                  {suggestions.map((s) => (
                    <button type="button" key={s} onClick={() => void send(s)}>
                      {s}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div className={"assistant-message " + m.role} key={m.id}>
                <span className="assistant-message-author">
                  {m.role === "visitor" ? "Vous" : "Assistant IA"}
                </span>
                <p>{m.text}</p>
                {m.reply?.courses.map((c) => (
                  <article className="assistant-course" key={c.slug}>
                    <h3>{c.title}</h3>
                    <p className="assistant-course-facts">{c.facts}</p>
                    <p>{c.summary}</p>
                    {!!c.points.length && (
                      <ul>
                        {c.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    )}
                    <div className="assistant-course-actions">
                      <a href={safeLink(c.href)}>
                        Voir la formation <ArrowUpRight size={15} />
                      </a>
                      <a href={safeLink(c.pdf)} download>
                        <FileDown size={15} />
                        Programme PDF
                      </a>
                    </div>
                  </article>
                ))}
                {!!m.reply?.links.length && (
                  <div className="assistant-links">
                    {m.reply.links.map((l) => (
                      <a key={l.href} href={safeLink(l.href)}>
                        {l.label}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
                {m.reply?.mode === "catalogue" && (
                  <small className="assistant-fallback">
                    Réponse issue du catalogue ; l’analyse IA est momentanément
                    indisponible.
                  </small>
                )}
              </div>
            ))}
            {busy && (
              <p className="assistant-pending">
                <LoaderCircle size={18} aria-hidden="true" />
                Je consulte le catalogue… Cela peut prendre quelques secondes.
              </p>
            )}
          </div>
          {error && (
            <p className="assistant-error" role="alert">
              {error} <a href="/contact">Contacter le centre</a>
            </p>
          )}
          <form
            className="assistant-form"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <label className="sr-only" htmlFor="assistant-question">
              Votre question sur les formations
            </label>
            <textarea
              ref={input}
              id="assistant-question"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={1000}
              rows={2}
              placeholder="Votre question sur les formations…"
              disabled={busy}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <button
              type="submit"
              aria-label="Envoyer la question"
              disabled={busy || !draft.trim()}
            >
              <Send size={19} />
            </button>
          </form>
          <footer className="assistant-footer">
            <span>Tarifs et disponibilités à confirmer.</span>
            <a href="/transparence-ia">Fonctionnement de l’IA</a>
          </footer>
        </section>
      )}
    </div>
  );
}
