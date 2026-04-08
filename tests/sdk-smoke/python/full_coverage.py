#!/usr/bin/env python3
"""AEGIS Python SDK — full coverage smoke test.

Calls every public method on every resource of the AegisClient against a real
AEGIS API. Each call records OK/FAIL/SKIP with latency and a short detail.

Usage:
    AEGIS_API_KEY_PROD=... python tests/sdk-smoke/python/full_coverage.py

Environment overrides:
    AEGIS_BASE_URL          (default https://api.aiaegis.io)
    AEGIS_API_KEY_PROD or AEGIS_API_KEY
"""
from __future__ import annotations

import os
import sys
import time
import uuid
import traceback
from typing import Any, Callable

from aegis import AegisClient

API_KEY = os.environ.get("AEGIS_API_KEY_PROD") or os.environ.get("AEGIS_API_KEY")
BASE_URL = os.environ.get("AEGIS_BASE_URL", "https://api.aiaegis.io")
if not API_KEY:
    print("ERROR: set AEGIS_API_KEY_PROD or AEGIS_API_KEY", file=sys.stderr)
    sys.exit(2)

c = AegisClient(api_key=API_KEY, base_url=BASE_URL)
SAMPLE = "테스트입니다 — 비밀번호는 1234입니다."
TENANT = os.environ.get("AEGIS_TEST_TENANT_ID", "00000000-0000-0000-0000-000000000001")

results: list[tuple[str, str, str, str]] = []  # group, name, status, detail


def call(group: str, name: str, fn: Callable[[], Any]) -> Any:
    t0 = time.time()
    try:
        out = fn()
        ms = int((time.time() - t0) * 1000)
        results.append((group, name, "OK", f"{ms}ms"))
        return out
    except Exception as e:
        ms = int((time.time() - t0) * 1000)
        msg = str(e).split("\n")[0][:140]
        results.append((group, name, "FAIL", f"{ms}ms {msg}"))
        return None


def skip(group: str, name: str, reason: str) -> None:
    results.append((group, name, "SKIP", reason))


# ========================================================================
# V1: judge
# ========================================================================
j = call("judge", "create", lambda: c.judge.create(prompt=SAMPLE))
call("judge", "batch", lambda: c.judge.batch([
    {"prompt": "hello"}, {"prompt": "비밀번호 1234"},
]))
def _attr(obj, *names, default=None):
    if obj is None:
        return default
    for n in names:
        if isinstance(obj, dict) and n in obj:
            return obj[n]
        if hasattr(obj, n):
            return getattr(obj, n)
    return default


jid = _attr(j, "id", "judgment_id", default="00000000-0000-0000-0000-000000000000")
call("judge", "get", lambda: c.judge.get(jid))
call("judge", "list", lambda: c.judge.list(limit=5))

# ========================================================================
# V1: rules
# ========================================================================
call("rules", "list", lambda: c.rules.list(limit=5))
call("rules", "templates", lambda: c.rules.templates())
call("rules", "templates_by_industry", lambda: c.rules.templates_by_industry("finance"))
call("rules", "reload", lambda: c.rules.reload())
call("rules", "test", lambda: c.rules.test("hello world"))
new_rule = call("rules", "create", lambda: c.rules.create(
    name=f"smoke-{uuid.uuid4().hex[:8]}",
    pattern="(?i)test_pattern",
    action="block",
    severity="low",
))
rule_id = _attr(new_rule, "id", "rule_id")
if rule_id:
    call("rules", "get", lambda: c.rules.get(rule_id))
    call("rules", "update", lambda: c.rules.update(rule_id, severity="medium"))
    call("rules", "delete", lambda: c.rules.delete(rule_id))
else:
    skip("rules", "get", "no rule created")
    skip("rules", "update", "no rule created")
    skip("rules", "delete", "no rule created")

# ========================================================================
# V1: escalations
# ========================================================================
call("escalations", "list", lambda: c.escalations.list(limit=5))
call("escalations", "stats", lambda: c.escalations.stats())

# ========================================================================
# V1: evidence
# ========================================================================
call("evidence", "list", lambda: c.evidence.list(limit=5))

# ========================================================================
# V1: analytics
# ========================================================================
call("analytics", "overview", lambda: c.analytics.overview())
call("analytics", "judgments", lambda: c.analytics.judgments())
call("analytics", "defense_layers", lambda: c.analytics.defense_layers())
call("analytics", "threats", lambda: c.analytics.threats())
call("analytics", "performance", lambda: c.analytics.performance())

# ========================================================================
# V1: ml
# ========================================================================
call("ml", "health", lambda: c.ml.health())
call("ml", "embed", lambda: c.ml.embed("hello world"))
call("ml", "embed_batch", lambda: c.ml.embed_batch(["hello", "world"]))
call("ml", "classify", lambda: c.ml.classify("this is a test"))
call("ml", "similarity", lambda: c.ml.similarity("query", ["doc1", "doc2"]))

