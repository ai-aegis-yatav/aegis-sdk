package models

type MultimodalScanRequest struct {
	ImageURL string `json:"image_url,omitempty"`
	ImageB64 string `json:"image_b64,omitempty"`
	Text     string `json:"text,omitempty"`
	Mode     string `json:"mode,omitempty"`
}

type MultimodalScanResponse struct {
	Safe       bool               `json:"safe"`
	Score      float64            `json:"score"`
	Categories []string           `json:"categories"`
	Details    map[string]float64 `json:"details"`
}

type ImageAttackRequest struct {
	ImageURL string `json:"image_url,omitempty"`
	ImageB64 string `json:"image_b64,omitempty"`
}

type ImageAttackResponse struct {
	Attack     bool    `json:"attack"`
	Type       string  `json:"type,omitempty"`
	Confidence float64 `json:"confidence"`
	Details    string  `json:"details"`
}

type VisCRARequest struct {
	ImageURL string `json:"image_url,omitempty"`
	ImageB64 string `json:"image_b64,omitempty"`
	Text     string `json:"text,omitempty"`
}

type VisCRAResponse struct {
	Detected   bool    `json:"detected"`
	Confidence float64 `json:"confidence"`
	Type       string  `json:"type"`
	Details    string  `json:"details"`
}

type MMLRequest struct {
	Inputs []MMLInput `json:"inputs"`
}

type MMLInput struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

type MMLResponse struct {
	Safe       bool               `json:"safe"`
	Score      float64            `json:"score"`
	ByInput    []MMLInputResult   `json:"by_input"`
}

type MMLInputResult struct {
	Index   int     `json:"index"`
	Safe    bool    `json:"safe"`
	Score   float64 `json:"score"`
	Details string  `json:"details,omitempty"`
}
