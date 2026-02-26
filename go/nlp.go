package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
	"github.com/ai-aegis-yatav/aegis-sdk/go/models"
)

type NLPService struct {
	t *internal.Transport
}

func (s *NLPService) DetectLanguage(ctx context.Context, req models.LanguageDetectRequest) (*models.LanguageDetectResponse, error) {
	var resp models.LanguageDetectResponse
	if err := s.t.Do(ctx, "POST", "/nlp/detect-language", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *NLPService) DetectJailbreak(ctx context.Context, req models.JailbreakDetectRequest) (*models.JailbreakDetectResponse, error) {
	var resp models.JailbreakDetectResponse
	if err := s.t.Do(ctx, "POST", "/nlp/detect-jailbreak", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (s *NLPService) DetectHarmful(ctx context.Context, req models.HarmfulDetectRequest) (*models.HarmfulDetectResponse, error) {
	var resp models.HarmfulDetectResponse
	if err := s.t.Do(ctx, "POST", "/nlp/detect-harmful", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}
