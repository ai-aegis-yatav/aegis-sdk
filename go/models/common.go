package models

import (
	"fmt"
	"time"
)

type PaginatedResponse[T any] struct {
	Data       []T  `json:"data"`
	Total      int  `json:"total"`
	Page       int  `json:"page"`
	PerPage    int  `json:"per_page"`
	TotalPages int  `json:"total_pages"`
	HasMore    bool `json:"has_more"`
}

type QuotaInfo struct {
	Limit     int       `json:"limit"`
	Used      int       `json:"used"`
	Remaining int       `json:"remaining"`
	ResetAt   time.Time `json:"reset_at"`
	Tier      string    `json:"tier"`
}

type AnalyticsOverview struct {
	TotalJudgments   int            `json:"total_judgments"`
	BlockedCount     int            `json:"blocked_count"`
	AllowedCount     int            `json:"allowed_count"`
	EscalatedCount   int            `json:"escalated_count"`
	AvgResponseMs    float64        `json:"avg_response_ms"`
	TopThreats       []ThreatEntry  `json:"top_threats"`
	RiskDistribution map[string]int `json:"risk_distribution"`
}

type ThreatEntry struct {
	Category string `json:"category"`
	Count    int    `json:"count"`
	Severity string `json:"severity"`
}

type AnalyticsJudgments struct {
	TimeSeries []TimeSeriesPoint `json:"time_series"`
	Summary    map[string]int    `json:"summary"`
}

type TimeSeriesPoint struct {
	Timestamp time.Time `json:"timestamp"`
	Count     int       `json:"count"`
	Blocked   int       `json:"blocked"`
	Allowed   int       `json:"allowed"`
}

type AnalyticsDefenseLayers struct {
	Layers []DefenseLayerStats `json:"layers"`
}

type DefenseLayerStats struct {
	Name         string  `json:"name"`
	TotalChecks  int     `json:"total_checks"`
	Blocked      int     `json:"blocked"`
	Allowed      int     `json:"allowed"`
	AvgLatencyMs float64 `json:"avg_latency_ms"`
}

type AnalyticsThreats struct {
	Threats []ThreatDetail `json:"threats"`
}

type ThreatDetail struct {
	Category  string    `json:"category"`
	Count     int       `json:"count"`
	Severity  string    `json:"severity"`
	LastSeen  time.Time `json:"last_seen"`
	Trending  string    `json:"trending"`
	Examples  []string  `json:"examples,omitempty"`
}

type AnalyticsPerformance struct {
	AvgLatencyMs float64            `json:"avg_latency_ms"`
	P50Ms        float64            `json:"p50_ms"`
	P95Ms        float64            `json:"p95_ms"`
	P99Ms        float64            `json:"p99_ms"`
	Throughput   float64            `json:"throughput"`
	ByEndpoint   []EndpointPerfStat `json:"by_endpoint"`
}

type EndpointPerfStat struct {
	Endpoint     string  `json:"endpoint"`
	AvgLatencyMs float64 `json:"avg_latency_ms"`
	RequestCount int     `json:"request_count"`
	ErrorRate    float64 `json:"error_rate"`
}

type Evidence struct {
	ID         string                 `json:"id"`
	JudgmentID string                 `json:"judgment_id"`
	Type       string                 `json:"type"`
	Content    map[string]interface{} `json:"content"`
	Verified   bool                   `json:"verified"`
	CreatedAt  time.Time              `json:"created_at"`
}

type ApiKey struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Prefix      string     `json:"prefix"`
	Permissions []string   `json:"permissions"`
	Tier        string     `json:"tier"`
	CreatedAt   time.Time  `json:"created_at"`
	LastUsedAt  *time.Time `json:"last_used_at,omitempty"`
	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
	Revoked     bool       `json:"revoked"`
}

type ApiKeyCreateRequest struct {
	Name        string   `json:"name"`
	Permissions []string `json:"permissions,omitempty"`
	ExpiresIn   string   `json:"expires_in,omitempty"`
}

type ApiKeyCreateResponse struct {
	ApiKey
	Key string `json:"key"`
}

type CiGateRequest struct {
	RepoURL    string            `json:"repo_url"`
	CommitSHA  string            `json:"commit_sha"`
	Branch     string            `json:"branch,omitempty"`
	Thresholds map[string]string `json:"thresholds,omitempty"`
	Tests      []string          `json:"tests,omitempty"`
}

type CiGateResponse struct {
	Passed  bool              `json:"passed"`
	Results []CiGateResult    `json:"results"`
	Summary map[string]string `json:"summary"`
}

type CiGateResult struct {
	Test   string  `json:"test"`
	Passed bool    `json:"passed"`
	Score  float64 `json:"score"`
	Detail string  `json:"detail,omitempty"`
}

type WatermarkRequest struct {
	Content string            `json:"content"`
	Type    string            `json:"type"`
	Meta    map[string]string `json:"meta,omitempty"`
}

type WatermarkResponse struct {
	Watermarked string `json:"watermarked"`
	Token       string `json:"token"`
}

type WatermarkVerifyResponse struct {
	Verified  bool              `json:"verified"`
	Meta      map[string]string `json:"meta,omitempty"`
	Confidence float64          `json:"confidence"`
}

