// AEGIS JavaScript SDK — full coverage smoke test.
//
// Setup:
//   cd tests/sdk-smoke/javascript
//   AEGIS_SDK_JS_PATH=/path/to/cloned/aegis-sdk/javascript npm run install-sdk
//   AEGIS_API_KEY_PROD=... node full_coverage.mjs

import { AegisClient } from "@aegis-ai/sdk";

const API_KEY = process.env.AEGIS_API_KEY_PROD || process.env.AEGIS_API_KEY;
const BASE_URL = process.env.AEGIS_BASE_URL || "https://api.aiaegis.io";
const TENANT = process.env.AEGIS_TEST_TENANT_ID || "00000000-0000-0000-0000-000000000001";
const SAMPLE = "테스트입니다 — 비밀번호는 1234입니다.";

if (!API_KEY) {
  console.error("set AEGIS_API_KEY_PROD or AEGIS_API_KEY");
  process.exit(2);
}

const c = new AegisClient({ apiKey: API_KEY, baseUrl: BASE_URL });
const results = [];

async function call(group, name, fn) {
  const t0 = Date.now();
  try {
    const out = await fn();
    results.push({ group, name, status: "OK", detail: `${Date.now() - t0}ms` });
    return out;
  } catch (e) {
    const msg = (e?.message || String(e)).split("\n")[0].slice(0, 140);
    results.push({ group, name, status: "FAIL", detail: `${Date.now() - t0}ms ${msg}` });
    return null;
  }
}
function skip(group, name, reason) {
  results.push({ group, name, status: "SKIP", detail: reason });
}
const attr = (o, ...names) => {
  if (!o) return null;
  for (const n of names) if (o[n] != null) return o[n];
  return null;
};

// ---- judge ----
const j = await call("judge", "create", () => c.judge.create({ prompt: SAMPLE }));
const jid = attr(j, "id", "judgment_id") || "00000000-0000-0000-0000-000000000000";
await call("judge", "batch", () => c.judge.batch([{ prompt: "hello" }, { prompt: "world" }]));
await call("judge", "get", () => c.judge.get(jid));
await call("judge", "list", () => c.judge.list({ limit: 5 }));

// ---- rules ----
await call("rules", "list", () => c.rules.list({ limit: 5 }));
await call("rules", "templates", () => c.rules.templates());
await call("rules", "templates_by_industry", () => c.rules.templatesByIndustry?.("finance") ?? c.rules.templates());
await call("rules", "reload", () => c.rules.reload());
await call("rules", "test", () => c.rules.test("hello"));
const newRule = await call("rules", "create", () =>
  c.rules.create({ name: `smoke-${Date.now()}`, pattern: "(?i)test", action: "block", severity: "low" }),
);
const ruleId = attr(newRule, "id", "rule_id");
if (ruleId) {
  await call("rules", "get", () => c.rules.get(ruleId));
  await call("rules", "update", () => c.rules.update(ruleId, { severity: "medium" }));
  await call("rules", "delete", () => c.rules.delete(ruleId));
} else {
  skip("rules", "get", "no rule created");
  skip("rules", "update", "no rule created");
  skip("rules", "delete", "no rule created");
}

// ---- escalations ----
await call("escalations", "list", () => c.escalations.list({ limit: 5 }));
await call("escalations", "stats", () => c.escalations.stats());

// ---- evidence ----
await call("evidence", "list", () => c.evidence.list({ limit: 5 }));

// ---- analytics ----
await call("analytics", "overview", () => c.analytics.overview());
await call("analytics", "judgments", () => c.analytics.judgments());
await call("analytics", "defenseLayers", () => c.analytics.defenseLayers?.() ?? c.analytics.defense_layers?.());
await call("analytics", "threats", () => c.analytics.threats());
await call("analytics", "performance", () => c.analytics.performance());

// ---- ml ----
await call("ml", "health", () => c.ml.health());
await call("ml", "embed", () => c.ml.embed("hello"));
await call("ml", "embedBatch", () => c.ml.embedBatch?.(["a", "b"]) ?? c.ml.embed_batch?.(["a", "b"]));
await call("ml", "classify", () => c.ml.classify("test"));
await call("ml", "similarity", () => c.ml.similarity("query", ["doc1", "doc2"]));

// ---- nlp ----
await call("nlp", "detectLanguage", () => c.nlp.detectLanguage?.(SAMPLE) ?? c.nlp.detect_language?.(SAMPLE));
await call("nlp", "detectJailbreak", () => c.nlp.detectJailbreak?.(SAMPLE) ?? c.nlp.detect_jailbreak?.(SAMPLE));
await call("nlp", "detectHarmful", () => c.nlp.detectHarmful?.(SAMPLE) ?? c.nlp.detect_harmful?.(SAMPLE));