# ========================================================================
# V1: nlp
# ========================================================================
call("nlp", "detect_language", lambda: c.nlp.detect_language(SAMPLE))
call("nlp", "detect_jailbreak", lambda: c.nlp.detect_jailbreak(SAMPLE))
call("nlp", "detect_harmful", lambda: c.nlp.detect_harmful(SAMPLE))

# ========================================================================
# V1: ai_act
# ========================================================================
call("aiAct", "watermark", lambda: c.ai_act.watermark(SAMPLE))
call("aiAct", "high_impact_watermark", lambda: c.ai_act.high_impact_watermark(SAMPLE))
call("aiAct", "verify", lambda: c.ai_act.verify(SAMPLE))
call("aiAct", "guidelines", lambda: c.ai_act.guidelines())
call("aiAct", "guardrail_check", lambda: c.ai_act.guardrail_check(SAMPLE))
call("aiAct", "pii_detect", lambda: c.ai_act.pii_detect(SAMPLE))
call("aiAct", "risk_assess", lambda: c.ai_act.risk_assess("test system"))
call("aiAct", "audit_logs", lambda: c.ai_act.audit_logs())

# ========================================================================
# V2: classify
# ========================================================================
call("classify", "classify", lambda: c.classify.classify(SAMPLE))
call("classify", "categories", lambda: c.classify.categories())
call("classify", "batch", lambda: c.classify.batch([{"content": "a"}, {"content": "b"}]))

# ========================================================================
# V2: jailbreak
# ========================================================================
call("jailbreak", "detect", lambda: c.jailbreak.detect(SAMPLE))
call("jailbreak", "types", lambda: c.jailbreak.types())
call("jailbreak", "detect_batch", lambda: c.jailbreak.detect_batch([{"content": "a"}, {"content": "b"}]))

# ========================================================================
# V2: safety
# ========================================================================
call("safety", "check", lambda: c.safety.check(SAMPLE))
call("safety", "categories", lambda: c.safety.categories())
call("safety", "backends", lambda: c.safety.backends())
call("safety", "check_batch", lambda: c.safety.check_batch([{"content": "a"}, {"content": "b"}]))

# ========================================================================
# V2: defense
# ========================================================================
call("defense", "paladin_stats", lambda: c.defense.paladin_stats())
call("defense", "trust_validate", lambda: c.defense.trust_validate(SAMPLE))
call("defense", "trust_profile", lambda: c.defense.trust_profile())
call("defense", "rag_detect", lambda: c.defense.rag_detect("query", ["doc1"]))
call("defense", "circuit_breaker_evaluate", lambda: c.defense.circuit_breaker_evaluate(SAMPLE))
call("defense", "circuit_breaker_status", lambda: c.defense.circuit_breaker_status())
call("defense", "adaptive_evaluate", lambda: c.defense.adaptive_evaluate(SAMPLE))

# ========================================================================
# V2: advanced
# ========================================================================
call("advanced", "detect", lambda: c.advanced.detect(SAMPLE))
call("advanced", "hybrid_web", lambda: c.advanced.hybrid_web(SAMPLE))
call("advanced", "vsh", lambda: c.advanced.vsh(SAMPLE))
call("advanced", "few_shot", lambda: c.advanced.few_shot(SAMPLE))
call("advanced", "cot", lambda: c.advanced.cot(SAMPLE))
call("advanced", "acoustic", lambda: c.advanced.acoustic(SAMPLE))
call("advanced", "context_confusion", lambda: c.advanced.context_confusion(SAMPLE))
call("advanced", "info_extraction", lambda: c.advanced.info_extraction(SAMPLE))

# ========================================================================
# V2: adversaflow
# ========================================================================
call("adversaflow", "campaigns", lambda: list(c.adversaflow.campaigns(limit=5)))
call("adversaflow", "tree", lambda: c.adversaflow.tree())

# ========================================================================
# V3: guardnet
# ========================================================================
call("guardnet", "analyze", lambda: c.guardnet.analyze(SAMPLE))
call("guardnet", "jbshield", lambda: c.guardnet.jbshield(SAMPLE))
call("guardnet", "ccfc", lambda: c.guardnet.ccfc(SAMPLE))
call("guardnet", "muli", lambda: c.guardnet.muli(SAMPLE))
call("guardnet", "unified", lambda: c.guardnet.unified(SAMPLE))

# ========================================================================
# V3: agent
# ========================================================================
call("agent", "scan", lambda: c.agent.scan(SAMPLE))

