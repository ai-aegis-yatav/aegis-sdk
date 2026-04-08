// AEGIS Rust SDK orchestration smoke test.
//
// Setup:
//   cd tests/sdk-smoke/rust
//   AEGIS_API_KEY_PROD=... cargo run --bin orchestration_full
//
// Or against local dev:
//   AEGIS_BASE_URL=http://localhost:8000 AEGIS_API_KEY_PROD=... cargo run --bin orchestration_full

use std::collections::HashMap;
use std::env;
use std::time::Instant;

use aegis_sdk::{
    AegisClient,
    resources::orchestration::{
        EnsembleAlgorithm, EnsembleMode, GridSearchJobRequest, GridSearchRequest,
        MilitaryOrchestrateRequest, PipelineRequest, PromoteRequest, RunRequest, Scenario,
        TimeseriesAnomalyRequest, UpsertConfigRequest,
    },
};

#[derive(Debug)]
struct CallResult {
    name: &'static str,
    status: &'static str,
    detail: String,
}

#[tokio::main]
async fn main() {
    let api_key = env::var("AEGIS_API_KEY_PROD")
        .or_else(|_| env::var("AEGIS_API_KEY"))
        .unwrap_or_else(|_| {
            eprintln!("set AEGIS_API_KEY_PROD or AEGIS_API_KEY");
            std::process::exit(2);
        });
    let base_url =
        env::var("AEGIS_BASE_URL").unwrap_or_else(|_| "https://api.aiaegis.io".to_string());
    let tenant_str = env::var("AEGIS_TEST_TENANT_ID")
        .unwrap_or_else(|_| "00000000-0000-0000-0000-000000000001".to_string());
    let tenant_id = uuid::Uuid::parse_str(&tenant_str).unwrap_or_else(|_| uuid::Uuid::nil());
    let sample = "테스트입니다 — 비밀번호는 1234입니다.".to_string();

    let client = AegisClient::builder(api_key)
        .base_url(base_url.as_str())
        .build()
        .expect("client build");
    let o = client.orchestration();

    let mut results: Vec<CallResult> = Vec::new();

    macro_rules! check {
        ($name:expr, $expr:expr) => {{
            let t0 = Instant::now();
            match $expr.await {
                Ok(_) => results.push(CallResult {
                    name: $name,
                    status: "OK",
                    detail: format!("{}ms", t0.elapsed().as_millis()),
                }),
                Err(e) => {
                    let mut msg = e.to_string();
                    msg.truncate(120);
                    results.push(CallResult {
                        name: $name,
                        status: "FAIL",
                        detail: format!("{}ms {}", t0.elapsed().as_millis(), msg),
                    });
                }
            }
        }};
    }

    let mk = || RunRequest {
        content: sample.clone(),
        ..Default::default()
    };

    check!("POST /v1/orchestration/runs", o.run_generic(&mk()));
    check!("POST /v1/orchestration/runs/basic", o.basic(&mk()));
    check!("POST /v1/orchestration/runs/standard", o.standard(&mk()));
    check!("POST /v1/orchestration/runs/full", o.full(&mk()));
    check!("POST /v1/orchestration/runs/advanced", o.advanced(&mk()));
    check!("POST /v1/orchestration/runs/agent", o.agent(&mk()));
    check!("POST /v1/orchestration/runs/anomaly", o.anomaly(&mk()));
    check!("POST /v1/orchestration/runs/pii", o.pii(&mk()));
    check!(
        "POST /v1/orchestration/runs/anomaly/timeseries",
        o.anomaly_timeseries(&TimeseriesAnomalyRequest {
            value: 42.0,
            history: vec![10.0, 11.0, 9.5, 10.2, 10.8],
            algorithm: Some("zscore".into()),
        })
    );
    check!(
        "GET  /v1/orchestration/configs/{tid}/standard",
        o.get_config(tenant_id, "standard")
    );
    let mut weights = HashMap::new();
    weights.insert("v1.judge".to_string(), 0.5);
    weights.insert("v2.classify".to_string(), 0.5);
    let mut thresholds = HashMap::new();
    thresholds.insert("block".to_string(), 0.7);
    let upsert = UpsertConfigRequest {
        algorithm: EnsembleAlgorithm::WeightedMean,
        mode: EnsembleMode::Auto,
        weights,
        thresholds,
        source_job_id: None,
    };
    check!(
        "PUT  /v1/orchestration/configs/{tid}/standard",
        o.upsert_config(tenant_id, "standard", &upsert)
    );
    check!(
        "POST /v1/orchestration/gridsearch",
        o.gridsearch(&GridSearchRequest {
            domain: "default".into(),
            scenario: Scenario::Standard,
            max_samples: Some(5),
        })
    );

    // Job lifecycle
    let t0 = Instant::now();
    let job = o
        .create_gridsearch_job(&GridSearchJobRequest {
            domain: "default".into(),
            scenario: Scenario::Standard,
            max_samples: Some(5),
        })
        .await;
    let job_id = match &job {
        Ok(j) => {
            results.push(CallResult {
                name: "POST /v1/orchestration/gridsearch/jobs",
                status: "OK",
                detail: format!("{}ms", t0.elapsed().as_millis()),
            });
            j.job_id
        }
        Err(e) => {
            let mut msg = e.to_string();
            msg.truncate(120);
            results.push(CallResult {
                name: "POST /v1/orchestration/gridsearch/jobs",
                status: "FAIL",
                detail: format!("{}ms {}", t0.elapsed().as_millis(), msg),
            });
            uuid::Uuid::nil()
        }
    };
    check!(
        "GET  /v1/orchestration/gridsearch/jobs/{id}",
        o.get_gridsearch_job(job_id)
    );
    check!(
        "GET  /v1/orchestration/gridsearch/jobs/{id}/results",
        o.list_gridsearch_results(job_id)
    );
    check!(
        "POST /v1/orchestration/gridsearch/jobs/{id}/promote",
        o.promote_gridsearch_job(
            job_id,
            &PromoteRequest {
                tenant_id,
                scenario: Scenario::Standard,
            }
        )
    );
    check!("GET  /v1/orchestration/datasets", o.list_datasets());
    check!(
        "POST /v3/pipeline/run",
        o.pipeline_run(&PipelineRequest {
            prompt: sample.clone(),
            evolution_generations: Some(1),
            saber_trials: Some(5),
            ..Default::default()
        })
    );
    check!(
        "POST /v3/military/orchestrate",
        o.military_orchestrate(&MilitaryOrchestrateRequest {
            text: sample.clone(),
            ..Default::default()
        })
    );
    check!("GET  /v3/military/status", o.military_status());

    let ok = results.iter().filter(|r| r.status == "OK").count();
    println!(
        "\n=== Rust SDK Orchestration Smoke ({}) ===",
        base_url
    );
    println!("  {}/{} OK", ok, results.len());
    for r in &results {
        let mark = if r.status == "OK" { "✅" } else { "❌" };
        println!("  {} {:60} {}", mark, r.name, r.detail);
    }
    if ok != results.len() {
        std::process::exit(1);
    }
}
