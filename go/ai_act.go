package aegis

import (
	"context"
	"fmt"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type AiActService struct {
	t *internal.Transport
}

func (s *AiActService) Watermark(ctx context.Context, req models.WatermarkRequest) (*models.WatermarkResponse, error) {
	var resp models.WatermarkResponse
	if err := s.t.Do(ctx, "POST", "/ai-act/watermark", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AiActService) Verify(ctx context.Context, token string) (*models.WatermarkVerifyResponse, error) {
	var resp models.WatermarkVerifyResponse
	body := map[string]string{"token": token}
	if err := s.t.Do(ctx, "POST", "/ai-act/watermark/verify", body, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AiActService) PiiDetect(ctx context.Context, req models.PiiDetectRequest) (*models.PiiDetectResponse, error) {
	var resp models.PiiDetectResponse
	if err := s.t.Do(ctx, "POST", "/ai-act/pii-detect", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AiActService) RiskAssess(ctx context.Context, req models.RiskAssessRequest) (*models.RiskAssessResponse, error) {
	var resp models.RiskAssessResponse
	if err := s.t.Do(ctx, "POST", "/ai-act/risk-assess", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AiActService) Guidelines(ctx context.Context) (*models.GuidelinesResponse, error) {
	var resp models.GuidelinesResponse
	if err := s.t.Do(ctx, "GET", "/ai-act/guidelines", nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AiActService) AuditLogs(ctx context.Context, params models.ListParams) (*models.PaginatedResponse[models.AuditLog], error) {
	var resp models.PaginatedResponse[models.AuditLog]
	path := buildPath("/ai-act/audit-logs", params.ToQuery())
	if err := s.t.Do(ctx, "GET", path, nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

// AuditLog retrieves a single audit log entry by ID.
func (s *AiActService) AuditLog(ctx context.Context, id string) (*models.AuditLog, error) {
	var resp models.AuditLog
	if err := s.t.Do(ctx, "GET", fmt.Sprintf("/ai-act/audit-logs/%s", id), nil, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
