package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type AdversaFlowService struct {
	t *internal.Transport
}

func (s *AdversaFlowService) Campaigns(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.Campaign], error) {
	var resp models.PaginatedResponse[models.Campaign]
	path := buildPath("/adversaflow/campaigns", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdversaFlowService) Tree(ctx context.Context, campaignID string) (*models.AttackTree, error) {
	var resp models.AttackTree
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/adversaflow/campaigns/%s/tree", campaignID), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdversaFlowService) Trace(ctx context.Context, campaignID string) ([]models.TraceEntry, error) {
	var resp []models.TraceEntry
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/adversaflow/campaigns/%s/trace", campaignID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AdversaFlowService) Stats(ctx context.Context) (*models.AdversaFlowStats, error) {
	var resp models.AdversaFlowStats
	if err := s.t.Do(ctx, "GET", "/adversaflow/stats", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdversaFlowService) Record(ctx context.Context, req models.RecordRequest) (*models.RecordResponse, error) {
	var resp models.RecordResponse
	if err := s.t.Do(ctx, "POST", "/adversaflow/record", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
