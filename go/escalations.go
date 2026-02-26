package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type EscalationsService struct {
	t *internal.Transport
}

func (s *EscalationsService) Create(ctx context.Context, req models.EscalationCreateRequest) (*models.Escalation, error) {
	var resp models.Escalation
	if err := s.t.Do(ctx, "POST", "/escalations", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EscalationsService) Get(ctx context.Context, id string) (*models.Escalation, error) {
	var resp models.Escalation
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/escalations/%s", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EscalationsService) List(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.Escalation], error) {
	var resp models.PaginatedResponse[models.Escalation]
	path := buildPath("/escalations", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EscalationsService) Resolve(ctx context.Context, id string, req models.EscalationResolveRequest) (*models.Escalation, error) {
	var resp models.Escalation
	if err := s.t.Do(ctx, "POST", fmt.Sprintf("/escalations/%s/resolve", id), req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EscalationsService) Assign(ctx context.Context, id string, req models.EscalationAssignRequest) (*models.Escalation, error) {
	var resp models.Escalation
	if err := s.t.Do(ctx, "POST", fmt.Sprintf("/escalations/%s/assign", id), req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EscalationsService) Claim(ctx context.Context, id string) (*models.Escalation, error) {
	var resp models.Escalation
	if err := s.t.Do(ctx, "POST", fmt.Sprintf("/escalations/%s/claim", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *EscalationsService) Stats(ctx context.Context) (*models.EscalationStats, error) {
	var resp models.EscalationStats
	if err := s.t.Do(ctx, "GET", "/escalations/stats", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
