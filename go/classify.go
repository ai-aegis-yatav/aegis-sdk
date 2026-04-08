package aegis

import (
	"context"

	"github.com/ai-aegis-yatav/aegis-sdk/go/internal"
)

// ClassifyService — V2 content classification.
type ClassifyService struct {
	t *internal.Transport
}

type ClassifyV2Request struct {
	Text string `json:"text"`
}

type ClassifyV2BatchRequest struct {
	Texts []string `json:"texts"`
}

func (s *ClassifyService) Classify(ctx context.Context, text string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/classify", ClassifyV2Request{Text: text}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *ClassifyService) Batch(ctx context.Context, texts []string) (map[string]any, error) {
	var resp map[string]any
	if err := s.t.Do(ctx, "POST", "/v2/classify/batch", ClassifyV2BatchRequest{Texts: texts}, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *ClassifyService) Categories(ctx context.Context) (any, error) {
	var resp any
	if err := s.t.Do(ctx, "GET", "/v2/classify/categories", nil, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}
