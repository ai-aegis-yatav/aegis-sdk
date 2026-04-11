package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// MilitaryService — V3 military/defense domain analysis.
type MilitaryService struct {
	t *internal.Transport
}

func (s *MilitaryService) AntiSpoofing(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/anti-spoofing/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) Classification(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/classification/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) CommandChain(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/command-chain/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) CrossDomain(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/cross-domain/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) Opsec(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/opsec/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) Roe(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/roe/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) TacticalAutonomy(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/tactical-autonomy/analyze", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) Orchestrate(ctx context.Context, body map[string]any) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v3/military/orchestrate", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MilitaryService) Status(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v3/military/status", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
