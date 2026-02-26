package models

type SaberEstimateRequest struct {
	Model       string            `json:"model"`
	InputTokens int               `json:"input_tokens"`
	OutputTokens int              `json:"output_tokens"`
	Features    []string          `json:"features,omitempty"`
	Options     map[string]string `json:"options,omitempty"`
}

type SaberEstimateResponse struct {
	CostUSD     float64           `json:"cost_usd"`
	Breakdown   map[string]float64 `json:"breakdown"`
	Model       string            `json:"model"`
}

type SaberEvaluateRequest struct {
	Model       string `json:"model"`
	Input       string `json:"input"`
	Output      string `json:"output"`
	GroundTruth string `json:"ground_truth,omitempty"`
}

type SaberEvaluateResponse struct {
	Score       float64            `json:"score"`
	Metrics     map[string]float64 `json:"metrics"`
	CostUSD     float64            `json:"cost_usd"`
}

type SaberBudget struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	LimitUSD   float64 `json:"limit_usd"`
	UsedUSD    float64 `json:"used_usd"`
	Period     string  `json:"period"`
	AlertAt    float64 `json:"alert_at"`
}

type SaberBudgetRequest struct {
	Name     string  `json:"name"`
	LimitUSD float64 `json:"limit_usd"`
	Period   string  `json:"period,omitempty"`
	AlertAt  float64 `json:"alert_at,omitempty"`
}

type SaberCompareRequest struct {
	Models []string `json:"models"`
	Input  string   `json:"input"`
	Output string   `json:"output,omitempty"`
}

type SaberCompareResponse struct {
	Comparisons []SaberModelComparison `json:"comparisons"`
	Recommended string                 `json:"recommended"`
}

type SaberModelComparison struct {
	Model   string  `json:"model"`
	CostUSD float64 `json:"cost_usd"`
	Score   float64 `json:"score"`
	Latency float64 `json:"latency_ms"`
}

type SaberReport struct {
	Period      string             `json:"period"`
	TotalCost   float64            `json:"total_cost_usd"`
	ByModel     map[string]float64 `json:"by_model"`
	ByFeature   map[string]float64 `json:"by_feature"`
	Trend       []SaberTrendPoint  `json:"trend"`
}

type SaberTrendPoint struct {
	Date    string  `json:"date"`
	CostUSD float64 `json:"cost_usd"`
}
