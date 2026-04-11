package aegis

import (
	"context"
	"fmt"
	"net/url"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// TokenMonitorService — V3 token usage monitoring, quotas & alerts.
type TokenMonitorService struct {
	t *internal.Transport
}

func buildQuery(params map[string]string) string {
	if len(params) == 0 {
		return ""
	}
	q := url.Values{}
	for k, v := range params {
		if v != "" {
			q.Set(k, v)
		}
	}
	if encoded := q.Encode(); encoded != "" {
		return "?" + encoded
	}
	return ""
}

func (s *TokenMonitorService) Usage(ctx context.Context, params map[string]string) (map[string]any, error) {
	var resp map[string]any
	path := "/v3/token-monitor/usage" + buildQuery(params)
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *TokenMonitorService) ListQuotas(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/token-monitor/quotas", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *TokenMonitorService) CreateQuota(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/token-monitor/quotas", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *TokenMonitorService) UpdateQuota(ctx context.Context, id string, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "PATCH", fmt.Sprintf("/v3/token-monitor/quotas/%s", id), body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *TokenMonitorService) ListAlerts(ctx context.Context, params map[string]string) (map[string]any, error) {
	var resp map[string]any
	path := "/v3/token-monitor/alerts" + buildQuery(params)
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *TokenMonitorService) UpdateAlert(ctx context.Context, id string, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "PATCH", fmt.Sprintf("/v3/token-monitor/alerts/%s", id), body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *TokenMonitorService) Overview(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/token-monitor/overview", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
