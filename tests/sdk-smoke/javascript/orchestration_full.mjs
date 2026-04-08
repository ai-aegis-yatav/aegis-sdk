// AEGIS JavaScript SDK orchestration smoke test.
//
// Setup:
//   cd tests/sdk-smoke/javascript
//   npm install   # installs @aegis-ai/sdk from the GitHub clone (see package.json)
//   AEGIS_API_KEY_PROD=... node orchestration_full.mjs
//
// Or against local dev:
//   AEGIS_BASE_URL=http://localhost:8000 AEGIS_API_KEY_PROD=... node orchestration_full.mjs

import { AegisClient } from "@aegis-ai/sdk";

const API_KEY = process.env.AEGIS_API_KEY_PROD || process.env.AEGIS_API_KEY;
const BASE_URL = process.env.AEGIS_BASE_URL || "https://api.aiaegis.io";
const TENANT_ID = process.env.AEGIS_TEST_TENANT_ID || "00000000-0000-0000-0000-000000000001";
const SAMPLE = "테스트입니다 — 비밀번호는 1234입니다.";

if (!API_KEY) {
  console.error("set AEGIS_API_KEY_PROD or AEGIS_API_KEY");
  process.exit(2);
}

const client = new AegisClient({ apiKey: API_KEY, baseUrl: BASE_URL });
const o = client.orchestration;
const results = [];

async function call(name, fn) {
  const t0 = Date.now();
  try {
    const out = await fn();
    results.push({ name, status: "OK", detail: `${Date.now() - t0}ms` });
    return out;
  } catch (e) {
    const msg = (e?.message || String(e)).split("\n")[0].slice(0, 120);
    results.push({ name, status: "FAIL", detail: `${Date.now() - t0}ms ${msg}` });
    return null;
  }
}

await call("POST /v1/orchestration/runs", () => o.run({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/basic", () => o.basic({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/standard", () => o.standard({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/full", () => o.full({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/advanced", () => o.advanced({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/agent", () => o.agent({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/anomaly", () => o.anomaly({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/pii", () => o.pii({ content: SAMPLE }));
await call("POST /v1/orchestration/runs/anomaly/timeseries", () =>
  o.anomalyTimeseries({ value: 42, history: [10, 11, 9.5, 10.2, 10.8], algorithm: "zscore" }),
);
await call("GET  /v1/orchestration/configs/{tid}/standard", () => o.getConfig(TENANT_ID, "standard"));
await call("PUT  /v1/orchestration/configs/{tid}/standard", () =>
  o.upsertConfig(TENANT_ID, "standard", {
    algorithm: "weighted_mean",
    mode: "auto",
    weights: { "v1.judge": 0.5, "v2.classify": 0.5 },
    thresholds: { block: 0.7 },
  }),
);
await call("POST /v1/orchestration/gridsearch", () =>
  o.gridsearch({ domain: "default", scenario: "standard", max_samples: 5 }),
);
const job = await call("POST /v1/orchestration/gridsearch/jobs", () =>
  o.createGridsearchJob({ domain: "default", scenario: "standard", max_samples: 5 }),
);
const jobId = job?.job_id || "00000000-0000-0000-0000-000000000000";
await call("GET  /v1/orchestration/gridsearch/jobs/{id}", () => o.getGridsearchJob(jobId));
await call("GET  /v1/orchestration/gridsearch/jobs/{id}/results", () => o.listGridsearchResults(jobId));
await call("POST /v1/orchestration/gridsearch/jobs/{id}/promote", () =>
  o.promoteGridsearchJob(jobId, { tenant_id: TENANT_ID, scenario: "standard" }),
);
await call("GET  /v1/orchestration/datasets", () => o.listDatasets());
await call("POST /v3/pipeline/run", () =>
  o.pipelineRun({ prompt: SAMPLE, evolution_generations: 1, saber_trials: 5 }),
);
await call("POST /v3/military/orchestrate", () => o.militaryOrchestrate({ text: SAMPLE }));
await call("GET  /v3/military/status", () => o.militaryStatus());

const ok = results.filter((r) => r.status === "OK").length;
console.log(`\n=== JavaScript SDK Orchestration Smoke (${BASE_URL}) ===`);
console.log(`  ${ok}/${results.length} OK`);
for (const r of results) {
  const mark = r.status === "OK" ? "✅" : "❌";
  console.log(`  ${mark} ${r.name.padEnd(60)} ${r.detail}`);
}
process.exit(ok === results.length ? 0 : 1);
