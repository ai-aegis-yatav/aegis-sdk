package models

import "time"

type Escalation struct {
	ID          string    `json:"id"`
	JudgmentID  string    `json:"judgment_id"`
	Reason      string    `json:"reason"`
	Severity    string    `json:"severity"`
	Status      string    `json:"status"`
	AssignedTo  string    `json:"assigned_to,omitempty"`
	Resolution  string    `json:"resolution,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	ResolvedAt  *time.Time `json:"resolved_at,omitempty"`
}

type EscalationCreateRequest struct {
	JudgmentID string `json:"judgment_id"`
	Reason     string `json:"reason"`
	Severity   string `json:"severity,omitempty"`
}

type EscalationResolveRequest struct {
	Resolution string `json:"resolution"`
	Action     string `json:"action,omitempty"`
}

type EscalationAssignRequest struct {
	AssignedTo string `json:"assigned_to"`
}

type EscalationStats struct {
	Total      int            `json:"total"`
	Open       int            `json:"open"`
	Resolved   int            `json:"resolved"`
	AvgResolve string         `json:"avg_resolve_time"`
	BySeverity map[string]int `json:"by_severity"`
}
