package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type AdvancedService struct {
	t *internal.Transport
}

func (s *AdvancedService) Detect(ctx context.Context, req models.AdvancedDetectRequest) (*models.AdvancedDetectResponse, error) {
	var resp models.AdvancedDetectResponse
	if err := s.t.Do(ctx, "POST", "/advanced/detect", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdvancedService) HybridWeb(ctx context.Context, req models.HybridWebRequest) (*models.HybridWebResponse, error) {
	var resp models.HybridWebResponse
	if err := s.t.Do(ctx, "POST", "/advanced/hybrid-web", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdvancedService) VSH(ctx context.Context, req models.VSHRequest) (*models.VSHResponse, error) {
	var resp models.VSHResponse
	if err := s.t.Do(ctx, "POST", "/advanced/vsh", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdvancedService) FewShot(ctx context.Context, req models.FewShotRequest) (*models.FewShotResponse, error) {
	var resp models.FewShotResponse
	if err := s.t.Do(ctx, "POST", "/advanced/few-shot", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdvancedService) CoT(ctx context.Context, req models.CoTRequest) (*models.CoTResponse, error) {
	var resp models.CoTResponse
	if err := s.t.Do(ctx, "POST", "/advanced/cot", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdvancedService) Acoustic(ctx context.Context, req models.AcousticRequest) (*models.AcousticResponse, error) {
	var resp models.AcousticResponse
	if err := s.t.Do(ctx, "POST", "/advanced/acoustic", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdvancedService) ContextConfusion(ctx context.Context, req models.ContextConfusionRequest) (*models.ContextConfusionResponse, error) {
	var resp models.ContextConfusionResponse
	if err := s.t.Do(ctx, "POST", "/advanced/context-confusion", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *AdvancedService) InfoExtraction(ctx context.Context, req models.InfoExtractionRequest) (*models.InfoExtractionResponse, error) {
	var resp models.InfoExtractionResponse
	if err := s.t.Do(ctx, "POST", "/advanced/info-extraction", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
