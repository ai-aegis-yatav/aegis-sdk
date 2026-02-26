package models

type SafetyCheckRequest struct {
	Text       string   `json:"text"`
	Categories []string `json:"categories,omitempty"`
	Backend    string   `json:"backend,omitempty"`
	Threshold  float64  `json:"threshold,omitempty"`
}

type SafetyCheckResponse struct {
	Safe       bool               `json:"safe"`
	Verdict    string             `json:"verdict"`
	Categories []string           `json:"categories"`
	Scores     map[string]float64 `json:"scores"`
	Backend    string             `json:"backend"`
}

type SafetyCheckBatchRequest struct {
	Texts      []string `json:"texts"`
	Categories []string `json:"categories,omitempty"`
	Backend    string   `json:"backend,omitempty"`
}

type SafetyCheckBatchResponse struct {
	Results []SafetyCheckResponse `json:"results"`
}

type SafetyBackend struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Categories  []string `json:"categories"`
}

type JailbreakDetectRequest struct {
	Text      string  `json:"text"`
	Threshold float64 `json:"threshold,omitempty"`
	Model     string  `json:"model,omitempty"`
}

type JailbreakDetectResponse struct {
	Jailbreak  bool               `json:"jailbreak"`
	Confidence float64            `json:"confidence"`
	Type       string             `json:"type,omitempty"`
	Scores     map[string]float64 `json:"scores"`
}

type JailbreakDetectBatchRequest struct {
	Texts     []string `json:"texts"`
	Threshold float64  `json:"threshold,omitempty"`
}

type JailbreakDetectBatchResponse struct {
	Results []JailbreakDetectResponse `json:"results"`
}

type JailbreakType struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Severity    string `json:"severity"`
}
