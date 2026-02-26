package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type EvolutionService struct {
	t *internal.Transport
}

func (s *EvolutionService) Generate(ctx context.Context, req models.EvolutionGenerateRequest) (*models.EvolutionGenerateResponse, error) {
	var resp models.EvolutionGenerateResponse
	if err := s.t.Do(ctx, "POST", "/evolution/generate", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EvolutionService) Evolve(ctx context.Context, req models.EvolutionEvolveRequest) (*models.EvolutionEvolveResponse, error) {
	var resp models.EvolutionEvolveResponse
	if err := s.t.Do(ctx, "POST", "/evolution/evolve", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EvolutionService) Stats(ctx context.Context) (*models.EvolutionStats, error) {
	var resp models.EvolutionStats
	if err := s.t.Do(ctx, "GET", "/evolution/stats", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