// ---- aiAct ----
await call("aiAct", "watermark", () => c.aiAct.watermark(SAMPLE));
await call("aiAct", "highImpactWatermark", () => c.aiAct.highImpactWatermark?.(SAMPLE) ?? c.aiAct.high_impact_watermark?.(SAMPLE));
await call("aiAct", "verify", () => c.aiAct.verify(SAMPLE));
await call("aiAct", "guidelines", () => c.aiAct.guidelines());
await call("aiAct", "guardrailCheck", () => c.aiAct.guardrailCheck?.(SAMPLE) ?? c.aiAct.guardrail_check?.(SAMPLE));
await call("aiAct", "piiDetect", () => c.aiAct.piiDetect?.(SAMPLE) ?? c.aiAct.pii_detect?.(SAMPLE));
await call("aiAct", "riskAssess", () => c.aiAct.riskAssess?.("test system") ?? c.aiAct.risk_assess?.("test system"));
await call("aiAct", "auditLogs", () => c.aiAct.auditLogs?.() ?? c.aiAct.audit_logs?.());

// ---- classify ----
await call("classify", "classify", () => c.classify.classify(SAMPLE));
await call("classify", "categories", () => c.classify.categories());
await call("classify", "batch", () => c.classify.batch([{ content: "a" }, { content: "b" }]));

// ---- jailbreak ----
await call("jailbreak", "detect", () => c.jailbreak.detect(SAMPLE));
await call("jailbreak", "types", () => c.jailbreak.types());
await call("jailbreak", "detectBatch", () => c.jailbreak.detectBatch?.([{ content: "a" }]) ?? c.jailbreak.detect_batch?.([{ content: "a" }]));

// ---- safety ----
await call("safety", "check", () => c.safety.check(SAMPLE));
await call("safety", "categories", () => c.safety.categories());
await call("safety", "backends", () => c.safety.backends());
await call("safety", "checkBatch", () => c.safety.checkBatch?.([{ content: "a" }]) ?? c.safety.check_batch?.([{ content: "a" }]));

// ---- defense ----
await call("defense", "paladinStats", () => c.defense.paladinStats?.() ?? c.defense.paladin_stats?.());
await call("defense", "trustValidate", () => c.defense.trustValidate?.(SAMPLE) ?? c.defense.trust_validate?.(SAMPLE));
await call("defense", "trustProfile", () => c.defense.trustProfile?.() ?? c.defense.trust_profile?.());
await call("defense", "ragDetect", () => c.defense.ragDetect?.("query", ["doc1"]) ?? c.defense.rag_detect?.("query", ["doc1"]));
await call("defense", "circuitBreakerEvaluate", () => c.defense.circuitBreakerEvaluate?.(SAMPLE) ?? c.defense.circuit_breaker_evaluate?.(SAMPLE));
await call("defense", "circuitBreakerStatus", () => c.defense.circuitBreakerStatus?.() ?? c.defense.circuit_breaker_status?.());
await call("defense", "adaptiveEvaluate", () => c.defense.adaptiveEvaluate?.(SAMPLE) ?? c.defense.adaptive_evaluate?.(SAMPLE));

// ---- advanced ----
await call("advanced", "detect", () => c.advanced.detect(SAMPLE));
await call("advanced", "hybridWeb", () => c.advanced.hybridWeb?.(SAMPLE) ?? c.advanced.hybrid_web?.(SAMPLE));
await call("advanced", "vsh", () => c.advanced.vsh(SAMPLE));
await call("advanced", "fewShot", () => c.advanced.fewShot?.(SAMPLE) ?? c.advanced.few_shot?.(SAMPLE));
await call("advanced", "cot", () => c.advanced.cot(SAMPLE));
await call("advanced", "acoustic", () => c.advanced.acoustic(SAMPLE));
await call("advanced", "contextConfusion", () => c.advanced.contextConfusion?.(SAMPLE) ?? c.advanced.context_confusion?.(SAMPLE));
await call("advanced", "infoExtraction", () => c.advanced.infoExtraction?.(SAMPLE) ?? c.advanced.info_extraction?.(SAMPLE));

// ---- adversaflow ----
await call("adversaflow", "campaigns", async () => {
  const it = c.adversaflow.campaigns({ limit: 5 });
  const arr = [];
  for await (const x of it) { arr.push(x); if (arr.length >= 5) break; }
  return arr;
});
await call("adversaflow", "tree", () => c.adversaflow.tree());

// ---- guardnet ----
await call("guardnet", "analyze", () => c.guardnet.analyze(SAMPLE));
await call("guardnet", "jbshield", () => c.guardnet.jbshield(SAMPLE));
await call("guardnet", "ccfc", () => c.guardnet.ccfc(SAMPLE));
await call("guardnet", "muli", () => c.guardnet.muli(SAMPLE));
await call("guardnet", "unified", () => c.guardnet.unified(SAMPLE));

// ---- agent ----
await call("agent", "scan", () => c.agent.scan(SAMPLE));

