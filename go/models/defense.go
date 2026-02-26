package models

import "time"

type PaladinStats struct {
	ActiveLayers int              `json:"active_layers"`
	TotalChecks  int              `json:"total_checks"`
	BlockRate    float64          `json:"block_rate"`
	Layers       []LayerStatEntry `json:"layers"`
}

type LayerStatEntry struct {
	Name    string  `json:"name"`
	Enabled bool    `json:"enabled"`
	Checks  int     `json:"checks"`
	Blocked int     `json:"blocked"`
	AvgMs   float64 `json:"avg_ms"`
}

type EnableLayerRequest struct {
	Layer   string `json:"layer"`
	Enabled bool   `json:"enabled"`
}

type EnableLayerResponse struct {
	Layer   string `json:"layer"`
	Enabled bool   `json:"enabled"`
}

type TrustValidateRequest struct {
	Input     string            `json:"input"`
	Source    string            `json:"source,omitempty"`
	Context   map[string]string `json:"context,omitempty"`
}

type TrustValidateResponse struct {
	Trusted    bool    `json:"trusted"`
	Score      float64 `json:"score"`
	Reason     string  `json:"reason,omitempty"`
	Source     string  `json:"source"`
}

type TrustProfile struct {
	Source       string    `json:"source"`
	TrustScore   float64  `json:"trust_score"`
	Interactions int       `json:"interactions"`
	LastSeen     time.Time `json:"last_seen"`
	Flags        []string  `json:"flags,omitempty"`
}

type RagDetectRequest struct {
	Query     string   `json:"query"`
	Documents []string `json:"documents"`
	Response  string   `json:"response,omitempty"`
}

type RagDetectResponse struct {
	Poisoned   bool               `json:"poisoned"`
	Confidence float64            `json:"confidence"`
	Flagged    []int              `json:"flagged"`
	Details    map[string]float64 `json:"details"`
}

type CircuitBreakerEvalRequest struct {
	Service   string  `json:"service"`
	ErrorRate float64 `json:"error_rate,omitempty"`
}

type CircuitBreakerResponse struct {
	Service  string `json:"service"`
	State    string `json:"state"`
	Failures int    `json:"failures"`
	LastFail string `json:"last_failure,omitempty"`
}

type AdaptiveEvalRequest struct {
	Input    string            `json:"input"`
	Context  map[string]string `json:"context,omitempty"`
}

type AdaptiveEvalResponse struct {
	Decision string  `json:"decision"`
	Score    float64 `json:"score"`
	Adapted  bool    `json:"adapted"`
	Model    string  `json:"model"`
}

type AdaptiveLearnRequest struct {
	Feedback string `json:"feedback"`
	Label    string `json:"label"`
	InputID  string `json:"input_id"`
}

type AdaptiveLearnResponse struct {
	Accepted bool   `json:"accepted"`
	Message  string `json:"message"`
}
