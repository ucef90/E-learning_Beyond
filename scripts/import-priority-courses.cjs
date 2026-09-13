const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const base = "http://127.0.0.1:4300/api/v1",
  origin = "http://127.0.0.1:3300";
const statePath = ".private/priority-import.json";
const state = fs.existsSync(statePath)
  ? JSON.parse(fs.readFileSync(statePath, "utf8"))
  : {};
const persist = () =>
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
async function main() {
  const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8")),
    admin = accounts.find((a) => a.role === "ADMIN");
  const auth = await fetch(base + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email: admin.email, password: admin.password }),
  });
  assert.equal(auth.status, 201, "Connexion administrateur locale requise");
  const cookie = auth.headers
    .getSetCookie()
    .map((v) => v.split(";")[0])
    .join("; ");
  async function api(url, method = "GET", data) {
    const r = await fetch(base + url, {
      method,
      headers: {
        Cookie: cookie,
        Origin: origin,
        "Content-Type": "application/json",
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    const b = await r.json();
    assert(r.ok, url + " " + r.status + " " + JSON.stringify(b));
    return b;
  }
  const catalogue = await api("/trainings"),
    report = [];
  for (const key of [
    "data-analyst",
    "python-analyse-ml",
    "ia-automatisation",
  ]) {
    const dir = "content/parcours/" + key,
      files = fs.readdirSync(dir).sort();
    const hash = crypto
      .createHash("sha256")
      .update(
        files
          .map((f) => f + "\n" + fs.readFileSync(path.join(dir, f), "utf8"))
          .join("\n"),
      )
      .digest("hex");
    if (state[key]?.complete && state[key].hash === hash) {
      report.push(state[key]);
      continue;
    }
    const {
      key: ignored,
      trainingSlug,
      ...content
    } = JSON.parse(fs.readFileSync(dir + "/course.json", "utf8"));
    const training = catalogue.find((t) => t.slug === trainingSlug);
    assert(training, "Rattachement absent : " + trainingSlug);
    content.trainingId = training.id;
    let id = state[key]?.id;
    if (id) {
      const c = await api("/courses/" + id + "/authoring");
      assert(
        !c.isPublished && !c._count.learning,
        "Une version attribuée ne doit jamais être remplacée",
      );
      content.revision = c.version;
      await api("/courses/" + id + "/authoring", "PUT", content);
    } else {
      const c = await api("/courses/authoring", "POST", content);
      id = c.id;
      state[key] = { id, key };
      persist();
    }
    const route = "/courses/" + id;
    for (const name of ["practice", "starter", "solution", "csv"]) {
      const file = name === "csv" ? "ventes.csv" : name + ".ipynb";
      if (!files.includes(file)) continue;
      const c = await api(route + "/authoring");
      await api(route + "/authoring/resource", "PUT", {
        revision: c.version,
        name,
        ...(name === "csv"
          ? { csv: fs.readFileSync(dir + "/" + file, "utf8") }
          : {
              notebook: JSON.parse(fs.readFileSync(dir + "/" + file, "utf8")),
            }),
      });
    }
    for (const file of files.filter(
      (f) =>
        ![
          "course.json",
          "practice.ipynb",
          "starter.ipynb",
          "solution.ipynb",
        ].includes(f),
    )) {
      let c = await api(route + "/authoring");
      for (const old of c.assets.filter((a) => a.filename === file)) {
        await api(route + "/assets/" + old.id, "DELETE", {
          revision: c.version,
        });
        c = await api(route + "/authoring");
      }
      await api(route + "/assets", "POST", {
        revision: c.version,
        title: file.replace(/\.(txt|json|csv)$/, "").replaceAll("-", " "),
        filename: file,
        base64: fs.readFileSync(dir + "/" + file).toString("base64"),
        visibility: file.startsWith("correction") ? "AFTER_REVIEW" : "LEARNER",
      });
    }
    const c = await api(route + "/authoring");
    assert.equal(c.editorialStatus, "DRAFT");
    assert.equal(c.isPublished, false);
    assert.equal(c.reviewedAt, null);
    state[key] = {
      id,
      key,
      title: c.title,
      modules: c.modules.length,
      lessons: c.modules.flatMap((m) => m.lessons).length,
      minutes: c.estimatedMinutes,
      hash,
      complete: true,
      importedAt: new Date().toISOString(),
    };
    persist();
    report.push(state[key]);
    console.log("Brouillon importé :", c.title, c.modules.length, "modules");
  }
  fs.writeFileSync(
    "work/validation/priority-content.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    "Import terminé : brouillons privés, aucune approbation ni publication.",
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
