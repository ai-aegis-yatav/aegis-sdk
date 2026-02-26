package models

import "time"

type JudgeRequest struct {
	Input       string            `json:"input"`
	Context     string            `json:"context,omitempty"`
	SessionID   string            `json:"session_id,omitempty"`
	UserID      string            `json:"user_id,omitempty"`
	Model       string            `json:"model,omitempty"`
	Layers      []string          `json:"layers,omitempty"`
	Metadata    map[string]string `json:"metadata,omitempty"`
	Stream      bool              `json:"stream,omitempty"`
}

type JudgeResponse struct {
	ID            string         `json:"id"`
	Verdict       string         `json:"verdict"`
	Risk          Risk           `json:"risk"`
	DefenseLayers []DefenseLayer `json:"defense_layers"`
	Explanation   string         `json:"explanation"`
	SessionID     string         `json:"session_id,omitempty"`
	ProcessingMs  int            `json:"processing_ms"`
	CreatedAt     time.Time      `json:"created_at"`
}

type JudgeBatchRequest struct {
	Inputs []JudgeRequest `json:"inputs"`
}

type JudgeBatchResponse struct {
	Results []JudgeResponse `json:"results"`
}

type Risk struct {
	Level      string             `json:"level"`
	Score      float64            `json:"score"`
	Categories map[string]float64 `json:"categories"`
}

type DefenseLayer struct {
	Name       string  `json:"name"`
	Passed     bool    `json:"passed"`
	Score      float64 `json:"score"`
	Detail     string  `json:"detail,omitempty"`
	LatencyMs  int     `json:"latency_ms"`
}

type JudgeStreamEvent struct {
	Type  string      `json:"type"`
	Layer string      `json:"layer,omitempty"`
	Data  interface{} `json:"data,omitempty"`
	Done  bool        `json:"done"`
}
