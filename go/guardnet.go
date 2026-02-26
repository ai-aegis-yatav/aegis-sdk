package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type GuardNetService struct {
	t *internal.Transport
}

func (s *GuardNetService) Analyze(ctx context.Context, req models.GuardNetAnalyzeRequest) (*models.GuardNetAnalyzeResponse, error) {
	var resp models.GuardNetAnalyzeResponse
	if err := s.t.Do(ctx, "POST", "/guardnet/analyze", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *GuardNetService) JBShield(ctx context.Context, req models.JBShieldRequest) (*models.JBShieldResponse, error) {
	var resp models.JBShieldResponse
	if err := s.t.Do(ctx, "POST", "/guardnet/jbshield", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *GuardNetService) CCFC(ctx context.Context, req models.CCFCRequest) (*models.CCFCResponse, error) {
	var resp models.CCFCResponse
	if err := s.t.Do(ctx, "POST", "/guardnet/ccfc", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *GuardNetService) MULI(ctx context.Context, req models.MULIRequest) (*models.MULIResponse, error) {
	var resp models.MULIResponse
	if err := s.t.Do(ctx, "POST", "/guardnet/muli", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *GuardNetService) Unified(ctx context.Context, req models.UnifiedRequest) (*models.UnifiedResponse, error) {
	var resp models.UnifiedResponse
	if err := s.t.Do(ctx, "POST", "/guardnet/unified", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
