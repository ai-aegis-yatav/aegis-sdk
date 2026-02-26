package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type DefenseService struct {
	t *internal.Transport
}

func (s *DefenseService) PaladinStats(ctx context.Context) (*models.PaladinStats, error) {
	var resp models.PaladinStats
	if err := s.t.Do(ctx, "GET", "/defense/paladin/stats", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) EnableLayer(ctx context.Context, req models.EnableLayerRequest) (*models.EnableLayerResponse, error) {
	var resp models.EnableLayerResponse
	if err := s.t.Do(ctx, "POST", "/defense/paladin/layers", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) TrustValidate(ctx context.Context, req models.TrustValidateRequest) (*models.TrustValidateResponse, error) {
	var resp models.TrustValidateResponse
	if err := s.t.Do(ctx, "POST", "/defense/trust/validate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) TrustProfile(ctx context.Context, source string) (*models.TrustProfile, error) {
	var resp models.TrustProfile
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/defense/trust/profile/%s", source), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) RagDetect(ctx context.Context, req models.RagDetectRequest) (*models.RagDetectResponse, error) {
	var resp models.RagDetectResponse
	if err := s.t.Do(ctx, "POST", "/defense/rag/detect", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) CircuitBreakerEvaluate(ctx context.Context, req models.CircuitBreakerEvalRequest) (*models.CircuitBreakerResponse, error) {
	var resp models.CircuitBreakerResponse
	if err := s.t.Do(ctx, "POST", "/defense/circuit-breaker/evaluate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) CircuitBreakerStatus(ctx context.Context, service string) (*models.CircuitBreakerResponse, error) {
	var resp models.CircuitBreakerResponse
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/defense/circuit-breaker/%s", service), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) AdaptiveEvaluate(ctx context.Context, req models.AdaptiveEvalRequest) (*models.AdaptiveEvalResponse, error) {
	var resp models.AdaptiveEvalResponse
	if err := s.t.Do(ctx, "POST", "/defense/adaptive/evaluate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *DefenseService) AdaptiveLearn(ctx context.Context, req models.AdaptiveLearnRequest) (*models.AdaptiveLearnResponse, error) {
	var resp models.AdaptiveLearnResponse
	if err := s.t.Do(ctx, "POST", "/defense/adaptive/learn", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
