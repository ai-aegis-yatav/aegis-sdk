package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// AdversaFlowService — V2 attack campaign tracking.
type AdversaFlowService struct {
	t *internal.Transport
}

func (s *AdversaFlowService) Campaigns(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v2/adversaflow/campaigns", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AdversaFlowService) Tree(ctx context.Context, campaignID string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v2/adversaflow/tree/%s", campaignID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AdversaFlowService) Trace(ctx context.Context, campaignID, nodeID string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v2/adversaflow/trace/%s/%s", campaignID, nodeID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AdversaFlowService) Stats(ctx context.Context, campaignID string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v2/adversaflow/stats/%s", campaignID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AdversaFlowService) Metrics(ctx context.Context, campaignID string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/v2/adversaflow/metrics/%s", campaignID), nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *AdversaFlowService) Record(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/adversaflow/record", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
