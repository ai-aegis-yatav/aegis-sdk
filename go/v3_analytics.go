package aegis

import (
	"context"
	"fmt"
	"net/url"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// V3AnalyticsService — V3 analytics (explain, layer stats, attack clusters, baseline).
type V3AnalyticsService struct {
	t *internal.Transport
}

func v3AnalyticsQuery(params map[string]string) string {
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

func (s *V3AnalyticsService) Explain(ctx context.Context, judgmentID string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v3/analytics/explain/%s", judgmentID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *V3AnalyticsService) LayerStats(ctx context.Context, params map[string]string) (map[string]any, error) {
	var resp map[string]any
	path := "/v3/analytics/layer-stats" + v3AnalyticsQuery(params)
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *V3AnalyticsService) AttackClusters(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/analytics/attack-clusters", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *V3AnalyticsService) Baseline(ctx context.Context, params map[string]string) (map[string]any, error) {
	var resp map[string]any
	path := "/v3/analytics/baseline" + v3AnalyticsQuery(params)
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
