// AEGIS Go SDK orchestration smoke test.
//
// Run after `go get github.com/ai-aegis-yatav/aegis-sdk/go@latest`:
//
//	AEGIS_API_KEY_PROD=... go run tests/sdk-smoke/go/orchestration_full.go
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	aegis "github.com/ai-aegis-yatav/aegis-sdk/go"
)

type result struct {
	name   string
	status string
	detail string
}

var results []result

func call(name string, fn func() error) {
	t0 := time.Now()
	err := fn()
	ms := time.Since(t0).Milliseconds()
	if err != nil {
		msg := err.Error()
		if len(msg) > 120 {
			msg = msg[:120]
		}
		results = append(results, result{name, "FAIL", fmt.Sprintf("%dms %s", ms, msg)})
	} else {
		results = append(results, result{name, "OK", fmt.Sprintf("%dms", ms)})
	}
}

func main() {
	apiKey := os.Getenv("AEGIS_API_KEY_PROD")
	if apiKey == "" {
		apiKey = os.Getenv("AEGIS_API_KEY")
	}
	if apiKey == "" {
		fmt.Fprintln(os.Stderr, "set AEGIS_API_KEY_PROD or AEGIS_API_KEY")
		os.Exit(2)
	}
	baseURL := os.Getenv("AEGIS_BASE_URL")
	if baseURL == "" {
		baseURL = "https://api.aiaegis.io"
	}

	client := aegis.NewClient(apiKey, aegis.WithBaseURL(baseURL))
	o := client.Orchestration
	ctx := context.Background()
	tenantID := os.Getenv("AEGIS_TEST_TENANT_ID")
	if tenantID == "" {
		tenantID = "00000000-0000-0000-0000-000000000001"
	}
	sample := "테스트입니다 — 비밀번호는 1234입니다."
	runReq := aegis.OrchestrationRunRequest{Content: sample}

	call("POST /v1/orchestration/runs", func() error {
		_, err := o.Run(ctx, runReq)
		return err
	})
	call("POST /v1/orchestration/runs/basic", func() error { _, err := o.Basic(ctx, runReq); return err })
	call("POST /v1/orchestration/runs/standard", func() error { _, err := o.Standard(ctx, runReq); return err })
	call("POST /v1/orchestration/runs/full", func() error { _, err := o.Full(ctx, runReq); return err })
	call("POST /v1/orchestration/runs/advanced", func() error { _, err := o.Advanced(ctx, runReq); return err })
	call("POST /v1/orchestration/runs/agent", func() error { _, err := o.Agent(ctx, runReq); return err })
	call("POST /v1/orchestration/runs/anomaly", func() error { _, err := o.Anomaly(ctx, runReq); return err })
	call("POST /v1/orchestration/runs/pii", func() error { _, err := o.PII(ctx, runReq); return err })
	call("POST /v1/orchestration/runs/anomaly/timeseries", func() error {
		_, err := o.AnomalyTimeseries(ctx, aegis.TimeseriesAnomalyRequest{
			Value: 42.0, History: []float64{10, 11, 9.5, 10.2, 10.8}, Algorithm: "zscore",
		})
		return err
	})
	call("GET  /v1/orchestration/configs/{tid}/standard", func() error {
		_, err := o.GetConfig(ctx, tenantID, "standard")
		return err
	})
	call("PUT  /v1/orchestration/configs/{tid}/standard", func() error {
		_, err := o.UpsertConfig(ctx, tenantID, "standard", aegis.UpsertConfigRequest{
			Algorithm: "weighted_mean", Mode: "auto",
			Weights:    map[string]float64{"v1.judge": 0.5, "v2.classify": 0.5},
			Thresholds: map[string]float64{"block": 0.7},
		})
		return err
	})
	max5 := 5
	call("POST /v1/orchestration/gridsearch", func() error {
		_, err := o.Gridsearch(ctx, aegis.GridSearchRequest{
			Domain: "default", Scenario: "standard", MaxSamples: &max5,
		})
		return err
	})
	var jobID string
	call("POST /v1/orchestration/gridsearch/jobs", func() error {
		resp, err := o.CreateGridsearchJob(ctx, aegis.GridSearchJobRequest{
			Domain: "default", Scenario: "standard", MaxSamples: &max5,
		})
		if resp != nil {
			jobID = resp.JobID
		}
		return err
	})
	if jobID == "" {
		jobID = "00000000-0000-0000-0000-000000000000"
	}
	call("GET  /v1/orchestration/gridsearch/jobs/{id}", func() error {
		_, err := o.GetGridsearchJob(ctx, jobID)
		return err
	})
	call("GET  /v1/orchestration/gridsearch/jobs/{id}/results", func() error {
		_, err := o.ListGridsearchResults(ctx, jobID)
		return err
	})
	call("POST /v1/orchestration/gridsearch/jobs/{id}/promote", func() error {
		_, err := o.PromoteGridsearchJob(ctx, jobID, aegis.PromoteRequest{TenantID: tenantID, Scenario: "standard"})
		return err
	})
	call("GET  /v1/orchestration/datasets", func() error {
		_, err := o.ListDatasets(ctx)
		return err
	})
	call("POST /v3/pipeline/run", func() error {
		_, err := o.PipelineRun(ctx, aegis.PipelineRequest{
			Prompt: sample, EvolutionGenerations: 1, SaberTrials: 5,
		})
		return err
	})
	call("POST /v3/military/orchestrate", func() error {
		_, err := o.MilitaryOrchestrate(ctx, aegis.MilitaryOrchestrateRequest{Text: sample})
		return err
	})
	call("GET  /v3/military/status", func() error {
		_, err := o.MilitaryStatus(ctx)
		return err
	})

	ok := 0
	for _, r := range results {
		if r.status == "OK" {
			ok++
		}
	}
	fmt.Printf("\n=== Go SDK Orchestration Smoke (%s) ===\n", baseURL)
	fmt.Printf("  %d/%d OK\n", ok, len(results))
	for _, r := range results {
		mark := "❌"
		if r.status == "OK" {
			mark = "✅"
		}
		fmt.Printf("  %s %-60s %s\n", mark, r.name, r.detail)
	}
	if ok != len(results) {
		os.Exit(1)
	}
}
