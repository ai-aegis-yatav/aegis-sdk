package models

type AdvancedDetectRequest struct {
	Text     string `json:"text"`
	Detector string `json:"detector,omitempty"`
}

type AdvancedDetectResponse struct {
	Detected   bool               `json:"detected"`
	Confidence float64            `json:"confidence"`
	Type       string             `json:"type"`
	Scores     map[string]float64 `json:"scores"`
}

type HybridWebRequest struct {
	URL     string `json:"url"`
	Content string `json:"content,omitempty"`
}

type HybridWebResponse struct {
	Safe       bool     `json:"safe"`
	Threats    []string `json:"threats"`
	Score      float64  `json:"score"`
	Details    string   `json:"details"`
}

type VSHRequest struct {
	Text  string `json:"text"`
	Mode  string `json:"mode,omitempty"`
}

type VSHResponse struct {
	Detected   bool    `json:"detected"`
	Confidence float64 `json:"confidence"`
	Category   string  `json:"category"`
}

type FewShotRequest struct {
	Text     string   `json:"text"`
	Examples []string `json:"examples"`
}

type FewShotResponse struct {
	Detected   bool    `json:"detected"`
	Confidence float64 `json:"confidence"`
	MatchedIdx int     `json:"matched_idx"`
}

type CoTRequest struct {
	Text string `json:"text"`
}

type CoTResponse struct {
	Detected   bool     `json:"detected"`
	Confidence float64  `json:"confidence"`
	Chain      []string `json:"chain"`
}

type AcousticRequest struct {
	Text string `json:"text"`
}

type AcousticResponse struct {
	Detected   bool    `json:"detected"`
	Confidence float64 `json:"confidence"`
	Pattern    string  `json:"pattern"`
}

type ContextConfusionRequest struct {
	Text    string `json:"text"`
	Context string `json:"context,omitempty"`
}

type ContextConfusionResponse struct {
	Detected   bool    `json:"detected"`
	Confidence float64 `json:"confidence"`
	Type       string  `json:"type"`
}

type InfoExtractionRequest struct {
	Text       string   `json:"text"`
	Categories []string `json:"categories,omitempty"`
}

type InfoExtractionResponse struct {
	Entities []ExtractedEntity `json:"entities"`
}

type ExtractedEntity struct {
	Type       string  `json:"type"`
	Value      string  `json:"value"`
	Confidence float64 `json:"confidence"`
}
