package aegis_test

import (
	"encoding/json"
	"testing"

	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

func TestJudgeRequestMarshalUnmarshal(t *testing.T) {
	req := models.JudgeRequest{
		Input:   "Hello world",
		Context: "user context",
		Metadata: map[string]string{
			"key": "value",
		},
	}
	data, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Marshal: %v", err)
	}
	var got models.JudgeRequest
	if err := json.Unmarshal(data, &got); err != nil {
		t.Fatalf("Unmarshal: %v", err)
	}
	if got.Input != req.Input {
		t.Errorf("Input = %q, want %q", got.Input, req.Input)
	}
	if got.Context != req.Context {
		t.Errorf("Context = %q, want %q", got.Context, req.Context)
	}
}

func TestJudgeResponseMarshalUnmarshal(t *testing.T) {
	jsonStr := `{
		"id": "judge-123",
		"verdict": "block",
		"risk": {"level": "high", "score": 0.9, "categories": {}},
		"defense_layers": [{"name": "layer1", "passed": false, "score": 0.9, "latency_ms": 50}],
		"explanation": "blocked",
		"processing_ms": 100,
		"created_at": "2025-02-24T10:00:00Z"
	}`
	var resp models.JudgeResponse
	if err := json.Unmarshal([]byte(jsonStr), &resp); err != nil {
		t.Fatalf("Unmarshal: %v", err)
	}
	if resp.ID != "judge-123" {
		t.Errorf("ID = %q, want judge-123", resp.ID)
	}
	if resp.Verdict != "block" {
		t.Errorf("Verdict = %q, want block", resp.Verdict)
	}
	if len(resp.DefenseLayers) != 1 {
		t.Errorf("DefenseLayers len = %d, want 1", len(resp.DefenseLayers))
	}
	if resp.DefenseLayers[0].Name != "layer1" {
		t.Errorf("DefenseLayers[0].Name = %q, want layer1", resp.DefenseLayers[0].Name)
	}
}

func TestRuleUnmarshal(t *testing.T) {
	jsonStr := `{
		"id": "rule-1",
		"name": "Test Rule",
		"description": "A test rule",
		"pattern": ".*malicious.*",
		"action": "block",
		"severity": "high",
		"enabled": true,
		"tags": ["security", "test"],
		"created_at": "2025-02-24T10:00:00Z",
		"updated_at": "2025-02-24T11:00:00Z"
	}`
	var rule models.Rule
	if err := json.Unmarshal([]byte(jsonStr), &rule); err != nil {
		t.Fatalf("Unmarshal: %v", err)
	}
	if rule.ID != "rule-1" {
		t.Errorf("ID = %q, want rule-1", rule.ID)
	}
	if rule.Name != "Test Rule" {
		t.Errorf("Name = %q, want Test Rule", rule.Name)
	}
	if rule.Pattern != ".*malicious.*" {
		t.Errorf("Pattern = %q, want .*malicious.*", rule.Pattern)
	}
}

func TestSafetyCheckResponseUnmarshal(t *testing.T) {
	jsonStr := `{
		"safe": false,
		"verdict": "unsafe",
		"categories": ["harmful", "jailbreak"],
		"scores": {"harmful": 0.85},
		"backend": "default"
	}`
	var resp models.SafetyCheckResponse
	if err := json.Unmarshal([]byte(jsonStr), &resp); err != nil {
		t.Fatalf("Unmarshal: %v", err)
	}
	if resp.Safe != false {
		t.Error("Safe should be false")
	}
	if len(resp.Categories) != 2 {
		t.Errorf("Categories len = %d, want 2", len(resp.Categories))
	}
}

func TestOmitemptyWorksForOptionalFields(t *testing.T) {
	req := models.JudgeRequest{Input: "test"}
	data, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Marshal: %v", err)
	}
	// Context, SessionID, UserID, etc. should be omitted when empty
	var m map[string]interface{}
	if err := json.Unmarshal(data, &m); err != nil {
		t.Fatalf("Unmarshal: %v", err)
	}
	if _, ok := m["context"]; ok {
		t.Error("context should be omitted when empty")
	}
	if _, ok := m["session_id"]; ok {
		t.Error("session_id should be omitted when empty")
	}
}