type PiiDetectRequest struct {
	Text       string   `json:"text"`
	Categories []string `json:"categories,omitempty"`
	Language   string   `json:"language,omitempty"`
}

type PiiDetectResponse struct {
	Entities []PiiEntity `json:"entities"`
	Redacted string      `json:"redacted"`
}

type PiiEntity struct {
	Type       string  `json:"type"`
	Value      string  `json:"value"`
	Start      int     `json:"start"`
	End        int     `json:"end"`
	Confidence float64 `json:"confidence"`
}

type RiskAssessRequest struct {
	SystemDescription string            `json:"system_description"`
	UseCase           string            `json:"use_case"`
	Meta              map[string]string `json:"meta,omitempty"`
}

type RiskAssessResponse struct {
	RiskLevel    string            `json:"risk_level"`
	Category     string            `json:"category"`
	Requirements []string          `json:"requirements"`
	Details      map[string]string `json:"details"`
}

type GuidelinesResponse struct {
	Guidelines []Guideline `json:"guidelines"`
}

type Guideline struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Severity    string `json:"severity"`
}

type AuditLog struct {
	ID        string                 `json:"id"`
	Action    string                 `json:"action"`
	Actor     string                 `json:"actor"`
	Resource  string                 `json:"resource"`
	Details   map[string]interface{} `json:"details,omitempty"`
	Timestamp time.Time              `json:"timestamp"`
}

type MLHealthResponse struct {
	Status  string            `json:"status"`
	Models  map[string]string `json:"models"`
	Version string            `json:"version"`
}

type EmbedRequest struct {
	Text  string `json:"text"`
	Model string `json:"model,omitempty"`
}

type EmbedResponse struct {
	Embedding []float64 `json:"embedding"`
	Model     string    `json:"model"`
	Tokens    int       `json:"tokens"`
}

type EmbedBatchRequest struct {
	Texts []string `json:"texts"`
	Model string   `json:"model,omitempty"`
}

type EmbedBatchResponse struct {
	Embeddings [][]float64 `json:"embeddings"`
	Model      string      `json:"model"`
	Tokens     int         `json:"tokens"`
}

type MLClassifyRequest struct {
	Text       string   `json:"text"`
	Categories []string `json:"categories,omitempty"`
	Model      string   `json:"model,omitempty"`
}

type MLClassifyResponse struct {
	Label      string             `json:"label"`
	Confidence float64            `json:"confidence"`
	Scores     map[string]float64 `json:"scores"`
}

type SimilarityRequest struct {
	TextA string `json:"text_a"`
	TextB string `json:"text_b"`
	Model string `json:"model,omitempty"`
}

type SimilarityResponse struct {
	Score float64 `json:"score"`
	Model string  `json:"model"`
}

type LanguageDetectRequest struct {
	Text string `json:"text"`
}

type LanguageDetectResponse struct {
	Language   string             `json:"language"`
	Confidence float64           `json:"confidence"`
	Scores     map[string]float64 `json:"scores"`
}

type HarmfulDetectRequest struct {
	Text       string   `json:"text"`
	Categories []string `json:"categories,omitempty"`
}

type HarmfulDetectResponse struct {
	Harmful    bool               `json:"harmful"`
	Categories []string           `json:"categories"`
	Scores     map[string]float64 `json:"scores"`
}

type ClassifyRequest struct {
	Text       string   `json:"text"`
	Categories []string `json:"categories,omitempty"`
}

type ClassifyResponse struct {
	Label      string             `json:"label"`
	Confidence float64            `json:"confidence"`
	Scores     map[string]float64 `json:"scores"`
}

type ClassifyBatchRequest struct {
	Texts      []string `json:"texts"`
	Categories []string `json:"categories,omitempty"`
}

type ClassifyBatchResponse struct {
	Results []ClassifyResponse `json:"results"`
}

type CategoryInfo struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type BenchmarkRequest struct {
	Suite   string            `json:"suite"`
	Options map[string]string `json:"options,omitempty"`
}

type BenchmarkResponse struct {
	ID      string            `json:"id"`
	Suite   string            `json:"suite"`
	Status  string            `json:"status"`
	Results map[string]any    `json:"results,omitempty"`
}

type ThresholdsConfig struct {
	Thresholds map[string]float64 `json:"thresholds"`
}

type RedteamStats struct {
	TotalAttacks    int            `json:"total_attacks"`
	SuccessRate     float64        `json:"success_rate"`
	ByCategory      map[string]int `json:"by_category"`
	RecentCampaigns []string       `json:"recent_campaigns"`
}

type AttackEntry struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Severity    string   `json:"severity"`
	Tags        []string `json:"tags"`
}

type ListParams struct {
	Page    int    `json:"page,omitempty"`
	PerPage int    `json:"per_page,omitempty"`
	Sort    string `json:"sort,omitempty"`
	Order   string `json:"order,omitempty"`
}

func (p ListParams) ToQuery() map[string]string {
	q := map[string]string{}
	if p.Page > 0 {
		q["page"] = intToStr(p.Page)
	}
	if p.PerPage > 0 {
		q["per_page"] = intToStr(p.PerPage)
	}
	if p.Sort != "" {
		q["sort"] = p.Sort
	}
	if p.Order != "" {
		q["order"] = p.Order
	}
	return q
}

func intToStr(i int) string {
	return fmt.Sprintf("%d", i)
}
