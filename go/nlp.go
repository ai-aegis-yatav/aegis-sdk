package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// NLPService — V1 natural language processing.
type NLPService struct {
	t *internal.Transport
}

func (s *NLPService) post(ctx context.Context, path, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", path, map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *NLPService) DetectLanguage(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v1/nlp/detect-language", text)
}
func (s *NLPService) DetectJailbreak(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v1/nlp/detect-jailbreak", text)
}
func (s *NLPService) DetectHarmful(ctx context.Context, text string) (map[string]any, error) {
	return s.post(ctx, "/v1/nlp/detect-harmful", text)
}
