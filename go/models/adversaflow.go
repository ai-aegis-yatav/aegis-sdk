package models

import "time"

type Campaign struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Status    string    `json:"status"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
}

type AttackTree struct {
	ID       string       `json:"id"`
	Name     string       `json:"name"`
	Nodes    []AttackNode `json:"nodes"`
}

type AttackNode struct {
	ID       string       `json:"id"`
	Label    string       `json:"label"`
	Type     string       `json:"type"`
	Children []AttackNode `json:"children,omitempty"`
}

type TraceEntry struct {
	ID        string    `json:"id"`
	Step      int       `json:"step"`
	Action    string    `json:"action"`
	Input     string    `json:"input"`
	Output    string    `json:"output"`
	Success   bool      `json:"success"`
	Timestamp time.Time `json:"timestamp"`
}

type AdversaFlowStats struct {
	TotalCampaigns int            `json:"total_campaigns"`
	ActiveCount    int            `json:"active_count"`
	SuccessRate    float64        `json:"success_rate"`
	ByType         map[string]int `json:"by_type"`
}

type RecordRequest struct {
	CampaignID string `json:"campaign_id"`
	Step       int    `json:"step"`
	Action     string `json:"action"`
	Input      string `json:"input"`
	Output     string `json:"output"`
	Success    bool   `json:"success"`
}

type RecordResponse struct {
	ID      string `json:"id"`
	Saved   bool   `json:"saved"`
}
