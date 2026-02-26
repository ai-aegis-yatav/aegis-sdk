package models

import "time"

type AnomalyAlgorithm struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
}

type AnomalyDetectRequest struct {
	Data      []float64 `json:"data"`
	Algorithm string    `json:"algorithm,omitempty"`
	Threshold float64   `json:"threshold,omitempty"`
}

type AnomalyDetectResponse struct {
	Anomalous  bool      `json:"anomalous"`
	Score      float64   `json:"score"`
	Threshold  float64   `json:"threshold"`
	Algorithm  string    `json:"algorithm"`
	Anomalies  []int     `json:"anomalies,omitempty"`
}

type AnomalyDetectBatchRequest struct {
	Datasets  [][]float64 `json:"datasets"`
	Algorithm string      `json:"algorithm,omitempty"`
	Threshold float64     `json:"threshold,omitempty"`
}

type AnomalyDetectBatchResponse struct {
	Results []AnomalyDetectResponse `json:"results"`
}

type AnomalyEvent struct {
	ID        string    `json:"id"`
	Score     float64   `json:"score"`
	Algorithm string    `json:"algorithm"`
	Detail    string    `json:"detail"`
	Timestamp time.Time `json:"timestamp"`
}

type AnomalyStats struct {
	TotalDetections int            `json:"total_detections"`
	ByAlgorithm     map[string]int `json:"by_algorithm"`
	AvgScore        float64        `json:"avg_score"`
	RecentCount     int            `json:"recent_count"`
}