// ---- anomaly ----
await call("anomaly", "algorithms", () => c.anomaly.algorithms());
await call("anomaly", "detect", () => c.anomaly.detect({ metric: "cpu", value: 42, history: [10, 11, 9.5, 10.2, 10.8] }));
await call("anomaly", "events", async () => {
  const it = c.anomaly.events({ limit: 5 });
  const arr = [];
  for await (const x of it) { arr.push(x); if (arr.length >= 5) break; }
  return arr;
});
await call("anomaly", "stats", () => c.anomaly.stats());

// ---- multimodal ----
await call("multimodal", "scan", () => c.multimodal.scan(SAMPLE));

// ---- evolution ----
await call("evolution", "stats", () => c.evolution.stats());
await call("evolution", "generate", () => c.evolution.generate(SAMPLE));

// ---- saber ----
await call("saber", "estimate", () => c.saber.estimate(SAMPLE));
await call("saber", "evaluate", () => c.saber.evaluate(SAMPLE));
await call("saber", "budget", () => c.saber.budget());
await call("saber", "compare", () => c.saber.compare(SAMPLE, ["paladin"]));

// ---- ops ----
await call("ops", "getThresholds", () => c.ops.getThresholds?.() ?? c.ops.get_thresholds?.());
await call("ops", "redteamStats", () => c.ops.redteamStats?.() ?? c.ops.redteam_stats?.());
await call("ops", "attackLibrary", () => c.ops.attackLibrary?.() ?? c.ops.attack_library?.());

// ---- apiKeys ----
await call("apiKeys", "list", async () => {
  const it = c.apiKeys.list({ limit: 5 });
  const arr = [];
  for await (const x of it) { arr.push(x); if (arr.length >= 5) break; }
  return arr;
});

// ---- orchestration ----
const o = c.orchestration;
await call("orchestration", "runs", () => o.run({ content: SAMPLE }));
await call("orchestration", "runs/basic", () => o.basic({ content: SAMPLE }));
await call("orchestration", "runs/standard", () => o.standard({ content: SAMPLE }));
await call("orchestration", "runs/full", () => o.full({ content: SAMPLE }));
await call("orchestration", "runs/advanced", () => o.advanced({ content: SAMPLE }));
await call("orchestration", "runs/agent", () => o.agent({ content: SAMPLE }));
await call("orchestration", "runs/anomaly", () => o.anomaly({ content: SAMPLE }));
await call("orchestration", "runs/pii", () => o.pii({ content: SAMPLE }));
await call("orchestration", "runs/anomaly/timeseries", () =>
  o.anomalyTimeseries({ value: 42, history: [10, 11, 9.5, 10.2, 10.8], algorithm: "zscore" }));
await call("orchestration", "configs GET", () => o.getConfig(TENANT, "standard"));
await call("orchestration", "configs PUT", () =>
  o.upsertConfig(TENANT, "standard", {
    algorithm: "weighted_mean", mode: "auto",
    weights: { "v1.judge": 0.5, "v2.classify": 0.5 },
    thresholds: { block: 0.7 },
  }));
await call("orchestration", "gridsearch", () =>
  o.gridsearch({ domain: "default", scenario: "standard", max_samples: 5 }));
const job = await call("orchestration", "gridsearch/jobs", () =>
  o.createGridsearchJob({ domain: "default", scenario: "standard", max_samples: 5 }));
const jobId = attr(job, "job_id", "id") || "00000000-0000-0000-0000-000000000000";
await call("orchestration", "gridsearch/jobs/{id}", () => o.getGridsearchJob(jobId));
await call("orchestration", "gridsearch/jobs/{id}/results", () => o.listGridsearchResults(jobId));
await call("orchestration", "gridsearch/jobs/{id}/promote", () =>
  o.promoteGridsearchJob(jobId, { tenant_id: TENANT, scenario: "standard" }));
await call("orchestration", "datasets", () => o.listDatasets());
await call("orchestration", "v3 pipeline/run", () =>
  o.pipelineRun({ prompt: SAMPLE, evolution_generations: 1, saber_trials: 5 }));
await call("orchestration", "v3 military/orchestrate", () =>
  o.militaryOrchestrate({ text: SAMPLE }));
await call("orchestration", "v3 military/status", () => o.militaryStatus());

// ---- print ----
console.log("\n========================================================================");
console.log(`  AEGIS JavaScript SDK — Full Coverage Smoke (${BASE_URL})`);
console.log("========================================================================");

const ok = results.filter((r) => r.status === "OK").length;
const fail = results.filter((r) => r.status === "FAIL").length;
const sk = results.filter((r) => r.status === "SKIP").length;

let curGroup = null;
for (const r of results) {
  if (r.group !== curGroup) {
    console.log(`\n[${r.group}]`);
    curGroup = r.group;
  }
  const mark = r.status === "OK" ? "✅" : r.status === "FAIL" ? "❌" : "⊘";
  console.log(`  ${mark} ${r.name.padEnd(40)} ${r.detail}`);
}

console.log(`\n  Total: ${results.length}  |  OK: ${ok}  |  FAIL: ${fail}  |  SKIP: ${sk}`);
process.exit(fail === 0 ? 0 : 1);
