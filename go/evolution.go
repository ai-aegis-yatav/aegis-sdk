package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// EvolutionService — V3 attack evolution.
type EvolutionService struct {
	t *internal.Transport
}

func (s *EvolutionService) Generate(ctx context.Context, seedPrompt string) (map[string]any, error) {
	body := map[string]any{
		"target_behavior":    seedPrompt,
		"categories":         []string{"jailbreak"},
		"count":              10,
		"difficulty":         "medium",
		"include_multi_turn": false,
	}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/evolution/generate", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *EvolutionService) Evolve(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/evolution/evolve", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *EvolutionService) Stats(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/evolution/stats", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
