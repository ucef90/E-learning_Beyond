const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  { performance } = require("node:perf_hooks");
const base = "http://127.0.0.1:4300/api/v1",
  origin = "http://127.0.0.1:3300";
async function main() {
  const catalogue = await (await fetch(base + "/trainings")).json();
  const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8")),
    a = accounts.find((a) => a.email === "stagiaire@pilot.invalid");
  const login = await fetch(base + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email: a.email, password: a.password }),
  });
  assert.equal(login.status, 201);
  const cookie = login.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  const report = {
    at: new Date().toISOString(),
    scope:
      "Micro-test local de concurrence HTTP en lecture, aucune vidéo ni exécution Python serveur. Ce PC ne représente pas le VPS OVH.",
    scenarios: [],
  };
  for (const concurrent of [20, 50, 100]) {
    const start = performance.now(),
      times = [],
      errors = [];
    await Promise.all(
      Array.from({ length: concurrent }, async (_, i) => {
        for (let j = 0; j < 3; j++) {
          const route =
            (i + j) % 3 === 0
              ? "/courses/dashboard"
              : (i + j) % 3 === 1
                ? "/trainings"
                : "/trainings/" + catalogue[(i + j) % catalogue.length].slug;
          const t = performance.now();
          try {
            const res = await fetch(base + route, {
              headers: { Cookie: cookie },
              signal: AbortSignal.timeout(15000),
            });
            await res.arrayBuffer();
            if (!res.ok) errors.push({ route, status: res.status });
          } catch (e) {
            errors.push({ route, error: e.name });
          }
          times.push(performance.now() - t);
        }
      }),
    );
    times.sort((a, b) => a - b);
    const durationMs = performance.now() - start;
    const result = {
      concurrent,
      requests: times.length,
      errors: errors.length,
      p50Ms: Math.round(times[Math.floor(times.length * 0.5)]),
      p95Ms: Math.round(times[Math.floor(times.length * 0.95)]),
      maxMs: Math.round(times.at(-1)),
      durationMs: Math.round(durationMs),
      requestsPerSecond: Math.round((times.length * 1000) / durationMs),
    };
    report.scenarios.push(result);
    console.log(JSON.stringify(result));
    assert.equal(errors.length, 0, JSON.stringify(errors.slice(0, 3)));
  }
  report.status = "PASS";
  fs.writeFileSync(
    "work/validation/local-concurrency.json",
    JSON.stringify(report, null, 2),
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
