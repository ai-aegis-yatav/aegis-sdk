package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// AiActService — V1 EU AI Act compliance.
type AiActService struct {
	t *internal.Transport
}

func bytesOf(s string) []byte { return []byte(s) }

func defaultWatermarkBody(content string) map[string]any {
	return map[string]any{
		"content_type": "text",
		"content":      bytesOf(content),
		"ai_model": map[string]any{
			"model_name": "smoke-test", "model_version": "1.0",
			"model_type": "text-generation", "provider": "aegis",
		},
		"service_provider": map[string]any{
			"provider_name": "smoke-test", "provider_id": "aegis-smoke",
		},
		"risk_level":       "limited",
		"watermark_config": map[string]any{"method": "invisible", "strength": 0.5},
	}
}

func defaultHighImpactBody(content string) map[string]any {
	return map[string]any{
		"domain":       "education",
		"content_type": "text",
		"content":      bytesOf(content),
		"ai_model": map[string]any{
			"model_name": "smoke-test", "model_version": "1.0",
			"model_type": "text-generation", "provider": "aegis",
		},
		"risk_assessment": map[string]any{
			"risk_level": "high", "impact_areas": []string{"education"},
		},
		"watermark_config": map[string]any{
			"method": "invisible", "strength": 0.9, "high_impact": true,
		},
	}
}

func defaultVerifyBody(content string) map[string]any {
	return map[string]any{
		"content_type":        "text",
		"content":             bytesOf(content),
		"check_tampering":     true,
		"include_provenance":  false,
	}
}

func (s *AiActService) Watermark(ctx context.Context, content string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ai-act/watermark", defaultWatermarkBody(content), &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AiActService) HighImpactWatermark(ctx context.Context, content string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ai-act/high-impact-watermark", defaultHighImpactBody(content), &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AiActService) Verify(ctx context.Context, content string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ai-act/verify", defaultVerifyBody(content), &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AiActService) GuardrailCheck(ctx context.Context, content string) (map[string]any, error) {
	body := map[string]any{
		"content":                content,
		"content_type":           "text",
		"check_prompt_injection": true,
		"check_pii":              true,
		"check_toxicity":         true,
		"mask_pii":               false,
		"use_llm":                false,
	}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ai-act/guardrail-check", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AiActService) PiiDetect(ctx context.Context, content string) (map[string]any, error) {
	body := map[string]any{"content": content, "mask": false, "entity_types": []string{}}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ai-act/pii-detect", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AiActService) RiskAssess(ctx context.Context, systemDescription string) (map[string]any, error) {
	body := map[string]any{
		"system_name":           "smoke-test-system",
		"model_type":            "text-generation",
		"application_domains":   []string{"education"},
		"compute_flops":         nil,
		"handles_personal_data": false,
		"system_description":    systemDescription,
	}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ai-act/risk-assess", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AiActService) Guidelines(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v1/ai-act/guidelines", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AiActService) AuditLogs(ctx context.Context) (any, error) {
	var resp any
	if err := s.t.Do(ctx, "GET", "/v1/ai-act/audit-logs", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
