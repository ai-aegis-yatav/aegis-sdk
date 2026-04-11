package models

import "time"

type Rule struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Pattern     string    `json:"pattern"`
	Action      string    `json:"action"`
	Severity    string    `json:"severity"`
	Enabled     bool      `json:"enabled"`
	Priority    int       `json:"priority"`
	Tags        []string  `json:"tags,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type RuleCreateRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description,omitempty"`
	Pattern     string   `json:"pattern"`
	Action      string   `json:"action"`
	Severity    string   `json:"severity,omitempty"`
	Enabled     *bool    `json:"enabled,omitempty"`
	Priority    int      `json:"priority,omitempty"`
	Tags        []string `json:"tags,omitempty"`
}

type RuleUpdateRequest struct {
	Name        string   `json:"name,omitempty"`
	Description string   `json:"description,omitempty"`
	Pattern     string   `json:"pattern,omitempty"`
	Action      string   `json:"action,omitempty"`
	Severity    string   `json:"severity,omitempty"`
	Enabled     *bool    `json:"enabled,omitempty"`
	Priority    *int     `json:"priority,omitempty"`
	Tags        []string `json:"tags,omitempty"`
}

type RuleTestRequest struct {
	RuleID string `json:"rule_id,omitempty"`
	Input  string `json:"input"`
}

type RuleTestResponse struct {
	Matched bool   `json:"matched"`
	Action  string `json:"action,omitempty"`
	Detail  string `json:"detail,omitempty"`
}

type RuleTemplate struct {
	ID                 string `json:"id"`
	Name               string `json:"name"`
	Description        string `json:"description"`
	Pattern            string `json:"pattern"`
	Category           string `json:"category"`
	RegexExplanationKO string `json:"regex_explanation_ko,omitempty"`
	RegexExplanationEN string `json:"regex_explanation_en,omitempty"`
}
