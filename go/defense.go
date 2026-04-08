package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// DefenseService — V2 PALADIN, Trust, RAG, Circuit Breaker, Adaptive.
type DefenseService struct {
	t *internal.Transport
}

func (s *DefenseService) PaladinStats(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v2/defense/paladin/stats", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DefenseService) TrustValidate(ctx context.Context, content string) (map[string]any, error) {
	body := map[string]any{"content": content}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/defense/trust/validate", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DefenseService) TrustProfile(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v2/defense/trust/profile", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DefenseService) RagDetect(ctx context.Context, query string, documents []string) (map[string]any, error) {
	body := map[string]any{"content": query, "documents": documents}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/defense/rag/detect", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DefenseService) CircuitBreakerEvaluate(ctx context.Context, content string) (map[string]any, error) {
	body := map[string]any{"content": content}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/defense/circuit-breaker/evaluate", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DefenseService) CircuitBreakerStatus(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v2/defense/circuit-breaker/status", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DefenseService) AdaptiveEvaluate(ctx context.Context, content string) (map[string]any, error) {
	body := map[string]any{"content": content}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/defense/adaptive/evaluate", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
