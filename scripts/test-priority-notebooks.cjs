const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const { chromium } = require("@playwright/test");
async function main() {
  const report = {
    at: new Date().toISOString(),
    environment: "Pyodide du laboratoire local, état Python neuf par exécution",
    notebooks: [],
  };
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    for (const key of [
      "data-analyst",
      "python-analyse-ml",
      "ia-automatisation",
    ]) {
      for (const file of fs
        .readdirSync("content/parcours/" + key)
        .filter((x) => x.endsWith(".ipynb"))) {
        const notebook = JSON.parse(
          fs.readFileSync("content/parcours/" + key + "/" + file, "utf8"),
        );
        const code = notebook.cells
          .filter((c) => c.cell_type === "code")
          .map((c) => (Array.isArray(c.source) ? c.source.join("") : c.source))
          .join("\n\n");
        const csvPath = "content/parcours/" + key + "/ventes.csv";
        const csv = fs.existsSync(csvPath)
          ? fs.readFileSync(csvPath, "utf8")
          : "";
        const page = await browser.newPage();
        await page.goto("http://127.0.0.1:3300");
        const output = await page.evaluate(
          ({ code, csv }) =>
            new Promise((resolve, reject) => {
              const frame = document.createElement("iframe");
              frame.sandbox = "allow-scripts allow-same-origin";
              frame.src = "http://127.0.0.1:3301/lab.html";
              const timer = setTimeout(
                () => reject(Error("Laboratoire : délai dépassé")),
                90000,
              );
              const receive = (e) => {
                if (e.source !== frame.contentWindow) return;
                if (e.data.type === "ready")
                  frame.contentWindow.postMessage(
                    { type: "run", code, csv },
                    "*",
                  );
                if (["result", "error"].includes(e.data.type)) {
                  clearTimeout(timer);
                  window.removeEventListener("message", receive);
                  resolve(e.data);
                }
              };
              window.addEventListener("message", receive);
              document.body.appendChild(frame);
            }),
          { code, csv },
        );
        report.notebooks.push({
          key,
          file,
          status: output.type === "result" ? "PASS" : "FAIL",
          output: output.text,
          versions: output.versions,
          plots: output.plots?.length || 0,
        });
        console.log(key + "/" + file, output.type, output.text);
        await page.close();
      }
    }
    report.status = report.notebooks.every((n) => n.status === "PASS")
      ? "PASS"
      : "FAIL";
    fs.writeFileSync(
      "work/validation/priority-notebooks.json",
      JSON.stringify(report, null, 2),
    );
    assert.equal(report.status, "PASS");
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
