package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// MLService — V1 ML inference.
type MLService struct {
	t *internal.Transport
}

func (s *MLService) Health(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "GET", "/v1/ml/health", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MLService) Embed(ctx context.Context, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ml/embed", map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MLService) EmbedBatch(ctx context.Context, texts []string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ml/embed/batch", map[string]any{"texts": texts}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MLService) Classify(ctx context.Context, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ml/classify", map[string]any{"text": text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *MLService) Similarity(ctx context.Context, query string, documents []string) (map[string]any, error) {
	body := map[string]any{"query": query}
	if documents != nil {
		body["documents"] = documents
	}
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v1/ml/similarity", body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
