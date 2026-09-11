import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { labFrame } from "../apps/web/lib/lab-frame.mjs";
const port = Number(process.env.LAB_PORT || 3201);
const origin = process.env.LAB_ORIGIN || `http://127.0.0.1:${port}`;
const appOrigin = process.env.APP_ORIGIN || "http://127.0.0.1:3200";
if (new URL(origin).origin === new URL(appOrigin).origin)
  throw Error("Le laboratoire doit avoir une origine distincte du site.");
const directory = new URL("../apps/web/public/lab-assets/", import.meta.url);
if (!existsSync(new URL("manifest.json", directory)))
  throw Error("Exécutez python scripts/setup-lab.py avant le laboratoire.");
createServer((req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end();
    return;
  }
  const url = new URL(req.url, origin);
  if (url.pathname === "/lab.html") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors ${new URL(appOrigin).origin}`,
    );
    res.end(labFrame(origin));
    return;
  }
  const name = url.pathname.slice("/lab-assets/".length);
  if (
    !url.pathname.startsWith("/lab-assets/") ||
    !/^[A-Za-z0-9_.+-]+$/.test(name)
  ) {
    res.writeHead(404);
    res.end();
    return;
  }
  const file = new URL(name, directory);
  if (!existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  const type =
    name.endsWith(".mjs") || name.endsWith(".js")
      ? "application/javascript"
      : name.endsWith(".wasm")
        ? "application/wasm"
        : name.endsWith(".json")
          ? "application/json"
          : "application/octet-stream";
  res.setHeader("Content-Type", type);
  res.setHeader("Cache-Control", "public, max-age=86400");
  createReadStream(fileURLToPath(file))
    .on("error", () => res.destroy())
    .pipe(res);
}).listen(port, process.env.LAB_BIND_HOST || "127.0.0.1", () =>
  console.log(`Laboratoire statique : ${origin}/lab.html`),
);
