package models

type EvolutionGenerateRequest struct {
	Seed       string   `json:"seed"`
	Type       string   `json:"type,omitempty"`
	Count      int      `json:"count,omitempty"`
	Strategies []string `json:"strategies,omitempty"`
}

type EvolutionGenerateResponse struct {
	Variants []EvolutionVariant `json:"variants"`
}

type EvolutionVariant struct {
	Text     string  `json:"text"`
	Strategy string  `json:"strategy"`
	Score    float64 `json:"score"`
}

type EvolutionEvolveRequest struct {
	Text       string   `json:"text"`
	Rounds     int      `json:"rounds,omitempty"`
	Strategies []string `json:"strategies,omitempty"`
}

type EvolutionEvolveResponse struct {
	Rounds []EvolutionRound `json:"rounds"`
	Final  EvolutionVariant `json:"final"`
}

type EvolutionRound struct {
	Round    int                `json:"round"`
	Variants []EvolutionVariant `json:"variants"`
	Best     EvolutionVariant   `json:"best"`
}

type EvolutionStats struct {
	TotalGenerations int            `json:"total_generations"`
	ByStrategy       map[string]int `json:"by_strategy"`
	AvgScore         float64        `json:"avg_score"`
	BestScore        float64        `json:"best_score"`
}
