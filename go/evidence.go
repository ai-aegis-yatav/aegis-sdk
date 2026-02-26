package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type EvidenceService struct {
	t *internal.Transport
}

func (s *EvidenceService) Get(ctx context.Context, id string) (*models.Evidence, error) {
	var resp models.Evidence
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/evidence/%s", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EvidenceService) List(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.Evidence], error) {
	var resp models.PaginatedResponse[models.Evidence]
	path := buildPath("/evidence", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EvidenceService) Verify(ctx context.Context, id string) (*models.Evidence, error) {
	var resp models.Evidence
	if err := s.t.Do(ctx, "POST", fmt.Sprintf("/evidence/%s/verify", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EvidenceService) ForJudgment(ctx context.Context, judgmentID string) ([]models.Evidence, error) {
	var resp []models.Evidence
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/judge/%s/evidence", judgmentID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
