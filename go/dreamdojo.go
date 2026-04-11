package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// DreamdojoService — V3 DreamDojo embodied-agent validation.
type DreamdojoService struct {
	t *internal.Transport
}

func (s *DreamdojoService) ValidateAction(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/dreamdojo/validate-action", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DreamdojoService) ValidateInput(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/dreamdojo/validate-input", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DreamdojoService) ValidatePipeline(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/dreamdojo/validate-pipeline", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DreamdojoService) ValidateLatent(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/dreamdojo/validate-latent", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *DreamdojoService) Embodiments(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/dreamdojo/embodiments", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
