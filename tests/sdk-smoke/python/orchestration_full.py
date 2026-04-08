#!/usr/bin/env python3
"""AEGIS Python SDK orchestration smoke test.

Exercises all V1 /v1/orchestration/* endpoints + V3 pipeline + military.
Usage:
    AEGIS_API_KEY_PROD=... python tests/sdk-smoke/python/orchestration_full.py
or against local dev:
    AEGIS_BASE_URL=http://localhost:8000 AEGIS_API_KEY_PROD=... python ...
"""
from __future__ import annotations

import os
import sys
import time
import uuid
import traceback

from aegis import AegisClient

API_KEY = os.environ.get("AEGIS_API_KEY_PROD") or os.environ.get("AEGIS_API_KEY")
BASE_URL = os.environ.get("AEGIS_BASE_URL", "https://api.aiaegis.io")

if not API_KEY:
    print("ERROR: set AEGIS_API_KEY_PROD or AEGIS_API_KEY", file=sys.stderr)
    sys.exit(2)

client = AegisClient(api_key=API_KEY, base_url=BASE_URL)
o = client.orchestration

results: list[tuple[str, str, str]] = []  # (endpoint, status, detail)
TENANT_ID = os.environ.get("AEGIS_TEST_TENANT_ID", str(uuid.uuid4()))
SAMPLE_TEXT = "테스트입니다 — 비밀번호는 1234입니다."


def call(name: str, fn):
    t0 = time.time()
    try:
        out = fn()
        ms = int((time.time() - t0) * 1000)
        results.append((name, "OK", f"{ms}ms"))
        return out
    except Exception as e:  # noqa: BLE001
        ms = int((time.time() - t0) * 1000)
        msg = str(e).split("\n")[0][:120]
        results.append((name, "FAIL", f"{ms}ms {msg}"))
        return None


# ---- V1 orchestration: 17 endpoints ----
call("POST /v1/orchestration/runs", lambda: o.run(SAMPLE_TEXT))
call("POST /v1/orchestration/runs/basic", lambda: o.basic(SAMPLE_TEXT))
call("POST /v1/orchestration/runs/standard", lambda: o.standard(SAMPLE_TEXT))
call("POST /v1/orchestration/runs/full", lambda: o.full(SAMPLE_TEXT))
call("POST /v1/orchestration/runs/advanced", lambda: o.advanced(SAMPLE_TEXT))
call("POST /v1/orchestration/runs/agent", lambda: o.agent(SAMPLE_TEXT))
call("POST /v1/orchestration/runs/anomaly", lambda: o.anomaly(SAMPLE_TEXT))
call("POST /v1/orchestration/runs/pii", lambda: o.pii(SAMPLE_TEXT))
call(
    "POST /v1/orchestration/runs/anomaly/timeseries",
    lambda: o.anomaly_timeseries(value=42.0, history=[10.0, 11.0, 9.5, 10.2, 10.8]),
)
call(
    f"GET  /v1/orchestration/configs/{{tid}}/standard",
    lambda: o.get_config(TENANT_ID, "standard"),
)
call(
    "PUT  /v1/orchestration/configs/{tid}/standard",
    lambda: o.upsert_config(
        TENANT_ID,
        "standard",
        algorithm="weighted_mean",
        mode="auto",
        weights={"v1.judge": 0.5, "v2.classify": 0.5},
        thresholds={"block": 0.7},
    ),
)
call(
    "POST /v1/orchestration/gridsearch",
    lambda: o.gridsearch(domain="default", scenario="standard", max_samples=5),
)
job = call(
    "POST /v1/orchestration/gridsearch/jobs",
    lambda: o.create_gridsearch_job(domain="default", scenario="standard", max_samples=5),
)
job_id = (job or {}).get("job_id") or "00000000-0000-0000-0000-000000000000"
call(
    "GET  /v1/orchestration/gridsearch/jobs/{id}",
    lambda: o.get_gridsearch_job(job_id),
)
call(
    "GET  /v1/orchestration/gridsearch/jobs/{id}/results",
    lambda: o.list_gridsearch_results(job_id),
)
call(
    "POST /v1/orchestration/gridsearch/jobs/{id}/promote",
    lambda: o.promote_gridsearch_job(job_id, tenant_id=TENANT_ID, scenario="standard"),
)
call("GET  /v1/orchestration/datasets", lambda: o.list_datasets())

# ---- V3 ----
call(
    "POST /v3/pipeline/run",
    lambda: o.pipeline_run(prompt=SAMPLE_TEXT, evolution_generations=1, saber_trials=5),
)
call(
    "POST /v3/military/orchestrate",
    lambda: o.military_orchestrate(text=SAMPLE_TEXT),
)
call("GET  /v3/military/status", lambda: o.military_status())

# ---- Print matrix ----
print("\n=== Python SDK Orchestration Smoke ({}) ===".format(BASE_URL))
ok = sum(1 for _, s, _ in results if s == "OK")
print(f"  {ok}/{len(results)} OK")
for name, status, detail in results:
    mark = "✅" if status == "OK" else "❌"
    print(f"  {mark} {name:60s} {detail}")

sys.exit(0 if ok == len(results) else 1)