# ========================================================================
# V3: anomaly
# ========================================================================
call("anomaly", "algorithms", lambda: c.anomaly.algorithms())
call("anomaly", "detect", lambda: c.anomaly.detect(metric="cpu_usage", value=42.0,
                                                    history=[10, 11, 9.5, 10.2, 10.8]))
call("anomaly", "events", lambda: list(c.anomaly.events(limit=5)))
call("anomaly", "stats", lambda: c.anomaly.stats())

# ========================================================================
# V3: multimodal
# ========================================================================
call("multimodal", "scan", lambda: c.multimodal.scan(SAMPLE))

# ========================================================================
# V3: evolution
# ========================================================================
call("evolution", "stats", lambda: c.evolution.stats())
call("evolution", "generate", lambda: c.evolution.generate(SAMPLE))

# ========================================================================
# V3: saber
# ========================================================================
call("saber", "estimate", lambda: c.saber.estimate(SAMPLE))
call("saber", "evaluate", lambda: c.saber.evaluate(SAMPLE))
call("saber", "budget", lambda: c.saber.budget())
call("saber", "compare", lambda: c.saber.compare(SAMPLE, defenses=["paladin"]))

# ========================================================================
# Ops
# ========================================================================
call("ops", "get_thresholds", lambda: c.ops.get_thresholds())
call("ops", "redteam_stats", lambda: c.ops.redteam_stats())
call("ops", "attack_library", lambda: c.ops.attack_library())

# ========================================================================
# API keys
# ========================================================================
call("apiKeys", "list", lambda: list(c.api_keys.list(limit=5)))

# ========================================================================
# V1: orchestration (full coverage)
# ========================================================================
o = c.orchestration
call("orchestration", "runs", lambda: o.run(SAMPLE))
call("orchestration", "runs/basic", lambda: o.basic(SAMPLE))
call("orchestration", "runs/standard", lambda: o.standard(SAMPLE))
call("orchestration", "runs/full", lambda: o.full(SAMPLE))
call("orchestration", "runs/advanced", lambda: o.advanced(SAMPLE))
call("orchestration", "runs/agent", lambda: o.agent(SAMPLE))
call("orchestration", "runs/anomaly", lambda: o.anomaly(SAMPLE))
call("orchestration", "runs/pii", lambda: o.pii(SAMPLE))
call("orchestration", "runs/anomaly/timeseries",
     lambda: o.anomaly_timeseries(value=42.0, history=[10, 11, 9.5, 10.2, 10.8]))
call("orchestration", "configs GET",
     lambda: o.get_config(TENANT, "standard"))
call("orchestration", "configs PUT",
     lambda: o.upsert_config(TENANT, "standard",
                             algorithm="weighted_mean", mode="auto",
                             weights={"v1.judge": 0.5, "v2.classify": 0.5},
                             thresholds={"block": 0.7}))
call("orchestration", "gridsearch",
     lambda: o.gridsearch(domain="default", scenario="standard", max_samples=5))
job = call("orchestration", "gridsearch/jobs",
           lambda: o.create_gridsearch_job(domain="default", scenario="standard", max_samples=5))
job_id = _attr(job, "job_id", "id", default="00000000-0000-0000-0000-000000000000")
call("orchestration", "gridsearch/jobs/{id}",
     lambda: o.get_gridsearch_job(job_id))
call("orchestration", "gridsearch/jobs/{id}/results",
     lambda: o.list_gridsearch_results(job_id))
call("orchestration", "gridsearch/jobs/{id}/promote",
     lambda: o.promote_gridsearch_job(job_id, tenant_id=TENANT, scenario="standard"))
call("orchestration", "datasets", lambda: o.list_datasets())
call("orchestration", "v3 pipeline/run",
     lambda: o.pipeline_run(prompt=SAMPLE, evolution_generations=1, saber_trials=5))
call("orchestration", "v3 military/orchestrate",
     lambda: o.military_orchestrate(text=SAMPLE))
call("orchestration", "v3 military/status",
     lambda: o.military_status())

# ========================================================================
# Print results
# ========================================================================
print("\n========================================================================")
print(f"  AEGIS Python SDK — Full Coverage Smoke ({BASE_URL})")
print("========================================================================")

ok = sum(1 for _, _, s, _ in results if s == "OK")
fail = sum(1 for _, _, s, _ in results if s == "FAIL")
skipped = sum(1 for _, _, s, _ in results if s == "SKIP")
total = len(results)

current_group = None
for group, name, status, detail in results:
    if group != current_group:
        print(f"\n[{group}]")
        current_group = group
    mark = {"OK": "✅", "FAIL": "❌", "SKIP": "⊘"}[status]
    print(f"  {mark} {name:40s} {detail}")

print(f"\n  Total: {total}  |  OK: {ok}  |  FAIL: {fail}  |  SKIP: {skipped}")
sys.exit(0 if fail == 0 else 1)
