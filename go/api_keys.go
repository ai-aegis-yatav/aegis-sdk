package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type ApiKeysService struct {
	t *internal.Transport
}

func (s *ApiKeysService) Create(ctx context.Context, req models.ApiKeyCreateRequest) (*models.ApiKeyCreateResponse, error) {
	var resp models.ApiKeyCreateResponse
	if err := s.t.Do(ctx, "POST", "/v1/api-keys", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *ApiKeysService) List(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.ApiKey], error) {
	var resp models.PaginatedResponse[models.ApiKey]
	path := buildPath("/v1/api-keys", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *ApiKeysService) Get(ctx context.Context, id string) (*models.ApiKey, error) {
	var resp models.ApiKey
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v1/api-keys/%s", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *ApiKeysService) Revoke(ctx context.Context, id string) error {
	return s.t.Do(ctx, "POST", fmt.Sprintf("/v1/api-keys/%s/revoke", id), nil, nil)
}

func (s *ApiKeysService) Delete(ctx context.Context, id string) error {
	return s.t.Do(ctx, "DELETE", fmt.Sprintf("/v1/api-keys/%s", id), nil, nil)
}
