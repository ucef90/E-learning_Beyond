// All public downloads are PDF. Markdown remains an internal authoring format only.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const bundled = path.join(
  process.env.USERPROFILE || "",
  ".cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
);
const python =
  process.env.BEYOND_PDF_PYTHON ||
  (fs.existsSync(bundled) ? bundled : "python");
const result = spawnSync(
  python,
  [path.join(__dirname, "export-public-pdfs.py")],
  { stdio: "inherit", cwd: path.resolve(__dirname, "..") },
);
if (result.error) {
  console.error("Python et ReportLab sont nécessaires à l’export PDF.");
  process.exit(1);
}
process.exit(result.status ?? 1);
