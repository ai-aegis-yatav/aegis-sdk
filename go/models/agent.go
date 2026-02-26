package models

type AgentScanRequest struct {
	AgentConfig map[string]interface{} `json:"agent_config"`
	Tools       []AgentTool            `json:"tools,omitempty"`
	Prompt      string                 `json:"prompt,omitempty"`
}

type AgentTool struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Schema      string `json:"schema,omitempty"`
}

type AgentScanResponse struct {
	Safe           bool           `json:"safe"`
	Vulnerabilities []AgentVuln   `json:"vulnerabilities"`
	RiskScore      float64        `json:"risk_score"`
	Recommendations []string      `json:"recommendations"`
}

type AgentVuln struct {
	Type     string  `json:"type"`
	Severity string  `json:"severity"`
	Detail   string  `json:"detail"`
	Location string  `json:"location,omitempty"`
	Score    float64 `json:"score"`
}

type ToolchainRequest struct {
	Tools    []AgentTool `json:"tools"`
	Workflow string      `json:"workflow,omitempty"`
}

type ToolchainResponse struct {
	Safe           bool      `json:"safe"`
	Risks          []AgentVuln `json:"risks"`
	ChainAnalysis  string    `json:"chain_analysis"`
}

type MemoryPoisoningRequest struct {
	Memory  []MemoryEntry `json:"memory"`
	Query   string        `json:"query,omitempty"`
}

type MemoryEntry struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type MemoryPoisoningResponse struct {
	Poisoned   bool      `json:"poisoned"`
	Confidence float64   `json:"confidence"`
	Flagged    []int     `json:"flagged"`
	Details    string    `json:"details"`
}

type ReasoningHijackRequest struct {
	Prompt    string `json:"prompt"`
	Response  string `json:"response"`
}

type ReasoningHijackResponse struct {
	Hijacked   bool    `json:"hijacked"`
	Confidence float64 `json:"confidence"`
	Type       string  `json:"type,omitempty"`
	Details    string  `json:"details"`
}

type ToolDisguiseRequest struct {
	ToolCall    string `json:"tool_call"`
	Description string `json:"description"`
}

type ToolDisguiseResponse struct {
	Disguised  bool    `json:"disguised"`
	Confidence float64 `json:"confidence"`
	ActualTool string  `json:"actual_tool,omitempty"`
	Details    string  `json:"details"`
}
