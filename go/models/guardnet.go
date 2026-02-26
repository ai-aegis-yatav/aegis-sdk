package models

type GuardNetAnalyzeRequest struct {
	Text    string   `json:"text"`
	Modules []string `json:"modules,omitempty"`
}

type GuardNetAnalyzeResponse struct {
	Safe       bool                  `json:"safe"`
	Score      float64               `json:"score"`
	Modules    []GuardNetModuleResult `json:"modules"`
}

type GuardNetModuleResult struct {
	Name       string  `json:"name"`
	Passed     bool    `json:"passed"`
	Score      float64 `json:"score"`
	Detail     string  `json:"detail,omitempty"`
}

type JBShieldRequest struct {
	Text string `json:"text"`
}

type JBShieldResponse struct {
	Blocked    bool    `json:"blocked"`
	Confidence float64 `json:"confidence"`
	Type       string  `json:"type,omitempty"`
}

type CCFCRequest struct {
	Text    string `json:"text"`
	Context string `json:"context,omitempty"`
}

type CCFCResponse struct {
	Detected   bool    `json:"detected"`
	Confidence float64 `json:"confidence"`
	Category   string  `json:"category"`
}

type MULIRequest struct {
	Text     string `json:"text"`
	Language string `json:"language,omitempty"`
}

type MULIResponse struct {
	Detected   bool    `json:"detected"`
	Confidence float64 `json:"confidence"`
	Language   string  `json:"language"`
}

type UnifiedRequest struct {
	Text    string   `json:"text"`
	Modules []string `json:"modules,omitempty"`
}

type UnifiedResponse struct {
	Safe    bool                   `json:"safe"`
	Score   float64                `json:"score"`
	Results map[string]interface{} `json:"results"`
}
