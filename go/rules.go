package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type RulesService struct {
	t *internal.Transport
}

func (s *RulesService) Create(ctx context.Context, req models.RuleCreateRequest) (*models.Rule, error) {
	var resp models.Rule
	if err := s.t.Do(ctx, "POST", "/v1/rules", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *RulesService) Get(ctx context.Context, id string) (*models.Rule, error) {
	var resp models.Rule
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v1/rules/%s", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *RulesService) Update(ctx context.Context, id string, req models.RuleUpdateRequest) (*models.Rule, error) {
	var resp models.Rule
	if err := s.t.Do(ctx, "PATCH", fmt.Sprintf("/v1/rules/%s", id), req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *RulesService) Delete(ctx context.Context, id string) error {
	return s.t.Do(ctx, "DELETE", fmt.Sprintf("/v1/rules/%s", id), nil, nil)
}

func (s *RulesService) List(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.Rule], error) {
	var resp models.PaginatedResponse[models.Rule]
	path := buildPath("/v1/rules", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *RulesService) Test(ctx context.Context, req models.RuleTestRequest) (*models.RuleTestResponse, error) {
	var resp models.RuleTestResponse
	if err := s.t.Do(ctx, "POST", "/v1/rules/test", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *RulesService) Reload(ctx context.Context) error {
	return s.t.Do(ctx, "POST", "/v1/rules/reload", nil, nil)
}

func (s *RulesService) Templates(ctx context.Context) ([]models.RuleTemplate, error) {
	var resp []models.RuleTemplate
	if err := s.t.Do(ctx, "GET", "/v1/rules/templates", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *RulesService) Seed(ctx context.Context) error {
	return s.t.Do(ctx, "POST", "/v1/rules/seed", nil, nil)
}
